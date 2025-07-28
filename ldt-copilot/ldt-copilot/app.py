"""
LDT Compliance Copilot - Streamlit Application
"""
import streamlit as st
import tempfile
import os
import pdfkit
from io import BytesIO
from dotenv import load_dotenv
from agent.run import generate_gap_report, ask_compliance_question
from agent.knowledge_base import knowledge_base

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="LDT Compliance Copilot",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1e3a8a;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #64748b;
        text-align: center;
        margin-bottom: 2rem;
    }
    .status-box {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        border-left: 4px solid #10b981;
        background-color: #f0fdf4;
    }
    .warning-box {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        border-left: 4px solid #f59e0b;
        background-color: #fffbeb;
    }
    .error-box {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        border-left: 4px solid #ef4444;
        background-color: #fef2f2;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown('<h1 class="main-header">🔬 LDT Compliance Copilot</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Upload your LDT draft submission to get instant FDA & CLIA compliance analysis</p>', 
        unsafe_allow_html=True
    )
    
    # Sidebar
    with st.sidebar:
        st.header("📋 Features")
        st.markdown("""
        - **Gap Analysis**: Identifies missing regulatory sections
        - **Compliance Score**: Quantifies submission completeness  
        - **AI Guidance**: Expert recommendations with CFR citations
        - **PDF Report**: Download detailed analysis
        - **Q&A Chat**: Ask compliance questions
        """)
        
        st.header("📚 Supported Documents")
        st.markdown("""
        - PDF files (.pdf)
        - Word documents (.docx, .doc)
        - Text files (.txt)
        """)
        
        # Knowledge base status
        st.header("🧠 Knowledge Base")
        if knowledge_base:
            st.markdown('<div class="status-box">✅ Regulatory knowledge base loaded</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="warning-box">⚠️ Knowledge base not available</div>', unsafe_allow_html=True)
            st.markdown("Run `python scripts/build_vector_store.py` to build knowledge base")
    
    # Main content tabs
    tab1, tab2 = st.tabs(["📄 Gap Analysis", "💬 Compliance Q&A"])
    
    with tab1:
        gap_analysis_tab()
    
    with tab2:
        qa_chat_tab()

def gap_analysis_tab():
    """Gap analysis functionality"""
    st.header("📄 Upload Your LDT Submission")
    
    uploaded_file = st.file_uploader(
        "Choose a file (PDF, DOCX, or TXT)",
        type=['pdf', 'docx', 'doc', 'txt'],
        help="Upload your draft LDT submission for compliance analysis"
    )
    
    if uploaded_file is not None:
        # Show file details
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("File Name", uploaded_file.name)
        with col2:
            st.metric("File Size", f"{uploaded_file.size / 1024:.1f} KB")
        with col3:
            st.metric("File Type", uploaded_file.type)
        
        # Analysis button
        if st.button("🔍 Generate Gap Report", type="primary", use_container_width=True):
            with st.spinner("Analyzing your submission for compliance gaps..."):
                try:
                    # Generate report
                    file_content = uploaded_file.read()
                    report_md = generate_gap_report(file_content, uploaded_file.name)
                    
                    # Display report
                    st.markdown("## 📊 Gap Analysis Report")
                    st.markdown(report_md)
                    
                    # Generate PDF
                    try:
                        # Convert markdown to HTML for PDF
                        html_content = f"""
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <style>
                                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                                h1, h2, h3 {{ color: #1e3a8a; }}
                                .checklist {{ margin: 20px 0; }}
                                .citation {{ background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 3px solid #007bff; }}
                            </style>
                        </head>
                        <body>
                            {report_md.replace('**', '<strong>').replace('**', '</strong>')}
                        </body>
                        </html>
                        """
                        
                        # Note: pdfkit requires wkhtmltopdf to be installed
                        # For demo purposes, we'll offer the markdown download
                        st.markdown("### 📥 Download Report")
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            st.download_button(
                                label="📄 Download Markdown Report",
                                data=report_md,
                                file_name=f"LDT_Gap_Report_{uploaded_file.name.split('.')[0]}.md",
                                mime="text/markdown"
                            )
                        
                        with col2:
                            # Try to generate PDF
                            try:
                                # This requires wkhtmltopdf to be installed
                                pdf_options = {
                                    'page-size': 'A4',
                                    'margin-top': '0.75in',
                                    'margin-right': '0.75in',
                                    'margin-bottom': '0.75in',
                                    'margin-left': '0.75in',
                                    'encoding': "UTF-8",
                                    'no-outline': None
                                }
                                pdf_content = pdfkit.from_string(html_content, False, options=pdf_options)
                                
                                st.download_button(
                                    label="📑 Download PDF Report",
                                    data=pdf_content,
                                    file_name=f"LDT_Gap_Report_{uploaded_file.name.split('.')[0]}.pdf",
                                    mime="application/pdf"
                                )
                            except Exception as pdf_error:
                                st.info("PDF generation requires wkhtmltopdf. Download markdown version instead.")
                    
                    except Exception as download_error:
                        st.error(f"Error preparing download: {download_error}")
                    
                except Exception as e:
                    st.error(f"Error analyzing file: {e}")
    
    else:
        # Instructions when no file uploaded
        st.info("👆 Upload your LDT submission file to begin compliance analysis")
        
        # Demo example
        with st.expander("📖 See Example Analysis"):
            st.markdown("""
            **Sample Analysis Results:**
            
            - **Completeness Score**: 60%
            - **Missing Sections**: Intended Use, Risk Assessment, Quality System
            - **Recommendations**: Add clinical validation data, include FMEA analysis
            - **Citations**: References to 21 CFR 809, CLIA requirements
            """)

def qa_chat_tab():
    """Q&A chat functionality"""
    st.header("💬 Ask Compliance Questions")
    
    if not knowledge_base:
        st.warning("Knowledge base not available. Please build the vector store first.")
        return
    
    # Initialize chat history
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    
    # Sample questions
    st.subheader("🔍 Sample Questions")
    sample_questions = [
        "What are the key requirements for LDT analytical validation?",
        "How do I demonstrate clinical validity for my test?",
        "What quality system requirements apply to LDTs?",
        "What risk assessment documentation is needed?",
        "How should I structure my intended use statement?"
    ]
    
    cols = st.columns(2)
    for i, question in enumerate(sample_questions):
        col = cols[i % 2]
        if col.button(f"❓ {question[:50]}...", key=f"sample_{i}"):
            st.session_state.current_question = question
    
    # Question input
    question = st.text_input(
        "Your compliance question:",
        value=st.session_state.get("current_question", ""),
        placeholder="e.g., What personnel qualifications are required under CLIA?",
        key="question_input"
    )
    
    if st.button("🚀 Ask Question", type="primary") and question:
        with st.spinner("Searching regulatory documents..."):
            try:
                response = ask_compliance_question(question)
                
                # Add to chat history
                st.session_state.chat_history.append({
                    "question": question,
                    "answer": response["answer"],
                    "sources": response["sources"]
                })
                
                # Clear the input
                if "current_question" in st.session_state:
                    del st.session_state.current_question
                
            except Exception as e:
                st.error(f"Error processing question: {e}")
    
    # Display chat history
    if st.session_state.chat_history:
        st.subheader("💭 Q&A History")
        
        for i, chat in enumerate(reversed(st.session_state.chat_history)):
            with st.expander(f"Q: {chat['question'][:80]}...", expanded=(i == 0)):
                st.markdown(f"**Question:** {chat['question']}")
                st.markdown(f"**Answer:** {chat['answer']}")
                
                if chat['sources']:
                    st.markdown("**Sources:**")
                    for j, source in enumerate(chat['sources'][:3]):
                        st.markdown(f"*Source {j+1}:* {source.page_content[:200]}...")
        
        # Clear history button
        if st.button("🗑️ Clear Chat History"):
            st.session_state.chat_history = []
            st.rerun()

if __name__ == "__main__":
    main()