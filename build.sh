#!/bin/bash

# Install Node dependencies
npm install

python3 -m pip install --break-system-packages -r octra_pre_client/requirements.txt
