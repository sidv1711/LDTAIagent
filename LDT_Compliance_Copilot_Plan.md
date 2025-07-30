
# LDT Compliance Copilot – Development Plan & Demo Guide

*(Strategy 1: curated local corpus, 2‑hour hackathon build)*

---

## 0. Prerequisites
| Tool | Version / Notes |
|------|-----------------|
| **Python** | ≥ 3.9 |
| **Repo template** | `git clone https://github.com/Hannahhiendo/build-an-agent ldt-copilot` |
| **Env setup** | `python -m venv .venv && source .venv/bin/activate` |
| **Packages** | `pip install -r requirements.txt faiss-cpu nemo-guardrails pdfkit textract` |
| **System deps** | wkhtmltopdf (for pdfkit) |

---

## 1. Curate & Store Guidance Corpus (~10 min)
1. Create `corpus/` folder.  
2. Download PDFs of:  
   * Draft **LDT Proposed Rule 2023**  
   * **21 CFR § 809** (labeling) excerpts  
   * **21 CFR § 820** (Quality System) key subparts  
   * **CLIA ’88** validation checklist excerpts  
3. Save into `corpus/`, commit to repo.

---

## 2. Build Vector Store (~15 min)
```python
# scripts/build_vector_store.py
import glob
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

split = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=150)
emb   = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
docs  = []
for pdf in glob.glob("corpus/*.pdf"):
    docs += split.split_documents(PyPDFLoader(pdf).load())

FAISS.from_documents(docs, emb).save_local("stores/fda_clia")
print(f"Indexed {len(docs)} chunks.")
```
Run once: `python scripts/build_vector_store.py`

---

## 3. Load Store in Template (~5 min)
```python
# agent/knowledge_base.py
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
knowledge_base = FAISS.load_local(
    "stores/fda_clia",
    embeddings=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
)
```

---

## 4. Hook NVIDIA Nemotron 3.3 Endpoint (~10 min)
```python
# agent/nemotron_llm.py
import os, requests

API = "https://api.nvcf.nvidia.com/v2/nvcf/…/nemotron-3_3"
HEAD = {"Authorization": f"Bearer {os.getenv('NVIDIA_API_KEY')}"}

def nemotron(prompt:str) -> str:
    body = {"inputs":[{"text":prompt}]}
    r = requests.post(API, json=body, headers=HEAD, timeout=30)
    return r.json()["choices"][0]["message"]["content"]
```
Swap any OpenAI calls in the repo for `nemotron()`.

---

## 5. Gap‑Critic Helper (~10 min)
```python
# agent/gap_critic.py
REQUIRED = {
 "Intended Use": "population, analyte, condition",
 "Analytical Validity": "LoD, LoB, precision, linearity data",
 "Clinical Validity": "clinical study & stats",
 "Quality System": "reference 21 CFR 820 or ISO 13485",
 "Risk Assessment": "provide FMEA / hazard analysis"
}

def missing_sections(txt:str) -> dict:
    low = txt.lower(); missing={}
    for k,v in REQUIRED.items():
        if k.lower() not in low:
            missing[k]=v
    return missing
```

---

## 6. Markdown → PDF Template (~5 min)
`templates/report_template.md`
```markdown
# Compliance Gap Report – {{ date }}

## Missing Sections
{% for section, hint in missing.items() %}
- [ ] **{{ section }}** – _{{ hint }}_
{% endfor %}

## Agent Rationale
{{ prose }}

## Key Regulatory Citations
{% for src in sources %}
> {{ src.page_content[:240] }} …  
> *{{ src.metadata.source }}*
{% endfor %}
```

---

## 7. Agent Orchestration (~15 min)
```python
# agent/run.py
from jinja2 import Template
from datetime import date
from gap_critic import missing_sections
from nemotron_llm import nemotron
from knowledge_base import knowledge_base
template = Template(open("templates/report_template.md").read())

def generate_gap_report(user_txt:str):
    gaps = missing_sections(user_txt)
    chunks=[]
    for k in gaps: chunks += knowledge_base.similarity_search(k, k=2)
    context="
".join(c.page_content for c in chunks[:6])
    prose = nemotron(
        f"Explain why these sections are mandatory for an LDT and cite CFR. "
        f"Sections missing: {list(gaps.keys())}
Context:
{context}")
    md = template.render(missing=gaps, prose=prose, sources=chunks, date=date.today())
    return md
```

---

## 8. Streamlit UI (~10 min)
```python
import streamlit as st, textract, pdfkit, tempfile
from agent.run import generate_gap_report

st.title("LDT Compliance Copilot")
file = st.file_uploader("Upload draft submission (PDF/DOCX)", type=["pdf","docx"])
if file and st.button("Generate Gap Report"):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(file.read()); path=tmp.name
    text = textract.process(path).decode("utf-8","ignore")
    md = generate_gap_report(text)
    pdfkit.from_string(md, "GapReport.pdf")
    st.download_button("📄 Download Gap Report", open("GapReport.pdf","rb"),
                       file_name="GapReport.pdf")
```

---

## 9. Optional Q&A Chat (~15 min)
```python
from langchain.chains import ConversationalRetrievalChain
qa = ConversationalRetrievalChain.from_llm(
        nemotron,
        retriever=knowledge_base.as_retriever({"k":4}),
        return_source_documents=True)
history=[]
q = st.chat_input("Ask a compliance question")
if q:
    res = qa({"question":q, "chat_history":history})
    history.append((q, res["answer"]))
    st.chat_message("assistant").write(res["answer"])
```

---

## 10. Guardrails (~5 min)
`rails/ldt_rails.clg`
```
when user_says X:
    if "legal advice" in X.lower():
        bot_says "I provide regulatory guidance, not legal counsel."
    else: go_next
```

---

## 11. Timeline (2‑Hour Build)
| Minutes | Milestone |
|---------|-----------|
| 0‑25  | Env, corpus download, vector store |
| 25‑40 | Nemotron wrapper, KB loader        |
| 40‑55 | Gap‑Critic + template              |
| 55‑75 | Agent orchestration & PDF gen      |
| 75‑95 | Streamlit UI                       |
| 95‑110| End‑to‑end test                    |
| 110‑120| Screenshots & polish              |

---

## 12. Demo Script (3 min)
1. **Upload draft** → click **Generate Gap Report**  
2. 30 s progress bar → **GapReport.pdf** downloads  
3. Open PDF: missing sections checklist + CFR citations  
4. Ask chat: “Do I meet CLIA personnel requirements?” → cited answer  
5. Upload fixed draft → new report shows improved checklist  
6. Close: “Copilot finds missing FDA/CLIA requirements in under a minute.”

---

## 13. Deliverables
* **GapReport.pdf** sample  
* Live Streamlit link (Brev)  
* GitHub repo with code & `corpus/` docs  

> **Pitch:** *“Upload your LDT draft—our copilot scans FDA & CLIA guidance, flags missing sections, and outputs a PDF Gap Report in under 60 seconds.”*
