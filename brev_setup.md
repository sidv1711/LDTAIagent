# 🌐 Brev Deployment Guide for LDT Compliance Copilot

## What is Brev?
Brev provides cloud-hosted development environments and easy app deployment. Perfect for hosting your Streamlit demo.

## 🚀 Quick Brev Setup

### 1. Install Brev CLI
```bash
# Install Brev CLI
curl -o- https://raw.githubusercontent.com/brevdev/brev-cli/main/install.sh | bash

# Or via npm
npm install -g @brevdev/brev-cli
```

### 2. Login to Brev
```bash
brev login
# Follow the authentication flow
```

### 3. Create Brev Environment
```bash
# From your project directory
brev create ldt-copilot --machine-type g4dn.xlarge
```

### 4. Upload Your Project
```bash
# Sync your project to Brev
brev sync ldt-copilot
```

## 📋 Brev Configuration Files

### Create `brev.yaml` (Environment Config)
```yaml
name: ldt-copilot
machine_type: g4dn.xlarge
ports:
  - 8501
setup_script: |
  pip install -r requirements-ldt.txt
  python scripts/build_vector_store.py
start_script: |
  streamlit run app.py --server.port 8501 --server.address 0.0.0.0
```

### Create `.brevignore` (What not to sync)
```
.venv/
__pycache__/
*.pyc
.git/
stores/
.DS_Store
```

## 🔧 Environment Variables for Brev

### Set your NVIDIA API key in Brev:
```bash
brev env set NVIDIA_API_KEY your_nvidia_api_key_here
```

## 📝 Alternative: Manual Brev Setup

### 1. Create the configuration files I mentioned above
### 2. Push to GitHub (your fork)
### 3. Create Brev environment from GitHub:

```bash
brev create ldt-copilot --repo https://github.com/sidv1711/LDTAIagent
```

## 🌟 Live Demo URL

Once deployed, Brev will give you a public URL like:
`https://ldt-copilot-abc123.brev.dev`

## 🔗 Alternative Hosting Options

If Brev doesn't work out, here are other options:

### Streamlit Cloud (Free)
1. Push to GitHub
2. Go to https://share.streamlit.io/
3. Connect your repo
4. Deploy directly

### Replit (Easy)
1. Import from GitHub
2. Set environment variables
3. Run with `python run_app.py`

### Railway (Simple)
1. Connect GitHub repo
2. Set environment variables
3. Railway auto-detects Python apps

## 🎯 For Your 2-Hour Sprint Demo

**Quickest option for live demo:**
1. **Local + ngrok**: `ngrok http 8501` (instant public URL)
2. **Streamlit Cloud**: Push to GitHub → Connect → Deploy (5 minutes)
3. **Brev**: Follow the steps above (10-15 minutes)

**Your app is already running locally on http://localhost:8501** - perfect for your demo! 🚀