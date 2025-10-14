import pandas as pd
from docx import Document
import PyPDF2
 

def read_docx(file_path: str) -> list:
    """Extract text from Word documents(.docx)"""
    doc = Document(file_path)
    return [p.text.strip() for p in doc.paragraphs if p.text.strip()]

def read_excel(file_path: str) -> list:
    """Extract text from Excel spreadsheets (.xlsx, .xls)"""
    texts = []
    xls = pd.ExcelFile(file_path)
    
    for sheet_name in xls.sheet_names:
        df = xls.parse(sheet_name, dtype=str).fillna("")
        for _, row in df.iterrows():
            row_text = " ".join([str(cell).strip() for cell in row if str(cell).strip()])
            if row_text:
                texts.append(row_text)
    
    return texts

def process_uploaded_file(file_path: str, ord_id: str, index_manager):
    """Main function to process any supported file type"""
    if file_path.lower().endswith('.docx'):
        paragraphs = read_docx(file_path)
    elif file_path.lower().endswith(('.xlsx', '.xls')):
        paragraphs = read_excel(file_path)
    else:
            raise ValueError(f"Unsupported file type: {file_path}")
    if not paragraphs:
            raise ValueError("No text content found in the document")
        
    index_manager.create_index(org_id, paragraphs)