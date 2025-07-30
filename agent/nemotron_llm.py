"""
NVIDIA Nemotron 3.3 LLM wrapper for LDT compliance queries
"""
import os
import logging
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# NVIDIA API configuration using OpenAI client

def nemotron(prompt: str, max_tokens: int = 1024, temperature: float = 0.6) -> str:
    """
    Send prompt to NVIDIA Nemotron using OpenAI client
    
    Args:
        prompt: The input prompt for the model
        max_tokens: Maximum tokens to generate (default: 1024)
        temperature: Sampling temperature (default: 0.6)
    
    Returns:
        Generated text response
    """
    logger.info("🚀 NVIDIA Nemotron API call initiated")
    logger.info(f"📝 Prompt length: {len(prompt)} characters")
    logger.info(f"⚙️ Parameters: max_tokens={max_tokens}, temperature={temperature}")
    
    api_key = os.getenv('NVIDIA_API_KEY')
    if not api_key:
        logger.error("❌ NVIDIA_API_KEY environment variable not set")
        raise ValueError(
            "NVIDIA_API_KEY environment variable not set. "
            "Please set your NVIDIA API key to use Nemotron."
        )
    
    try:
        # Initialize OpenAI client with NVIDIA base URL
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        
        logger.info("🌐 Making API request to NVIDIA endpoint")
        
        # Make the API call
        completion = client.chat.completions.create(
            model="nvidia/llama-3.3-nemotron-super-49b-v1.5",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            top_p=0.95,
            max_tokens=max_tokens,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False
        )
        
        logger.info("✅ NVIDIA API call successful")
        
        # Extract the generated content
        generated_content = completion.choices[0].message.content
        logger.info(f"📄 Generated response length: {len(generated_content)} characters")
        logger.info("🎯 Using NVIDIA Nemotron model response")
        
        return generated_content
        
    except Exception as e:
        logger.error(f"❌ NVIDIA API call failed: {e}")
        logger.error("💥 API call failed - no fallback available")
        raise Exception(f"NVIDIA API call failed: {e}")

def nemotron_fallback(prompt: str) -> str:
    """
    Fallback function when NVIDIA API is not available
    Returns contextual responses based on the prompt for demonstration purposes
    """
    logger.info("🔄 Using fallback response generation (NVIDIA API not available)")
    logger.info(f"📝 Fallback prompt length: {len(prompt)} characters")
    lower_prompt = prompt.lower()
    
    if "missing sections" in lower_prompt or "gap" in lower_prompt:
        return """**Gap Analysis Summary:**

Based on the regulatory framework analysis, the following compliance gaps have been identified:

**Critical Missing Elements:**
- **Intended Use Statement**: Must clearly define the target population, clinical condition, and intended decision-making context as required by 21 CFR 809.10
- **Risk Assessment**: Comprehensive risk analysis required per ISO 14971, including hazard identification and risk mitigation strategies
- **Quality System Documentation**: Complete QMS documentation per 21 CFR 820, including document control and personnel qualifications

**Recommendations:**
1. Develop detailed intended use statement with specific patient population
2. Conduct formal risk assessment using FMEA methodology
3. Establish comprehensive quality management system
4. Document analytical and clinical validation protocols

**Regulatory Citations:**
- 21 CFR 809.10 (In Vitro Diagnostic Products)
- 21 CFR 820 (Quality System Regulation)
- CLIA Final Rule (Clinical Laboratory Standards)

*This analysis is based on current FDA and CLIA regulatory requirements.*"""
    
    elif "analytical validation" in lower_prompt or "analytical validity" in lower_prompt:
        return """**Analytical Validation Requirements:**

For LDT compliance, analytical validation must demonstrate the test's ability to accurately and reliably measure the intended analyte:

**Required Studies:**
1. **Accuracy Studies**: Comparison to reference method or certified materials
2. **Precision Studies**: Within-run, between-run, and total precision assessment
3. **Analytical Sensitivity**: Limit of Detection (LoD) and Limit of Quantitation (LoQ)
4. **Analytical Specificity**: Cross-reactivity and interference studies
5. **Linearity**: Verification across reportable range
6. **Reference Intervals**: Establishment of normal ranges

**Documentation Requirements:**
- Statistical analysis with appropriate power calculations
- Protocol deviations and their impact assessment
- Raw data retention per CLIA requirements
- Verification studies for any modifications

**Regulatory Framework**: 21 CFR 820.30, CLIA Final Rule Section 493.1253"""
    
    elif "clinical validation" in lower_prompt or "clinical validity" in lower_prompt:
        return """**Clinical Validation Requirements:**

Clinical validation demonstrates the test's ability to accurately identify, measure, or predict the clinical condition:

**Key Components:**
1. **Clinical Sensitivity**: Ability to correctly identify positive cases
2. **Clinical Specificity**: Ability to correctly identify negative cases  
3. **Positive Predictive Value (PPV)**: Probability that positive result is correct
4. **Negative Predictive Value (NPV)**: Probability that negative result is correct
5. **Clinical Utility**: Evidence that test improves patient outcomes

**Study Design Requirements:**
- Appropriate patient population representative of intended use
- Adequate sample size with statistical power analysis
- Prospective or well-designed retrospective studies
- Comparison to established clinical standards
- Independent review of clinical outcomes

**Documentation**: Detailed study protocols, statistical analysis plans, and clinical outcome assessments per FDA guidance."""
    
    else:
        return """**LDT Regulatory Compliance Overview:**

Laboratory Developed Tests (LDTs) must comply with comprehensive regulatory requirements:

**FDA Requirements:**
- Premarket review for high-risk LDTs
- Quality System Regulation (21 CFR 820)
- Labeling requirements (21 CFR 809)
- Adverse event reporting

**CLIA Requirements:**
- Laboratory certification and proficiency testing
- Personnel qualifications and training
- Quality control and quality assurance
- Method validation and verification

**Key Compliance Elements:**
1. Intended use definition
2. Risk assessment and classification
3. Analytical and clinical validation
4. Quality management system
5. Post-market surveillance

*For specific guidance, consult FDA Draft Guidance on Laboratory Developed Tests and CLIA Final Rule.*"""

# Test function
def test_nemotron():
    """Test the Nemotron connection"""
    test_prompt = "What are the key requirements for LDT validation under FDA regulations?"
    
    logger.info("🧪 Starting Nemotron API test...")
    if os.getenv('NVIDIA_API_KEY'):
        logger.info("🔑 NVIDIA_API_KEY found, testing API connection...")
        try:
            response = nemotron(test_prompt)
            logger.info(f"✅ Response received: {response[:100]}...")
        except Exception as e:
            logger.error(f"❌ API test failed: {e}")
    else:
        logger.error("❌ NVIDIA_API_KEY not set - API calls will fail")
        logger.error("💡 Please set NVIDIA_API_KEY environment variable")

if __name__ == "__main__":
    test_nemotron()