#!/bin/bash
npm install

# Create Python virtual environment inside the project
python3 -m venv octra_pre_client/venv

# Activate it and install dependencies
source octra_pre_client/venv/bin/activate
pip install --upgrade pip
pip install -r octra_pre_client/requirements.txt
