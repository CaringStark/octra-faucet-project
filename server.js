require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {
  exec
} = require('child_process');
const path = require("path");
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const FAUCET_AMOUNT = 5; // fixed token amount per request
const CLI_PATH = 'cli.py';
const PYTHON = process.env.PYTHON || 'python3';

app.use(bodyParser.json());
const rateLimitMap = new Map(); // Store address into lastRequestTime
const RATE_LIMIT_SECONDS = 43200; // 1 request every 12 hours

app.post('/request-tokens', (req, res) => {
  const address = req.body.address;
  const now = Date.now();

  // moved this to the top, has to be done first
  if (!address || !address.startsWith('oct')) {
    console.log(`🚫 Invalid address attempt at ${new Date().toISOString()}`);
    return res.status(400).json({
      error: 'Invalid address'
    });
  }

  const lastRequestTime = rateLimitMap.get(address) || 0;
  if (now - lastRequestTime < RATE_LIMIT_SECONDS * 1000) {
    console.log(`⏳ Address rate limit hit: ${address} at ${new Date().toISOString()}`);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      reason: 'you can only request tokens once every 12 hours',
      nextRequestIn: `${Math.ceil((RATE_LIMIT_SECONDS * 1000 - (now - lastRequestTime)) / 1000)} seconds`
    });
  }


  // now these save those info after passing checks
  rateLimitMap.set(address, now);

  // execution command from here!! Be Careful
  const cmd = `${PYTHON} ${CLI_PATH} --command transfer --to ${address} --amount ${FAUCET_AMOUNT}`;
  console.log('\n📤 Running faucet command:\n', cmd); // <-- Debug print

  exec(
    `${PYTHON} ${CLI_PATH} --command transfer --to ${address} --amount ${FAUCET_AMOUNT}`, {
      cwd: 'octra_pre_client'
    },
    (error, stdout, stderr) => {

      if (error) {
        console.error('❌ CLI Error:', error);
        console.error('Stderr:', stderr);
        return res.status(500).json({
          error: 'Transaction failed',
          details: stderr
        });
      }

      const lines = stdout.trim().split('\n');
      const txHash = lines.find(line => /^[a-f0-9]{64}$/.test(line)) || lines.pop();
      return res.json({
        success: true,
        txHash
      });
    });

});

app.listen(port, () => {
  console.log(`✅ Faucet server running at http://localhost:${port}`);
});
