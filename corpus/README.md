# FDA/CLIA Document Corpus

This folder should contain the following regulatory documents:

1. **Draft LDT Proposed Rule 2023** - FDA's proposed rule for Laboratory Developed Tests
2. **21 CFR § 809 (labeling)** - FDA labeling requirements excerpts
3. **21 CFR § 820 (Quality System)** - Key subparts for quality system requirements
4. **CLIA '88 validation checklist** - Clinical Laboratory Improvement Amendments validation excerpts

## Supported File Formats

The vector store builder supports multiple formats:
- **PDF** (.pdf) - Standard regulatory documents
- **JSON** (.json) - Structured regulatory data 
- **XML** (.xml, .xsd) - XML-formatted regulations
- **Text** (.txt, .md) - Plain text documents

## Instructions

Add any combination of supported file formats to this directory. The vector store will automatically detect and process all supported files.

## Sample Content Suggestions

If you don't have access to the full regulatory documents, create PDFs with sections covering:

- Intended use requirements
- Analytical validity standards (LoD, LoB, precision, linearity)
- Clinical validity requirements
- Quality system references (21 CFR 820 or ISO 13485)
- Risk assessment requirements (FMEA/hazard analysis)