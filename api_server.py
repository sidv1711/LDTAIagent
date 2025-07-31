"""
FastAPI backend server for LDT Compliance Copilot Next.js frontend
"""
import os
import io
import tempfile
from typing import List, Dict, Optional
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our existing agent functionality
from agent.run import generate_gap_report, ask_compliance_question, analyze_completeness, extract_text_from_file
from agent.knowledge_base import knowledge_base
from utils.pdf_generator import generate_compliance_pdf

# Initialize FastAPI app
app = FastAPI(
    title="LDT Compliance Copilot API",
    description="API backend for AI-powered FDA & CLIA compliance analysis",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class ComplianceAnalysis(BaseModel):
    filename: str
    score: float
    missing_sections: Dict[str, str]
    present_sections: List[str]
    executive_summary: str
    ai_analysis: str
    report_markdown: str

class QARequest(BaseModel):
    question: str

class QAResponse(BaseModel):
    answer: str
    sources: List[str]

class StatusResponse(BaseModel):
    nvidia_api_connected: bool
    knowledge_base_ready: bool
    fda_guidance_updated: bool
    clia_regulations_current: bool

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Status endpoint for knowledge base and API status
@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """Get system status including API connectivity and knowledge base"""
    return StatusResponse(
        nvidia_api_connected=bool(os.getenv('NVIDIA_API_KEY')),
        knowledge_base_ready=knowledge_base is not None,
        fda_guidance_updated=True,  # Assuming always current for demo
        clia_regulations_current=True  # Assuming always current for demo
    )

# File upload and analysis endpoint
@app.post("/api/analyze", response_model=ComplianceAnalysis)
async def analyze_document(file: UploadFile = File(...)):
    """
    Upload and analyze an LDT document for compliance gaps
    
    Args:
        file: Uploaded document (PDF, DOCX, TXT, etc.)
    
    Returns:
        Compliance analysis results
    """
    # Validate file type
    allowed_types = ['pdf', 'docx', 'doc', 'txt', 'json', 'xml']
    file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    
    if file_extension not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (10MB limit)
    max_size = 10 * 1024 * 1024  # 10MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    if len(file_content) == 0:
        raise HTTPException(
            status_code=400,
            detail="File appears to be empty"
        )
    
    try:
        # Extract text and analyze
        text = extract_text_from_file(file_content, file.filename)
        
        if text.startswith("Error"):
            raise HTTPException(status_code=400, detail=text)
        
        # Perform gap analysis
        analysis = analyze_completeness(text)
        
        # Generate detailed report
        report_markdown = generate_gap_report(file_content, file.filename)
        
        # Generate executive summary and AI analysis
        from agent.run import generate_executive_summary, generate_ai_analysis, get_regulatory_context
        
        context_chunks = get_regulatory_context(list(analysis['missing_required'].keys()))
        executive_summary = generate_executive_summary(analysis, context_chunks)
        ai_analysis = generate_ai_analysis(analysis['missing_required'], context_chunks)
        
        return ComplianceAnalysis(
            filename=file.filename,
            score=analysis['completeness_score'],
            missing_sections=analysis['missing_required'],
            present_sections=analysis['present_sections'],
            executive_summary=executive_summary,
            ai_analysis=ai_analysis,
            report_markdown=report_markdown
        )
        
    except Exception as e:
        if "NVIDIA API call failed" in str(e):
            raise HTTPException(
                status_code=503,
                detail="NVIDIA API unavailable. Please check API key configuration."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {str(e)}"
            )

# PDF generation endpoint
@app.post("/api/generate-pdf")
async def generate_pdf_report(analysis: ComplianceAnalysis):
    """
    Generate PDF report from analysis results
    
    Args:
        analysis: Compliance analysis data
    
    Returns:
        PDF file as streaming response
    """
    try:
        # Prepare data for PDF generation
        pdf_data = {
            'filename': analysis.filename,
            'score': analysis.score,
            'missing_sections': analysis.missing_sections,
            'present_sections': analysis.present_sections,
            'executive_summary': analysis.executive_summary,
            'ai_analysis': analysis.ai_analysis
        }
        
        # Generate PDF
        pdf_buffer = generate_compliance_pdf(pdf_data)
        
        # Return as streaming response
        pdf_buffer.seek(0)
        
        def iter_file():
            yield from pdf_buffer
        
        filename = f"LDT_Compliance_Report_{analysis.filename.split('.')[0]}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_buffer.getvalue()),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation failed: {str(e)}"
        )

# Q&A endpoint
@app.post("/api/qa", response_model=QAResponse)
async def ask_question(request: QARequest):
    """
    Ask a compliance-related question
    
    Args:
        request: Question request
    
    Returns:
        Answer and sources
    """
    if not knowledge_base:
        raise HTTPException(
            status_code=503,
            detail="Knowledge base not available"
        )
    
    try:
        response = ask_compliance_question(request.question)
        
        # Extract source metadata for frontend
        sources = []
        for source in response.get('sources', []):
            if hasattr(source, 'metadata'):
                source_info = source.metadata.get('source', 'Unknown source')
                sources.append(source_info)
        
        return QAResponse(
            answer=response['answer'],
            sources=sources
        )
        
    except Exception as e:
        if "NVIDIA API call failed" in str(e):
            raise HTTPException(
                status_code=503,
                detail="NVIDIA API unavailable. Please check API key configuration."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Question processing failed: {str(e)}"
            )

# Sample questions endpoint
@app.get("/api/sample-questions")
async def get_sample_questions():
    """Get sample questions for the Q&A assistant"""
    return {
        "questions": [
            "What are my LDT analytical validation requirements?",
            "What quality system documentation is needed?", 
            "Who is Elizabeth Holmes and why is LDT compliance important?",
            "What are Laboratory Developed Tests (LDTs)?",
            "How do I demonstrate clinical validity?",
            "What is the FDA and what do they regulate?",
            "What happened with Theranos and LDT oversight?",
            "What's the difference between FDA and CLIA regulations?"
        ]
    }

# Knowledge base status endpoint
@app.get("/api/knowledge-base-status")
async def get_knowledge_base_status():
    """Get knowledge base status and information"""
    return {
        "items": [
            {"name": "FDA LDT Guidance", "status": "CURRENT"},
            {"name": "CLIA Regulations", "status": "CURRENT"}, 
            {"name": "ISO 13485", "status": "CURRENT"}
        ]
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )