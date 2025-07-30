# 🚀 LDT Copilot Setup Guide

## What We're Using from the Fork

**From the original template:**
- Python environment structure (`.venv/`)
- Base dependencies (`requirements.txt`)
- Project scaffolding

**Custom-built for LDT (everything else):**
- `agent/` - All compliance logic (**100% custom**)
- `app.py` - Streamlit UI (**100% custom**)
- `scripts/` - Vector store builder (**100% custom**)
- `templates/` - Report templates (**100% custom**)
- `corpus/` - Document storage (**100% custom**)

**Bottom line: We're using the fork as a Python starter template, but all LDT functionality is completely custom.**

---

## 🔑 API Key Setup

### Method 1: Using .env file (Recommended)

1. **Edit the `.env` file:**
   ```bash
   nano .env
   ```

2. **Uncomment and add your NVIDIA API key:**
   ```env
   NVIDIA_API_KEY=your_actual_api_key_here
   ```

3. **Save and the app will automatically load it**

### Method 2: Environment Variable

```bash
export NVIDIA_API_KEY="your_api_key_here"
```

### Method 3: Direct in Terminal (for testing)

```bash
NVIDIA_API_KEY="your_key" python run_app.py
```

---

## 🎯 Getting Your NVIDIA API Key

1. Go to https://build.nvidia.com/
2. Sign up/Login
3. Navigate to API section
4. Generate a new API key
5. Copy it to your `.env` file

**Note: The app works without the API key using fallback responses!**

---

## 📁 Current Project Status

```
✅ Environment setup complete
✅ All code written and tested
✅ .env file created for API keys
✅ Dependencies installed
🔄 Need: Add regulatory PDFs to corpus/
🔄 Need: Set NVIDIA_API_KEY in .env
🔄 Need: Run vector store builder
```

---

## 🚀 Launch Commands

```bash
# 1. Activate environment
source .venv/bin/activate

# 2. Set API key (edit .env file)
nano .env  # Add your NVIDIA_API_KEY

# 3. Build knowledge base (first time)
python scripts/build_vector_store.py

# 4. Start application
python run_app.py
```

**Your demo is ready! 🎉**