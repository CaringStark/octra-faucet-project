#!/bin/bash

# Step 1: Create virtualenv
python3 -m venv .venv

# Step 2: Activate it
source .venv/bin/activate

# Step 3: Install requirements
pip install --upgrade pip
pip install -r octra_pre_client/requirements.txt
