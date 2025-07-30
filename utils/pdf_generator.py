"""
PDF Generation utility for LDT Compliance Reports
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
import re
import markdown

def clean_markdown_for_pdf(text):
    """Clean markdown text for PDF generation"""
    # Convert markdown to HTML first
    html = markdown.markdown(text)
    
    # Remove HTML tags but keep the content
    clean_text = re.sub(r'<[^>]+>', '', html)
    
    # Clean up common markdown artifacts
    clean_text = re.sub(r'\*\*(.*?)\*\*', r'\1', clean_text)  # Bold
    clean_text = re.sub(r'\*(.*?)\*', r'\1', clean_text)      # Italic
    clean_text = re.sub(r'`(.*?)`', r'\1', clean_text)        # Code
    clean_text = re.sub(r'#{1,6}\s+', '', clean_text)         # Headers
    clean_text = re.sub(r'\n\s*\n', '\n\n', clean_text)       # Multiple newlines
    clean_text = re.sub(r'---+', '', clean_text)              # Horizontal rules
    
    return clean_text.strip()

def generate_compliance_pdf(report_data):
    """
    Generate a professional PDF report for LDT compliance analysis
    
    Args:
        report_data: Dictionary containing report information
        
    Returns:
        BytesIO object containing the PDF
    """
    buffer = io.BytesIO()
    
    # Create document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        spaceAfter=30,
        textColor=HexColor('#1e3a8a'),
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=HexColor('#2563eb'),
        alignment=TA_LEFT
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10,
        spaceBefore=15,
        textColor=HexColor('#374151'),
        alignment=TA_LEFT
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
        leftIndent=0,
        rightIndent=0
    )
    
    score_style = ParagraphStyle(
        'ScoreStyle',
        parent=styles['Normal'],
        fontSize=48,
        alignment=TA_CENTER,
        textColor=HexColor('#10b981') if report_data.get('score', 0) >= 70 else HexColor('#ef4444'),
        spaceAfter=10
    )
    
    # Build story
    story = []
    
    # Title page
    story.append(Paragraph("LDT Compliance Gap Analysis Report", title_style))
    story.append(Spacer(1, 20))
    
    # Report info - Professional format
    report_info = [
        ['Prepared for:', 'Laboratory Entity'],
        ['Subject:', 'Laboratory Developed Test (LDT) Regulatory Compliance Assessment'],
        ['Report Date:', datetime.now().strftime("%B %d, %Y")],
        ['Document Analyzed:', report_data.get('filename', 'N/A')],
        ['Report ID:', f"LDT-{datetime.now().strftime('%B-%d-%Y')}-{int(report_data.get('score', 0))}"],
        ['Analysis Type:', 'FDA & CLIA Compliance Gap Analysis']
    ]
    
    info_table = Table(report_info, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor('#f8fafc')),
        ('TEXTCOLOR', (0, 0), (-1, -1), black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))
    
    # Section 1: Introduction & Objectives
    story.append(Paragraph("Section 1: Introduction & Objectives", heading_style))
    
    story.append(Paragraph("1.1 Purpose of Analysis", subheading_style))
    story.append(Paragraph(
        "This Gap Analysis Report was prepared to assist the laboratory in identifying "
        "regulatory compliance gaps in their Laboratory Developed Test (LDT) submission. "
        "The analysis evaluates the submission against current FDA and CLIA regulatory requirements.",
        body_style
    ))
    
    story.append(Paragraph("1.2 Scope and Limitations", subheading_style))
    scope_items = [
        "• Analysis Scope: Review of LDT submission documentation against FDA 21 CFR Parts 809 & 820 and CLIA requirements",
        "• Data Sources: Submitted documentation, FDA guidance documents, CLIA regulations", 
        "• Limitations: Analysis based solely on provided documentation; does not constitute legal or regulatory advice"
    ]
    for item in scope_items:
        story.append(Paragraph(item, body_style))
    
    story.append(Paragraph("1.3 Regulatory Framework", subheading_style))
    framework_items = [
        "• FDA 21 CFR Part 809 (In Vitro Diagnostic Products)",
        "• FDA 21 CFR Part 820 (Quality System Regulation)", 
        "• CLIA Final Rule (Clinical Laboratory Standards)",
        "• Current FDA LDT guidance documents"
    ]
    for item in framework_items:
        story.append(Paragraph(item, body_style))
    
    story.append(Spacer(1, 30))
    
    # Compliance Score Section
    story.append(Paragraph("Overall Compliance Score", heading_style))
    score = report_data.get('score', 0)
    story.append(Paragraph(f"{score}%", score_style))
    
    # Score interpretation
    if score >= 90:
        interpretation = "Excellent - Ready for submission"
        color = HexColor('#10b981')
    elif score >= 70:
        interpretation = "Good - Minor improvements needed"  
        color = HexColor('#10b981')
    elif score >= 40:
        interpretation = "Moderate - Significant gaps identified"
        color = HexColor('#f59e0b')
    else:
        interpretation = "Critical - Immediate action required"
        color = HexColor('#ef4444')
    
    interp_style = ParagraphStyle(
        'InterpStyle',
        parent=body_style,
        fontSize=14,
        alignment=TA_CENTER,
        textColor=color,
        spaceBefore=0,
        spaceAfter=20
    )
    story.append(Paragraph(interpretation, interp_style))
    
    # Section 2: Executive Summary
    story.append(Paragraph("Section 2: Executive Summary", heading_style))
    
    if report_data.get('executive_summary'):
        # Clean and format the executive summary
        clean_summary = clean_markdown_for_pdf(report_data['executive_summary'])
        # Split into paragraphs and add each one
        paragraphs = clean_summary.split('\n\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
    else:
        story.append(Paragraph("Executive summary not available.", body_style))
    
    story.append(Spacer(1, 20))
    
    # Section 3: Data Gaps and Compliance Findings
    story.append(Paragraph("Section 3: Data Gaps and Compliance Findings", heading_style))
    
    # 3.1 Critical Data Gaps
    story.append(Paragraph("3.1 Critical Data Gaps", subheading_style))
    missing_sections = report_data.get('missing_sections', {})
    
    if missing_sections:
        # Create table for missing sections
        gap_data = [['Section', 'Requirements', 'Regulatory Basis', 'Priority']]
        for section, description in missing_sections.items():
            gap_data.append([section, description, 'FDA/CLIA Mandatory', 'HIGH'])
        
        gap_table = Table(gap_data, colWidths=[1.8*inch, 2.7*inch, 1.2*inch, 0.8*inch])
        gap_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#dc2626')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(gap_table)
    else:
        story.append(Paragraph("✓ COMPLIANCE ACHIEVED - All required sections are present in your submission.", body_style))
    
    # 3.2 Enhancement Opportunities (if any recommended sections)
    story.append(Spacer(1, 15))
    story.append(Paragraph("3.2 Enhancement Opportunities", subheading_style))
    story.append(Paragraph("No additional recommended sections identified for this analysis.", body_style))
    
    # 3.3 Compliant Sections Identified
    story.append(Spacer(1, 15))
    story.append(Paragraph("3.3 Compliant Sections Identified", subheading_style))
    present_sections = report_data.get('present_sections', [])
    
    if present_sections:
        # Create table for present sections
        present_data = [['Section', 'Status', 'Regulatory Compliance']]
        for section in present_sections:
            present_data.append([section, '✓ Present', 'FDA/CLIA requirement met'])
        
        present_table = Table(present_data, colWidths=[2.5*inch, 1.2*inch, 2.8*inch])
        present_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#16a34a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(present_table)
    else:
        story.append(Paragraph("No required sections have been identified in the current submission.", body_style))
    
    # Section 4: Detailed Analysis
    story.append(Spacer(1, 20))
    story.append(Paragraph("Section 4: Detailed Regulatory Analysis", heading_style))
    story.append(Paragraph("Expert Compliance Guidance", subheading_style))
    story.append(Paragraph(
        "The following analysis provides specific regulatory guidance for addressing identified compliance gaps:",
        body_style
    ))
    
    if report_data.get('ai_analysis'):
        # Clean and format the detailed analysis
        clean_analysis = clean_markdown_for_pdf(report_data['ai_analysis'])
        # Split into paragraphs and add each one
        paragraphs = clean_analysis.split('\n\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
    else:
        story.append(Paragraph("Detailed analysis not available.", body_style))
    
    # Section 5: Suggested Next Steps and Remediation Plan
    story.append(PageBreak())
    story.append(Paragraph("Section 5: Suggested Next Steps and Remediation Plan", heading_style))
    
    # 5.1 Immediate Actions
    story.append(Paragraph("5.1 Immediate Actions Required", subheading_style))
    
    immediate_data = [
        ['Action Item', 'Description', 'Timeline', 'Responsible Party'],
        ['Address Critical Gaps', 'Complete all HIGH priority sections identified above', 'Immediate', 'Regulatory Team'],
        ['CFR Compliance Review', 'Ensure each section meets specific regulatory requirements', '1-2 weeks', 'Quality Assurance'],
        ['Documentation Verification', 'Cross-reference with official FDA/CLIA guidance', '1 week', 'Regulatory Affairs']
    ]
    
    immediate_table = Table(immediate_data, colWidths=[1.5*inch, 2.5*inch, 1*inch, 1.5*inch])
    immediate_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(immediate_table)
    
    # 5.2 Enhancement Phase
    story.append(Spacer(1, 15))
    story.append(Paragraph("5.2 Enhancement Phase", subheading_style))
    
    enhancement_data = [
        ['Action Item', 'Description', 'Timeline', 'Responsible Party'],
        ['Add Recommended Sections', 'Implement MEDIUM priority enhancements', '2-3 weeks', 'Technical Team'],
        ['Quality Enhancement', 'Strengthen existing sections with additional detail', '1-2 weeks', 'Subject Matter Experts'],
        ['Cross-Reference Validation', 'Verify consistency across all sections', '1 week', 'Quality Assurance']
    ]
    
    enhancement_table = Table(enhancement_data, colWidths=[1.5*inch, 2.5*inch, 1*inch, 1.5*inch])
    enhancement_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#d97706')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(enhancement_table)
    
    # 5.3 Final Preparation
    story.append(Spacer(1, 15))
    story.append(Paragraph("5.3 Final Preparation", subheading_style))
    
    final_data = [
        ['Action Item', 'Description', 'Timeline', 'Responsible Party'],
        ['Internal Review', 'Comprehensive review with regulatory team', '1 week', 'Regulatory Affairs'],
        ['Expert Consultation', 'Third-party regulatory expert review (optional)', '1-2 weeks', 'External Consultant'],
        ['Final Submission Prep', 'Prepare complete documentation package', '3-5 days', 'Regulatory Team']
    ]
    
    final_table = Table(final_data, colWidths=[1.5*inch, 2.5*inch, 1*inch, 1.5*inch])
    final_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#16a34a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(final_table)
    
    # Section 6: Supporting Regulatory Documentation
    story.append(Spacer(1, 20))
    story.append(Paragraph("Section 6: Supporting Regulatory Documentation", heading_style))
    story.append(Paragraph("Key Regulatory Resources", subheading_style))
    
    resources = [
        "• FDA LDT Guidance: https://www.fda.gov/medical-devices/in-vitro-diagnostics/laboratory-developed-tests",
        "• CLIA Regulations: https://www.cdc.gov/clia/",
        "• 21 CFR Part 820: Quality System Regulation",
        "• 21 CFR Part 809: In Vitro Diagnostic Products"
    ]
    
    for resource in resources:
        story.append(Paragraph(resource, body_style))
    
    # Footer/Disclaimer
    story.append(Spacer(1, 30))
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=body_style,
        fontSize=9,
        textColor=HexColor('#6b7280'),
        alignment=TA_JUSTIFY
    )
    
    disclaimer_text = """
    DISCLAIMER: This Gap Analysis Report was generated by the LDT Compliance Copilot using NVIDIA Nemotron AI 
    analysis of regulatory documents and knowledge base. This tool provides guidance based on publicly available 
    regulatory documents and does not constitute legal or regulatory advice. Always consult with qualified 
    regulatory professionals for official submissions and compliance verification.
    """
    
    story.append(Paragraph(disclaimer_text, disclaimer_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer