"""
LDT Compliance Copilot - Streamlit Application
"""
import streamlit as st
import tempfile
import os
from io import BytesIO
from dotenv import load_dotenv
from agent.run import generate_gap_report, ask_compliance_question, analyze_completeness, extract_text_from_file
from agent.knowledge_base import knowledge_base
from utils.pdf_generator import generate_compliance_pdf

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="LDT Compliance Copilot",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS matching the new dark theme React design exactly
st.markdown("""
<style>
    /* Import Inter font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Hide Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display:none;}
    
    /* Global styling - Dark theme */
    .stApp {
        background: #000000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        min-height: 100vh;
        color: white;
    }
    
    /* Status header bar - Dark theme */
    .status-header {
        background: #111827;
        border-bottom: 1px solid #374151;
        padding: 8px 0;
        margin: -1rem -1rem 0 -1rem;
        width: calc(100% + 2rem);
    }
    
    /* Main header - Dark theme */
    .main-header {
        background: #111827;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        border-bottom: 1px solid #374151;
        padding: 24px 0;
        margin: 0 -1rem 2rem -1rem;
        width: calc(100% + 2rem);
    }
    
    /* Container for content */
    .main-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
    
    /* Grid layout - Dark theme */
    .upload-section {
        background: #1f2937;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        border: 1px solid #374151;
        padding: 24px;
        margin-bottom: 24px;
        height: fit-content;
    }
    
    .results-section {
        background: #1f2937;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        border: 1px solid #374151;
        padding: 24px;
        margin-bottom: 24px;
    }
    
    .chat-section {
        background: #1f2937;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        border: 1px solid #374151;
        padding: 24px;
    }
    
    /* Upload area - Dark theme */
    .upload-area {
        border: 2px dashed #4b5563;
        border-radius: 12px;
        padding: 32px;
        text-align: center;
        background: #111827;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 16px 0;
    }
    .upload-area:hover {
        border-color: #6b7280;
        background: #1f2937;
    }
    
    /* File info - Dark theme */
    .file-info {
        background: #374151;
        border-radius: 12px;
        padding: 16px;
        margin: 16px 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    /* Buttons */
    .stButton > button {
        background: #2563eb !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
        padding: 12px 24px !important;
        width: 100% !important;
        font-size: 16px !important;
        transition: all 0.2s ease !important;
    }
    .stButton > button:hover {
        background: #1d4ed8 !important;
        transform: translateY(-1px) !important;
    }
    
    /* Progress bar */
    .stProgress > div > div {
        background: #10b981 !important;
        border-radius: 4px !important;
    }
    
    /* Compliance score circle */
    .score-circle {
        width: 96px;
        height: 96px;
        margin: 0 auto 16px;
        position: relative;
    }
    
    /* Compliance items - Dark theme */
    .compliance-item {
        border: 1px solid #4b5563;
        border-radius: 12px;
        padding: 16px;
        margin: 12px 0;
        background: #1f2937;
    }
    
    .compliance-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }
    
    .status-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 12px;
    }
    
    .status-present { background: #10b981; }
    .status-missing { background: #ef4444; }
    .status-partial { background: #f59e0b; }
    
    /* Priority badges */
    .priority-badge {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .priority-high {
        background: #7f1d1d;
        color: #fca5a5;
        border: 1px solid #991b1b;
    }
    
    .priority-medium {
        background: #7c2d12;
        color: #fdba74;
        border: 1px solid #9a3412;
    }
    
    .priority-low {
        background: #14532d;
        color: #86efac;
        border: 1px solid #166534;
    }
    
    /* Sample questions */
    .sample-questions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
    }
    
    .sample-question {
        background: transparent;
        border: 1px solid #4b5563;
        color: #d1d5db;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    .sample-question:hover {
        background: #374151;
        border-color: #6b7280;
    }
    
    /* Chat messages - Dark theme */
    .chat-container {
        height: 300px;
        overflow-y: auto;
        padding: 16px;
        background: #111827;
        border-radius: 8px;
        margin: 16px 0;
    }
    
    .chat-message {
        margin: 12px 0;
        max-width: 80%;
    }
    
    .chat-message.user {
        margin-left: auto;
    }
    
    .chat-message.user .message-content {
        background: #2563eb;
        color: white;
        padding: 12px 16px;
        border-radius: 18px 18px 4px 18px;
        font-size: 14px;
    }
    
    .chat-message.assistant .message-content {
        background: #374151;
        color: white;
        padding: 12px 16px;
        border-radius: 18px 18px 18px 4px;
        font-size: 14px;
    }
    
    .message-sources {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.2);
        font-size: 12px;
        opacity: 0.8;
    }
    
    /* Input styling - Dark theme */
    .stTextInput > div > div > input {
        border-radius: 8px !important;
        border: 1px solid #4b5563 !important;
        padding: 12px !important;
        background: #111827 !important;
        color: white !important;
    }
    
    /* Knowledge base status - Dark theme */
    .kb-status {
        background: #1f2937;
        border: 1px solid #4b5563;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
    }
    
    .kb-status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
        font-size: 14px;
        color: #d1d5db;
    }
    
    .kb-badge {
        background: #dcfce7;
        color: #166534;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
    }
    
    /* Style the file uploader - Dark theme */
    .stFileUploader {
        margin: 16px 0;
    }
    
    .stFileUploader > div {
        border: 2px dashed #4b5563 !important;
        border-radius: 12px !important;
        padding: 32px !important;
        text-align: center !important;
        background: #111827 !important;
        transition: all 0.3s ease !important;
    }
    
    .stFileUploader > div:hover {
        border-color: #6b7280 !important;
        background: #1f2937 !important;
    }
    
    .stFileUploader label {
        font-weight: 500 !important;
        color: white !important;
        font-size: 18px !important;
    }
    
    .stFileUploader small {
        color: #d1d5db !important;
        font-size: 14px !important;
    }
    
    /* File uploader button styling - Dark theme */
    .stFileUploader button {
        background: #2563eb !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 8px 16px !important;
        font-weight: 500 !important;
        margin-top: 8px !important;
    }
    
    .stFileUploader button:hover {
        background: #1d4ed8 !important;
    }
    
    /* Custom styling for metrics */
    .metric-container {
        background: #f8fafc;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        margin: 8px 0;
    }
    
    .metric-value {
        font-size: 18px;
        font-weight: 600;
        color: #1e3a8a;
        margin-bottom: 4px;
    }
    
    .metric-label {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 500;
    }
    
    /* Footer */
    .custom-footer {
        background: white;
        border-top: 1px solid #e5e7eb;
        margin: 64px -1rem 0 -1rem;
        padding: 32px 0;
        width: calc(100% + 2rem);
    }
    
    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 32px;
    }
    
    .footer-section h3 {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 16px;
    }
    
    .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .footer-section li {
        margin-bottom: 8px;
    }
    
    .footer-section a {
        color: #6b7280;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s ease;
    }
    
    .footer-section a:hover {
        color: #2563eb;
    }
    
    .footer-bottom {
        text-align: center;
        border-top: 1px solid #e5e7eb;
        margin-top: 32px;
        padding-top: 32px;
        color: #6b7280;
        font-size: 14px;
    }
</style>
""", unsafe_allow_html=True)

def get_sample_answer(question):
    """Generate sample answers for demo questions"""
    lower_q = question.lower()
    
    if "elizabeth holmes" in lower_q or "theranos" in lower_q:
        return "Elizabeth Holmes was the founder and CEO of Theranos, a company that claimed to revolutionize blood testing with proprietary technology. The company collapsed in 2018 amid fraud charges when it was revealed that their tests were unreliable and potentially dangerous. This scandal highlighted critical gaps in LDT oversight and accelerated FDA efforts to regulate laboratory-developed tests more strictly."
    elif "what is the fda" in lower_q or "fda regulate" in lower_q:
        return "The FDA (Food and Drug Administration) is a federal agency within the U.S. Department of Health and Human Services responsible for protecting public health by regulating and supervising the safety of drugs, medical devices, food, and other consumer products. For laboratory testing, the FDA regulates in vitro diagnostic devices (IVDs) and is working to extend oversight to Laboratory Developed Tests (LDTs)."
    elif "laboratory developed test" in lower_q or "what are ldts" in lower_q:
        return "Laboratory Developed Tests (LDTs) are diagnostic tests that are developed, manufactured, and used within a single laboratory. Unlike commercial test kits, LDTs are typically created by hospital labs or reference laboratories to meet specific clinical needs. Historically, LDTs have been regulated primarily under CLIA, but the FDA is now proposing increased oversight."
    elif "clia" in lower_q and "fda" in lower_q:
        return "CLIA (Clinical Laboratory Improvement Amendments) and FDA serve different but complementary roles in laboratory regulation. CLIA, administered by CMS, focuses on laboratory quality standards, personnel qualifications, and proficiency testing. The FDA focuses on the safety and effectiveness of the tests themselves."
    elif "analytical validation" in lower_q:
        return "Analytical validation requires demonstrating that your LDT can accurately and reliably measure what it claims to measure. Key requirements include: accuracy studies, precision studies, analytical sensitivity (limit of detection), analytical specificity, reportable range validation, and reference interval studies."
    elif "clinical validity" in lower_q:
        return "Clinical validity requires evidence that your test accurately identifies, measures, or predicts the clinical condition of interest. This includes clinical sensitivity, clinical specificity, positive and negative predictive values, and clinical utility studies showing the test improves patient outcomes."
    elif "quality system" in lower_q:
        return "Quality system documentation must include comprehensive procedures for document control, personnel qualifications and training records, equipment maintenance and calibration, reagent and supply management, proficiency testing participation, quality control procedures, and corrective and preventive action (CAPA) systems."
    else:
        return "I can help you with questions about LDT compliance, FDA regulations, CLIA requirements, analytical and clinical validation, quality systems, and background information about regulatory oversight in laboratory testing."

def main():
    # Status Header
    st.markdown('''
    <div class="status-header">
        <div class="main-container">
            <div style="display: flex; justify-content: center; gap: 2rem; font-size: 14px; color: #d1d5db;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                    <span>FDA Guidance Updated</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: {'#10b981' if os.getenv('NVIDIA_API_KEY') else '#ef4444'}; border-radius: 50%;"></div>
                    <span>NVIDIA API {'Connected' if os.getenv('NVIDIA_API_KEY') else 'Not Connected'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                    <span>Knowledge Base Ready</span>
                </div>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Main Header
    st.markdown('''
    <div class="main-header">
        <div class="main-container">
            <div style="text-align: center;">
                <h1 style="font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 8px;">🔬 LDT Compliance Copilot</h1>
                <p style="font-size: 1.125rem; color: #d1d5db; max-width: 48rem; margin: 0 auto; line-height: 1.6;">
                    Upload your LDT draft submission—get instant FDA & CLIA compliance analysis in under 60 seconds
                </p>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Main Content
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Initialize session state
    if "uploaded_file" not in st.session_state:
        st.session_state.uploaded_file = None
    if "analysis_complete" not in st.session_state:
        st.session_state.analysis_complete = False
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []
    
    # Create grid layout
    col1, col2 = st.columns([1, 2], gap="large")
    
    with col1:
        # Upload Section
        st.markdown('<div class="upload-section">', unsafe_allow_html=True)
        st.markdown('### 📁 Document Upload')
        
        # Custom upload area with instructions
        st.markdown('''
        <div style="margin: 16px 0; text-align: center;">
            <p style="color: #1e3a8a; font-weight: 500; margin-bottom: 8px;">Drop your LDT submission here or click to browse</p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Supported formats: PDF, DOCX, JSON, XML, TXT</p>
        </div>
        ''', unsafe_allow_html=True)
        
        # File upload area
        uploaded_file = st.file_uploader(
            "Choose your LDT submission file",
            type=['pdf', 'docx', 'doc', 'txt', 'json', 'xml'],
            help="Upload your LDT submission document for compliance analysis",
            key="file_uploader",
            label_visibility="collapsed"
        )
        
        if uploaded_file:
            st.session_state.uploaded_file = uploaded_file
            
            # File info display
            st.markdown(f'''
            <div class="file-info">
                <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                    <div style="width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">📄</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #1e3a8a; margin-bottom: 2px;">{uploaded_file.name}</div>
                        <div style="font-size: 14px; color: #1d4ed8;">{uploaded_file.size / 1024 / 1024:.2f} MB • {uploaded_file.type or "Unknown type"}</div>
                    </div>
                </div>
            </div>
            ''', unsafe_allow_html=True)
        
        # Generate report button
        if st.button("🔍 Generate Gap Report", disabled=not uploaded_file, key="generate_report"):
            if uploaded_file is not None:
                with st.spinner("Analyzing your submission..."):
                    try:
                        # Reset file pointer to beginning
                        uploaded_file.seek(0)
                        file_content = uploaded_file.read()
                        
                        if len(file_content) == 0:
                            st.error("File appears to be empty. Please upload a valid document.")
                            return
                            
                        # Generate report and extract analysis data
                        report_md = generate_gap_report(file_content, uploaded_file.name)
                        
                        # Also store the raw analysis data for accurate score display
                        text = extract_text_from_file(file_content, uploaded_file.name)
                        analysis = analyze_completeness(text)
                        
                        st.session_state.analysis_complete = True
                        st.session_state.report_md = report_md
                        st.session_state.analysis_data = analysis  # Store raw analysis
                        st.rerun()
                    except Exception as e:
                        if "NVIDIA API call failed" in str(e):
                            st.error("🔑 NVIDIA API Error: Please set your NVIDIA_API_KEY environment variable to use AI-powered analysis.")
                            st.info("💡 Get your API key from: https://build.nvidia.com/nvidia/nemotron-4-340b-instruct")
                        else:
                            st.error(f"Error analyzing file: {e}")
                        print(f"Full error: {e}")  # Debug print
            else:
                st.error("Please upload a file first.")
        
        # Knowledge Base Status
        st.markdown('### 🧠 Knowledge Base Status')
        st.markdown('''
        <div class="kb-status">
            <div class="kb-status-item">
                <span>FDA LDT Guidance</span>
                <span class="kb-badge">Updated</span>
            </div>
            <div class="kb-status-item">
                <span>CLIA Regulations</span>
                <span class="kb-badge">Current</span>
            </div>
            <div class="kb-status-item">
                <span>ISO 15189</span>
                <span class="kb-badge">Active</span>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        # Results Section
        if not st.session_state.analysis_complete:
            st.markdown('''
            <div class="results-section" style="border: 2px dashed #d1d5db; text-align: center; padding: 48px 24px;">
                <div style="width: 64px; height: 64px; background: #dbeafe; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
                <h3 style="font-size: 1.125rem; font-weight: 500; color: #111827; margin-bottom: 8px;">Upload a document to get started</h3>
                <p style="color: #6b7280; max-width: 20rem; margin: 0 auto;">
                    Upload your LDT submission document to receive instant compliance analysis and gap identification.
                </p>
            </div>
            ''', unsafe_allow_html=True)
        else:
            # Show analysis results
            st.markdown('<div class="results-section">', unsafe_allow_html=True)
            st.markdown('### 📊 Compliance Analysis')
            
            # Extract actual compliance score from stored analysis data
            try:
                if hasattr(st.session_state, 'analysis_data'):
                    compliance_score = st.session_state.analysis_data['completeness_score']
                else:
                    # Fallback: try to parse from markdown
                    import re
                    score_match = re.search(r'Completeness Score.*?(\d+(?:\.\d+)?)%', st.session_state.report_md)
                    if score_match:
                        compliance_score = float(score_match.group(1))
                    else:
                        compliance_score = 0  # Default to 0 if nothing found
            except:
                compliance_score = 0  # Default to 0 if error
            
            # Compliance score display - single column to prevent layout issues
            st.markdown('### 📊 Compliance Analysis Results')
            col_score, col_downloads = st.columns([1, 1])
            with col_score:
                # Determine status text and color
                if compliance_score < 40:
                    status_text = "Critical - Immediate action required"
                    status_color = "#ef4444"
                    circle_color = "#ef4444"
                elif compliance_score < 70:
                    status_text = "Moderate - Significant gaps identified"
                    status_color = "#f59e0b"
                    circle_color = "#f59e0b"
                elif compliance_score < 90:
                    status_text = "Good - Minor improvements needed"
                    status_color = "#10b981"
                    circle_color = "#10b981"
                else:
                    status_text = "Excellent - Ready for submission"
                    status_color = "#10b981"
                    circle_color = "#10b981"
                
                # Create separate score and status sections to prevent overlap
                st.markdown(f'''
                <div style="text-align: center; margin-bottom: 24px;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #1e3a8a; margin-bottom: 20px;">Overall Compliance Score</h3>
                    
                    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                        <div style="position: relative; width: 140px; height: 140px;">
                            <svg width="140" height="140" style="transform: rotate(-90deg);">
                                <circle cx="70" cy="70" r="60" stroke="#e5e7eb" stroke-width="12" fill="none"/>
                                <circle cx="70" cy="70" r="60" stroke="{circle_color}" stroke-width="12" fill="none" 
                                        stroke-dasharray="{compliance_score * 3.77} 377" stroke-linecap="round"/>
                            </svg>
                            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 2.2rem; font-weight: 700; color: {status_color};">{compliance_score:.0f}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: {status_color}; color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-weight: 500; margin-top: 10px;">
                        {status_text}
                    </div>
                </div>
                ''', unsafe_allow_html=True)
            
            with col_downloads:
                if st.button("📑 Download PDF Report", key="download_pdf"):
                    if hasattr(st.session_state, 'report_md') and st.session_state.uploaded_file:
                        try:
                            # Use stored analysis data for PDF generation
                            # Use stored analysis data
                            if hasattr(st.session_state, 'analysis_data'):
                                analysis = st.session_state.analysis_data
                            else:
                                # Fallback: re-analyze
                                uploaded_file = st.session_state.uploaded_file
                                uploaded_file.seek(0)
                                file_content = uploaded_file.read()
                                text = extract_text_from_file(file_content, uploaded_file.name)
                                analysis = analyze_completeness(text)
                            
                            # Generate clean content for PDF
                            score = analysis['completeness_score']
                            missing_count = len(analysis['missing_required'])
                            present_count = len(analysis['present_sections'])
                            
                            # Generate clean executive summary
                            status = 'EXCELLENT' if score >= 90 else 'GOOD' if score >= 70 else 'MODERATE' if score >= 40 else 'CRITICAL'
                            risk = 'Low Risk' if score >= 90 else 'Moderate Risk' if score >= 70 else 'High Risk' if score >= 40 else 'Very High Risk'
                            
                            executive_summary_text = f"""
**COMPLIANCE STATUS:** {status} (Score: {score}%)

**KEY FINDINGS:**
• {present_count} of {present_count + missing_count} required sections identified and compliant
• {missing_count} critical regulatory sections require immediate attention  
• Overall regulatory risk assessment: {risk}

**REGULATORY IMPACT:**
• Submission completeness: {score:.1f}% of FDA/CLIA requirements met
• Missing sections may result in regulatory delays or rejection
• Compliance gaps pose {risk.lower()} to approval timeline

**IMMEDIATE ACTIONS REQUIRED:**
• Address all {missing_count} missing required sections
• Ensure compliance with 21 CFR 809, 21 CFR 820, and CLIA requirements
• Conduct comprehensive regulatory review before resubmission
"""
                            
                            # Generate clean AI analysis
                            missing_sections_list = list(analysis['missing_required'].keys())
                            ai_analysis_text = f"""
**REGULATORY COMPLIANCE GUIDANCE**

**Missing Critical Sections Analysis:**

The following {missing_count} sections are mandatory for FDA/CLIA compliance:

"""
                            for i, (section, description) in enumerate(analysis['missing_required'].items(), 1):
                                ai_analysis_text += f"""
**{i}. {section}**
• **Regulatory Requirement:** {description}
• **Regulatory Basis:** FDA 21 CFR Parts 809 & 820, CLIA Final Rule
• **Priority:** HIGH - Mandatory for submission
• **Compliance Risk:** Submission will be incomplete without this section
• **Action Required:** Must be addressed before resubmission

"""
                            ai_analysis_text += f"""
**REGULATORY FRAMEWORK:**
• FDA 21 CFR Part 809 (In Vitro Diagnostic Products)
• FDA 21 CFR Part 820 (Quality System Regulation)  
• CLIA Final Rule (Clinical Laboratory Standards)
• Current FDA LDT guidance documents

**IMPLEMENTATION GUIDANCE:**
1. Review each missing section against applicable CFR requirements
2. Develop comprehensive documentation for each section
3. Ensure consistency across all regulatory submissions
4. Conduct internal quality review before resubmission
"""
                            
                            # Prepare data for PDF
                            pdf_data = {
                                'filename': uploaded_file.name if hasattr(st.session_state, 'uploaded_file') else 'Unknown',
                                'score': analysis['completeness_score'],
                                'missing_sections': analysis['missing_required'],
                                'present_sections': analysis['present_sections'],
                                'executive_summary': executive_summary_text,
                                'ai_analysis': ai_analysis_text
                            }
                            
                            # Generate PDF
                            pdf_buffer = generate_compliance_pdf(pdf_data)
                            
                            st.download_button(
                                label="📑 Download PDF Report",
                                data=pdf_buffer.getvalue(),
                                file_name=f"LDT_Compliance_Report_{uploaded_file.name.split('.')[0]}.pdf",
                                mime="application/pdf"
                            )
                        except Exception as e:
                            st.error(f"Error generating PDF: {e}")
                    else:
                        st.warning("Please generate a report first")
                if st.button("📄 Download Markdown", key="download_md"):
                    if hasattr(st.session_state, 'report_md'):
                        st.download_button(
                            label="Download Report",
                            data=st.session_state.report_md,
                            file_name=f"LDT_Gap_Report_{uploaded_file.name.split('.')[0]}.md",
                            mime="text/markdown"
                        )
            
            # Display the actual report
            if hasattr(st.session_state, 'report_md'):
                st.markdown("---")
                st.markdown(st.session_state.report_md)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Q&A Chat Section
        st.markdown('<div class="chat-section">', unsafe_allow_html=True)
        st.markdown('### 💬 Regulatory Q&A Assistant')
        
        # Sample questions
        sample_questions = [
            "What are key LDT analytical validation requirements?",
            "How do I demonstrate clinical validity?",
            "What quality system documentation is needed?",
            "What is the FDA and what do they regulate?",
            "Who is Elizabeth Holmes and why is LDT compliance important?",
            "What happened with Theranos and LDT oversight?",
            "What are Laboratory Developed Tests (LDTs)?",
            "What's the difference between FDA and CLIA regulations?"
        ]
        
        st.markdown('<p style="font-size: 14px; font-weight: 500; color: #1e3a8a; margin-bottom: 8px;">Quick Questions:</p>', unsafe_allow_html=True)
        
        # Display sample questions as buttons
        cols = st.columns(2)
        for i, question in enumerate(sample_questions):
            col = cols[i % 2]
            if col.button(question, key=f"sample_q_{i}", help="Click to ask this question"):
                # Add to chat
                user_msg = {"type": "user", "content": question}
                assistant_msg = {"type": "assistant", "content": get_sample_answer(question)}
                st.session_state.chat_messages.extend([user_msg, assistant_msg])
                st.rerun()
        
        # Chat messages display
        if st.session_state.chat_messages:
            st.markdown('<div class="chat-container">', unsafe_allow_html=True)
            for msg in st.session_state.chat_messages:
                if msg["type"] == "user":
                    st.markdown(f'''
                    <div class="chat-message user">
                        <div class="message-content">{msg["content"]}</div>
                    </div>
                    ''', unsafe_allow_html=True)
                else:
                    st.markdown(f'''
                    <div class="chat-message assistant">
                        <div class="message-content">{msg["content"]}</div>
                    </div>
                    ''', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Chat input
        chat_input = st.text_input("Ask about FDA or CLIA requirements...", key="chat_input")
        if st.button("🚀 Ask Question", key="ask_question") and chat_input:
            if knowledge_base:
                try:
                    response = ask_compliance_question(chat_input)
                    user_msg = {"type": "user", "content": chat_input}
                    assistant_msg = {"type": "assistant", "content": response["answer"]}
                    st.session_state.chat_messages.extend([user_msg, assistant_msg])
                    st.rerun()
                except Exception as e:
                    if "NVIDIA API call failed" in str(e):
                        st.error("🔑 NVIDIA API Error: Please set your NVIDIA_API_KEY environment variable to use AI-powered Q&A.")
                        st.info("💡 Get your API key from: https://build.nvidia.com/nvidia/nemotron-4-340b-instruct")
                    else:
                        st.error(f"Error processing question: {e}")
            else:
                st.warning("Knowledge base not available. Please build the vector store first.")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Footer
    st.markdown('''
    <div class="custom-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Product</h3>
                <ul>
                    <li><a href="#compliance">Compliance Analysis</a></li>
                    <li><a href="#reports">Gap Reports</a></li>
                    <li><a href="#qa">Regulatory Q&A</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li><a href="https://www.fda.gov/medical-devices/in-vitro-diagnostics/laboratory-developed-tests" target="_blank">FDA Guidance</a></li>
                    <li><a href="https://www.cms.gov/regulations-and-guidance/legislation/clia" target="_blank">CLIA Requirements</a></li>
                    <li><a href="#docs">Documentation</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Support</h3>
                <ul>
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="mailto:support@ldtcompliance.com">Contact Us</a></li>
                    <li><a href="#status">API Status</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li><a href="#privacy">Privacy Policy</a></li>
                    <li><a href="#terms">Terms of Service</a></li>
                    <li><a href="#security">Security</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2024 LDT Compliance Copilot. Built for regulatory professionals.</p>
        </div>
    </div>
    ''', unsafe_allow_html=True)


if __name__ == "__main__":
    main()