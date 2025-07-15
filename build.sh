#!/bin/bash

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip & install requirements
pip install --upgrade pip
pip install -r octra_pre_client/requirements.txt
