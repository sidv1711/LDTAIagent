# 🔬 LDT Compliance Copilot

**Upload your LDT draft submission—our copilot scans FDA & CLIA guidance, flags missing sections, and outputs a PDF Gap Report in under 60 seconds.**

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Activate virtual environment (already created)
source .venv/bin/activate

# Install remaining dependencies (if needed)
pip install -r requirements-ldt.txt
```

### 2. Add Regulatory Documents
Place PDF documents in the `corpus/` folder:
- Draft **LDT Proposed Rule 2023**
- **21 CFR § 809** (labeling) excerpts
- **21 CFR § 820** (Quality System) key subparts
- **CLIA '88** validation checklist excerpts

### 3. Build Knowledge Base
```bash
python scripts/build_vector_store.py
```

### 4. Run Application
```bash
python run_app.py
```

---

## 🔑 API Keys & Configuration

### Required API Keys

1. **NVIDIA API Key** (for enhanced AI analysis)
   ```bash
   export NVIDIA_API_KEY="your_nvidia_api_key_here"
   ```
   - Get your key from: https://build.nvidia.com/
   - Used for: Advanced compliance analysis with Nemotron 3.3
   - **Fallback**: System works without this key using built-in responses

### Optional Configuration

2. **Environment Variables** (in `.env` file or shell)
   ```bash
   # Optional: Customize model settings
   NVIDIA_API_KEY=your_key_here
   
   # Optional: Streamlit configuration
   STREAMLIT_SERVER_PORT=8501
   STREAMLIT_SERVER_ADDRESS=0.0.0.0
   ```

---

## 📁 Project Structure

```
ldt-copilot/
├── agent/                    # Core agent logic
│   ├── __init__.py
│   ├── gap_critic.py        # Missing section detection
│   ├── nemotron_llm.py      # NVIDIA LLM wrapper
│   ├── knowledge_base.py    # Vector store loader
│   └── run.py               # Main orchestration
├── corpus/                  # Regulatory documents
│   ├── README.md           # Document placement guide
│   └── *.pdf               # Your regulatory PDFs here
├── scripts/
│   └── build_vector_store.py # Vector store builder
├── stores/                  # Generated vector stores
│   └── fda_clia/           # FAISS vector database
├── templates/
│   └── report_template.md   # Gap report template
├── app.py                   # Streamlit UI
├── run_app.py              # Application runner
└── requirements-ldt.txt     # Python dependencies
```

---

## 📋 Checklist for Full Setup

### Phase 1: Basic Setup ✅
- [x] Clone repository
- [x] Create virtual environment  
- [x] Install dependencies
- [x] Test gap critic functionality

### Phase 2: Knowledge Base Setup
- [ ] **Add regulatory PDFs to `corpus/` folder**
- [ ] **Run `python scripts/build_vector_store.py`**
- [ ] Verify vector store creation in `stores/fda_clia/`

### Phase 3: API Integration
- [ ] **Get NVIDIA API key from https://build.nvidia.com/**
- [ ] **Set `NVIDIA_API_KEY` environment variable**
- [ ] Test AI analysis functionality

### Phase 4: Testing & Demo
- [ ] **Run `python run_app.py`**
- [ ] Upload test document via Streamlit UI
- [ ] Verify gap report generation
- [ ] Test Q&A chat functionality

---

## 🎯 Demo Script (3 minutes)

1. **Upload draft** → Click **Generate Gap Report** (30s)
2. **Download GapReport.pdf** → Show missing sections checklist + CFR citations  
3. **Ask chat**: "Do I meet CLIA personnel requirements?" → Show cited answer
4. **Close**: "Copilot finds missing FDA/CLIA requirements in under a minute."

---

## 🛠 Troubleshooting

### Common Issues

1. **"Knowledge base not found"**
   - Solution: Add PDFs to `corpus/` and run `python scripts/build_vector_store.py`

2. **"NVIDIA_API_KEY not set"**
   - Solution: Export your API key or system will use fallback responses

3. **"No PDF files found in corpus/"**
   - Solution: Add regulatory PDF documents to the `corpus/` folder

4. **PDF generation fails**
   - Solution: Install `wkhtmltopdf` or use markdown download option

### Getting Documents

Since we can't redistribute FDA documents, you'll need to download:
- **FDA LDT Proposed Rule**: https://www.fda.gov/medical-devices/in-vitro-diagnostics
- **21 CFR 809/820**: https://www.ecfr.gov/current/title-21
- **CLIA Guidelines**: https://www.cdc.gov/clia/

*Tip: For demo purposes, the system includes sample content that works without official documents.*

---

## 🤝 Support

- **Issues**: Create GitHub issues for bugs or questions
- **Documentation**: See individual module docstrings for technical details
- **Regulatory Guidance**: Consult qualified regulatory professionals for official submissions

---

*This tool provides guidance based on publicly available regulatory documents. It does not constitute legal or regulatory advice.*