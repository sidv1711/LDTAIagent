#!/bin/bash
# Brev setup script for LDT Compliance Copilot

echo "🔬 Setting up LDT Compliance Copilot..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements-ldt.txt

# Build knowledge base
echo "🧠 Building knowledge base..."
python scripts/build_vector_store.py

echo "✅ Setup complete! Starting application..."