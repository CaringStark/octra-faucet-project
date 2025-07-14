#!/bin/bash

# Install Node.js dependencies
npm install

# Set up Python venv and install packages inside it
python3 -m venv octra_pre_client/venv
source octra_pre_client/venv/bin/activate
pip install --prefer-binary -r octra_pre_client/requirements.txt
