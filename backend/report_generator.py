from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from datetime import datetime
import os


def generate_pdf_report(data):
    reports_dir = "reports"
    os.makedirs(reports_dir, exist_ok=True)

    filename = f"perfmind_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(reports_dir, filename)

    doc = SimpleDocTemplate(filepath, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    title = styles["Title"]
    heading = styles["Heading2"]
    normal = styles["BodyText"]
    code_style = styles["Code"]

    story.append(Paragraph("PerfMind Optimization Report", title))
    story.append(Spacer(1, 0.25 * inch))

    story.append(Paragraph(f"Generated At: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal))
    story.append(Paragraph(f"Language: {data.get('language', 'Unknown')}", normal))
    story.append(Paragraph(f"Status: {'Success' if data.get('success') else 'Failed'}", normal))
    story.append(Spacer(1, 0.25 * inch))

    story.append(Paragraph("AI Analysis", heading))
    story.append(Paragraph(str(data.get("analysis", "No analysis available")).replace("\n", "<br/>"), normal))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Optimized Code", heading))
    story.append(Paragraph(str(data.get("optimized_code", "No optimized code available")).replace("\n", "<br/>"), code_style))
    story.append(Spacer(1, 0.2 * inch))

    before = data.get("before", {})
    after = data.get("after", {})
    comparison = data.get("comparison", {})

    story.append(Paragraph("Runtime Metrics", heading))
    story.append(Paragraph(f"Original Time: {before.get('time', 0)} seconds", normal))
    story.append(Paragraph(f"Optimized Time: {after.get('time', 0)} seconds", normal))
    story.append(Paragraph(f"Original Memory: {before.get('memory', 0)} bytes", normal))
    story.append(Paragraph(f"Optimized Memory: {after.get('memory', 0)} bytes", normal))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Validation Result", heading))
    story.append(Paragraph(f"Accepted: {comparison.get('accepted', False)}", normal))
    story.append(Paragraph(f"Message: {comparison.get('message', 'No validation message')}", normal))

    doc.build(story)

    return filepath