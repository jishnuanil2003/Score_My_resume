import fitz
import re


# -----------------------------
# Extract text from PDF
# -----------------------------
def parse_pdf(file_path):

    pdf_document = fitz.open(file_path)

    extracted_text = ""

    for page in pdf_document:
        extracted_text += page.get_text()

    pdf_document.close()

    return extracted_text


# -----------------------------
# Split resume into sections
# -----------------------------
def split_sections(text: str):

    section_patterns = [
        "PROFESSIONAL SUMMARY",
        "TECHNICAL SKILLS",
        "PROJECTS",
        "WORK EXPERIENCE",
        "EDUCATION",
        "CERTIFICATIONS",
        "CERTIFICATIONS & RECOGNITION",
        "EXPERIENCE",
        "SKILLS"
    ]

    resume_sections = {}

    current_section = "HEADER"

    resume_sections[current_section] = []

    for line in text.split("\n"):

        line = line.strip()

        if not line:
            continue

        # Normalize line
        normalized_line = line.upper()

        matched = False

        for section in section_patterns:

            if section in normalized_line:

                current_section = section

                resume_sections[current_section] = []

                matched = True
                break

        if not matched:
            resume_sections[current_section].append(line)

    return resume_sections


# -----------------------------
# Parse Header
# -----------------------------
def parse_header(header_data):

    header_text = " ".join(header_data)

    name = header_data[0] if len(header_data) > 0 else None

    role = header_data[1] if len(header_data) > 1 else None

    email = re.search(r'[\w\.-]+@[\w\.-]+', header_text)

    phone = re.search(r'(\+91[\-\s]?)?[6-9]\d{9}', header_text)

    linkedin = re.search(
        r'(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+',
        header_text
    )

    github = re.search(
        r'(https?://)?(www\.)?github\.com/[A-Za-z0-9_-]+',
        header_text
    )

    return {
        "name": name,
        "role": role,
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None,
        "linkedin": linkedin.group() if linkedin else None,
        "github": github.group() if github else None
    }


# -----------------------------
# Main Resume Parser
# -----------------------------
def parse_resume(file_path):

    # Extract PDF text
    text = parse_pdf(file_path)

    # Split into sections
    sections = split_sections(text)

    # Parse header
    header_data = parse_header(sections.get("HEADER", []))

    # Convert section lists to text
    formatted_sections = {}

    for section, content in sections.items():

        formatted_sections[section] = " ".join(content)

    # Final structured response
    final_data = {
        "header": header_data,
        "sections": formatted_sections
    }

    return final_data