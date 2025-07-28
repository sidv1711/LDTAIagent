"""
Gap Critic - Identifies missing sections in LDT submissions
"""
import re
from typing import Dict, List

# Required sections for LDT submissions
REQUIRED_SECTIONS = {
    "Intended Use": "population, analyte, condition",
    "Analytical Validity": "LoD, LoB, precision, linearity data",
    "Clinical Validity": "clinical study & stats",
    "Quality System": "reference 21 CFR 820 or ISO 13485",
    "Risk Assessment": "provide FMEA / hazard analysis"
}

# Additional important sections
RECOMMENDED_SECTIONS = {
    "Labeling": "per 21 CFR 809 requirements",
    "Personnel Qualifications": "CLIA personnel requirements",
    "Specimen Requirements": "collection, handling, storage",
    "Method Description": "detailed analytical procedure",
    "Reference Standards": "calibrators and controls"
}

def find_missing_sections(text: str, include_recommended: bool = False) -> Dict[str, str]:
    """
    Analyze text for missing required sections
    
    Args:
        text: The submission text to analyze
        include_recommended: Whether to include recommended sections
    
    Returns:
        Dictionary of missing sections and their descriptions
    """
    text_lower = text.lower()
    missing = {}
    
    # Check required sections
    for section, description in REQUIRED_SECTIONS.items():
        section_variations = [
            section.lower(),
            section.lower().replace(" ", "_"),
            section.lower().replace(" ", "-"),
            # Add more variations as needed
        ]
        
        found = any(variation in text_lower for variation in section_variations)
        
        # Additional specific checks
        if section == "Intended Use" and not found:
            # Look for alternative phrasings
            alternatives = ["intended use", "indication", "clinical use", "purpose"]
            found = any(alt in text_lower for alt in alternatives)
        
        elif section == "Analytical Validity" and not found:
            # Look for validation terms
            alternatives = ["validation", "analytical performance", "lod", "lob", "precision", "linearity"]
            found = any(alt in text_lower for alt in alternatives)
        
        elif section == "Clinical Validity" and not found:
            # Look for clinical study terms
            alternatives = ["clinical study", "clinical trial", "clinical validation", "sensitivity", "specificity"]
            found = any(alt in text_lower for alt in alternatives)
        
        elif section == "Quality System" and not found:
            # Look for QMS references
            alternatives = ["quality system", "qms", "iso 13485", "21 cfr 820", "quality management"]
            found = any(alt in text_lower for alt in alternatives)
        
        elif section == "Risk Assessment" and not found:
            # Look for risk analysis terms
            alternatives = ["risk assessment", "risk analysis", "fmea", "hazard analysis", "risk management"]
            found = any(alt in text_lower for alt in alternatives)
        
        if not found:
            missing[section] = description
    
    # Check recommended sections if requested
    if include_recommended:
        for section, description in RECOMMENDED_SECTIONS.items():
            section_lower = section.lower()
            if section_lower not in text_lower:
                missing[section] = description
    
    return missing

def analyze_completeness(text: str) -> Dict:
    """
    Provide a comprehensive analysis of submission completeness
    
    Args:
        text: The submission text to analyze
    
    Returns:
        Dictionary with analysis results
    """
    missing_required = find_missing_sections(text, include_recommended=False)
    missing_recommended = find_missing_sections(text, include_recommended=True)
    
    # Calculate completeness scores
    total_required = len(REQUIRED_SECTIONS)
    missing_req_count = len(missing_required)
    completeness_score = ((total_required - missing_req_count) / total_required) * 100
    
    # Identify what's present
    present_sections = []
    for section in REQUIRED_SECTIONS.keys():
        if section not in missing_required:
            present_sections.append(section)
    
    return {
        "completeness_score": round(completeness_score, 1),
        "missing_required": missing_required,
        "missing_recommended": {k: v for k, v in missing_recommended.items() 
                               if k in RECOMMENDED_SECTIONS},
        "present_sections": present_sections,
        "total_required": total_required,
        "missing_count": missing_req_count
    }

def generate_checklist(missing_sections: Dict[str, str]) -> List[str]:
    """
    Generate a checklist of missing items
    
    Args:
        missing_sections: Dictionary of missing sections
    
    Returns:
        List of checklist items
    """
    checklist = []
    for section, description in missing_sections.items():
        checklist.append(f"[ ] **{section}** - {description}")
    
    return checklist

def get_section_guidance(section_name: str) -> str:
    """
    Get detailed guidance for a specific section
    
    Args:
        section_name: Name of the section
    
    Returns:
        Detailed guidance text
    """
    guidance = {
        "Intended Use": """
**Intended Use Requirements:**
- Define the target population (age, gender, conditions)
- Specify the analyte(s) being measured
- Describe the clinical condition or disease state
- Include any limitations or contraindications
- Reference applicable clinical guidelines
        """,
        
        "Analytical Validity": """
**Analytical Validity Requirements:**
- Limit of Detection (LoD) studies
- Limit of Blank (LoB) determination
- Precision studies (repeatability and reproducibility)
- Linearity and measuring range
- Accuracy studies with reference materials
- Interference studies
- Stability studies
        """,
        
        "Clinical Validity": """
**Clinical Validity Requirements:**
- Clinical sensitivity and specificity data
- Positive and negative predictive values
- Comparison with predicate devices or methods
- Clinical study design and statistical analysis
- Patient population characteristics
- Clinical outcomes correlation
        """,
        
        "Quality System": """
**Quality System Requirements:**
- Reference to 21 CFR 820 or ISO 13485
- Document control procedures
- Design controls
- Corrective and preventive actions (CAPA)
- Risk management procedures
- Training and competency requirements
        """,
        
        "Risk Assessment": """
**Risk Assessment Requirements:**
- Failure Mode and Effects Analysis (FMEA)
- Hazard identification and analysis
- Risk mitigation strategies
- Clinical risk evaluation
- Post-market surveillance plan
- Risk-benefit analysis
        """
    }
    
    return guidance.get(section_name, f"No specific guidance available for {section_name}")

# Test function
if __name__ == "__main__":
    # Test with sample text
    sample_text = """
    This laboratory developed test measures biomarker X in serum samples.
    We performed precision studies and determined linearity.
    A clinical study was conducted with 100 patients.
    """
    
    print("Gap Analysis Results:")
    print("=" * 50)
    
    analysis = analyze_completeness(sample_text)
    print(f"Completeness Score: {analysis['completeness_score']}%")
    print(f"Missing Required Sections: {analysis['missing_count']}/{analysis['total_required']}")
    
    if analysis['missing_required']:
        print("\nMissing Required Sections:")
        for section, desc in analysis['missing_required'].items():
            print(f"  - {section}: {desc}")
    
    if analysis['present_sections']:
        print(f"\nPresent Sections: {', '.join(analysis['present_sections'])}")
    
    print("\nChecklist:")
    checklist = generate_checklist(analysis['missing_required'])
    for item in checklist:
        print(f"  {item}")