```markdown
# 🧪 Octra Faucet

This is a custom token faucet built for the [Octra Protocol](https://octra.org), using their official wallet CLI (`octra_pre_client`). It lets users request testnet OCT tokens from a web-based interface, powered by Node.js and Python.

---

## 🚀 Features

- 🎛️ CLI-powered transfers (non-EVM)
- 📬 Rate limiting (per wallet + per IP)
- 💡 Toast notifications + clean UI
- 🔒 Private key never exposed (uses CLI under the hood)

---

## 📦 Built With

- 🟦 Node.js (Express)
- 🐍 Python3 + aiohttp + pynacl
- 🧠 Octra CLI (`octra_pre_client`)
- 🧱 HTML + CSS frontend

---

## 🧬 Powered by Octra Protocol

This project uses code and tooling from [Octra Labs](https://github.com/octra-labs), including the open-source CLI:

🔗 https://github.com/octra-labs/octra_pre_client

> Big respect to the Octra team for the tooling and protocol ❤️

---

## 📁 Folder Overview (if helpful)

```

faucet-project/
├── server.js
├── .env                # Not committed
├── octra\_pre\_client/   # CLI and wallet
├── frontend/           # Optional frontend
├── requirements.txt
└── README.md

````

---

## 🛠 Author

Made with 💙 by **@CaringStark**

---