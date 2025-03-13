#!/bin/bash

# Create a virtual environment named 'venv'
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt

echo "Setup complete. Virtual environment 'venv' created and requirements installed."
echo "To activate it, type:"
echo "source venv/bin/activate"