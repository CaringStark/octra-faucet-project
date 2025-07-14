require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require("path");
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const FAUCET_AMOUNT = 1; // fixed token amount per request
const CLI_PATH = path.resolve(process.env.CLIPATH || 'octra_pre_client/cli.py');
const PYTHON = path.resolve(process.env.PYTHON || 'octra_pre_client/venv/bin/python');

app.use(bodyParser.json());
const rateLimitMap = new Map(); // Store address into lastRequestTime
const ipRateLimitMap = new Map(); // Store IP into lastRequestTime
const RATE_LIMIT_SECONDS = 21600; // 1 request every 6 hours
const IP_RATE_LIMIT_SECONDS = 21600; // 1 request every 6 hours


app.post('/request-tokens', (req, res) => {
  const address = req.body.address;
  const ip = req.ip;
  const now = Date.now();

  // I added an IP rate limit here
  const ipLast = ipRateLimitMap.get(ip) || 0;
  if (now - ipLast < IP_RATE_LIMIT_SECONDS * 1000) {
    return res.status(429).json({
      error: 'IP rate limit exceeded',
      nextRequestIn: `${Math.ceil((IP_RATE_LIMIT_SECONDS * 1000 - (now - ipLast)) / 1000)} seconds`
    });
  }
  // After passing IP rate limit
  ipRateLimitMap.set(ip, now);

  if (!address || !address.startsWith('oct')) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  // I added aN address rate limit here
  const lastRequestTime = rateLimitMap.get(address) || 0;

  if (now - lastRequestTime < RATE_LIMIT_SECONDS * 1000) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      nextRequestIn: `${Math.ceil((RATE_LIMIT_SECONDS * 1000 - (now - lastRequestTime)) / 1000)} seconds`
    });
  }

  // After passing rate limit
  rateLimitMap.set(address, now);

  const cmd = `${PYTHON} ${CLI_PATH} --command transfer --to ${address} --amount ${FAUCET_AMOUNT}`;
  console.log('\n📤 Running faucet command:\n', cmd); // <-- Debug print

  exec(cmd, { cwd: 'octra_pre_client' }, (error, stdout, stderr) => {

  if (error) {
    console.error('❌ CLI Error:', error);
    console.error('Stderr:', stderr);
    return res.status(500).json({ error: 'Transaction failed', details: stderr });
  }

  const lines = stdout.trim().split('\n');
  const txHash = lines.find(line => /^[a-f0-9]{64}$/.test(line)) || lines.pop();
  return res.json({ success: true, txHash });
  });

});

app.listen(port, () => {
  console.log(`✅ Faucet server running at http://localhost:${port}`);
});
