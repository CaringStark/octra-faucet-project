#!/bin/bash

# Install Node dependencies
npm install

# Install pipx if not already available
python3 -m ensurepip --upgrade
python3 -m pip install --upgrade pip pipx
python3 -m pipx ensurepath

# Install Python requirements into isolated environment
pipx install . --spec "aiohttp pynacl pyperclip"
