"""
Main agent orchestration for LDT Compliance Copilot
"""
import os
from datetime import date
from jinja2 import Template
from typing import Dict, List, Optional

from .gap_critic import analyze_completeness, RECOMMENDED_SECTIONS
from .nemotron_llm import nemotron, nemotron_fallback
from .knowledge_base import knowledge_base

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract text from uploaded file based on file type
    
    Args:
        file_content: Raw file bytes
        filename: Name of the uploaded file
    
    Returns:
        Extracted text content
    """
    try:
        if filename.lower().endswith('.pdf'):
            from PyPDF2 import PdfReader
            import io
            
            pdf_reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
            
        elif filename.lower().endswith(('.docx', '.doc')):
            from docx import Document
            import io
            
            doc = Document(io.BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
            
        elif filename.lower().endswith('.txt'):
            return file_content.decode('utf-8', errors='ignore')
        
        else:
            # Try to decode as text
            return file_content.decode('utf-8', errors='ignore')
            
    except Exception as e:
        return f"Error extracting text from {filename}: {e}"

def get_regulatory_context(missing_sections: List[str], k: int = 3) -> List:
    """
    Get relevant regulatory context from knowledge base
    
    Args:
        missing_sections: List of missing section names
        k: Number of relevant chunks to retrieve per section
    
    Returns:
        List of relevant document chunks
    """
    if not knowledge_base:
        return []
    
    all_chunks = []
    
    for section in missing_sections:
        try:
            # Search for context related to this section
            chunks = knowledge_base.similarity_search(section, k=k)
            all_chunks.extend(chunks)
        except Exception as e:
            print(f"Error retrieving context for {section}: {e}")
    
    # Remove duplicates while preserving order
    seen = set()
    unique_chunks = []
    for chunk in all_chunks:
        chunk_text = chunk.page_content
        if chunk_text not in seen:
            seen.add(chunk_text)
            unique_chunks.append(chunk)
    
    return unique_chunks[:6]  # Limit to 6 most relevant chunks

def generate_ai_analysis(missing_sections: Dict[str, str], context_chunks: List) -> str:
    """
    Generate AI analysis of missing sections with regulatory context
    
    Args:
        missing_sections: Dictionary of missing sections and descriptions
        context_chunks: Relevant regulatory document chunks
    
    Returns:
        AI-generated analysis text
    """
    if not missing_sections:
        return "✅ **Excellent!** Your submission appears to contain all required sections for LDT regulatory compliance."
    
    # Prepare context for AI
    context_text = "\n\n".join([chunk.page_content for chunk in context_chunks[:4]])
    
    prompt = f"""
As a regulatory compliance expert, analyze the missing sections in this LDT submission:

Missing Sections: {list(missing_sections.keys())}

Regulatory Context:
{context_text}

Provide specific guidance on:
1. Why these sections are mandatory for FDA/CLIA compliance
2. Specific requirements for each missing section
3. Potential regulatory risks of omitting these sections
4. Recommended next steps for the applicant

Keep response focused and actionable, citing specific CFR requirements where applicable.
"""
    
    try:
        if os.getenv('NVIDIA_API_KEY'):
            response = nemotron(prompt)
            # If API response contains error, use fallback
            if "Error" in response or "Unexpected" in response:
                print(f"API error detected: {response}")
                return nemotron_fallback(prompt)
            return response
        else:
            return nemotron_fallback(prompt)
    except Exception as e:
        print(f"Error generating AI analysis: {e}")
        return nemotron_fallback(prompt)

def generate_gap_report(file_content: bytes, filename: str) -> str:
    """
    Generate comprehensive gap analysis report
    
    Args:
        file_content: Raw file bytes
        filename: Name of the uploaded file
    
    Returns:
        Formatted markdown report
    """
    try:
        # Extract text from file
        text = extract_text_from_file(file_content, filename)
        
        if text.startswith("Error"):
            return f"# Error Processing File\n\n{text}"
        
        # Analyze completeness
        analysis = analyze_completeness(text)
        
        # Get regulatory context
        context_chunks = get_regulatory_context(list(analysis['missing_required'].keys()))
        
        # Generate AI analysis
        ai_analysis = generate_ai_analysis(analysis['missing_required'], context_chunks)
        
        # Prepare template variables
        template_vars = {
            'date': date.today().strftime("%B %d, %Y"),
            'completeness_score': analysis['completeness_score'],
            'missing_sections': analysis['missing_required'],
            'recommended_sections': analysis['missing_recommended'],
            'present_sections': analysis['present_sections'],
            'ai_analysis': ai_analysis,
            'regulatory_sources': context_chunks
        }
        
        # Load and render template
        template_path = "templates/report_template.md"
        if os.path.exists(template_path):
            with open(template_path, 'r') as f:
                template_content = f.read()
        else:
            # Fallback template
            template_content = """
# LDT Compliance Gap Report

**Date:** {{ date }}
**Completeness Score:** {{ completeness_score }}%

## Missing Sections
{% for section, hint in missing_sections.items() %}
- [ ] **{{ section }}** - {{ hint }}
{% endfor %}

## AI Analysis
{{ ai_analysis }}

## Regulatory Sources
{% for source in regulatory_sources %}
> {{ source.page_content[:200] }}...
> *{{ source.metadata.source }}*
{% endfor %}
"""
        
        template = Template(template_content)
        report = template.render(**template_vars)
        
        return report
        
    except Exception as e:
        return f"# Error Generating Report\n\nError: {e}"

def ask_compliance_question(question: str) -> Dict:
    """
    Answer compliance questions using knowledge base
    
    Args:
        question: User's compliance question
    
    Returns:
        Dictionary with answer and sources
    """
    if not knowledge_base:
        return {
            'answer': 'Knowledge base not available. Please build the vector store first.',
            'sources': []
        }
    
    try:
        # Search for relevant context
        relevant_chunks = knowledge_base.similarity_search(question, k=4)
        
        # Prepare context for AI
        context = "\n\n".join([chunk.page_content for chunk in relevant_chunks])
        
        prompt = f"""
Based on the following FDA and CLIA regulatory documents, answer this question:

Question: {question}

Regulatory Context:
{context}

Provide a clear, accurate answer citing specific regulatory requirements where applicable.
"""
        
        # Generate answer
        if os.getenv('NVIDIA_API_KEY'):
            answer = nemotron(prompt)
            # If API response contains error, use fallback
            if "Error" in answer or "Unexpected" in answer:
                print(f"API error in Q&A: {answer}")
                answer = nemotron_fallback(prompt)
        else:
            answer = nemotron_fallback(prompt)
        
        return {
            'answer': answer,
            'sources': relevant_chunks
        }
        
    except Exception as e:
        return {
            'answer': f'Error processing question: {e}',
            'sources': []
        }

# Test function
def test_agent():
    """Test the agent functionality"""
    print("Testing LDT Compliance Copilot Agent...")
    
    # Test sample text
    sample_text = """
    Laboratory Developed Test for Biomarker Analysis
    
    This test measures protein levels in blood samples.
    We conducted precision studies with CV < 10%.
    Clinical study included 50 patients.
    """
    
    print("\n1. Testing gap analysis...")
    analysis = analyze_completeness(sample_text)
    print(f"   Completeness Score: {analysis['completeness_score']}%")
    print(f"   Missing Sections: {len(analysis['missing_required'])}")
    
    print("\n2. Testing Q&A...")
    question = "What are the key requirements for LDT validation?"
    response = ask_compliance_question(question)
    print(f"   Answer: {response['answer'][:100]}...")
    
    print("\n✅ Agent test completed")

if __name__ == "__main__":
    test_agent()