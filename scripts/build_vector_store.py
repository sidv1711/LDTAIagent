#!/usr/bin/env python3
"""
Build vector store from FDA/CLIA regulatory documents
Supports: PDF, JSON, XML, TXT files
"""
import glob
import os
import json
import xml.etree.ElementTree as ET
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using PyPDF2"""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_json(json_path):
    """Extract text from JSON file"""
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    def extract_values(obj, text_parts=None):
        if text_parts is None:
            text_parts = []
        
        if isinstance(obj, dict):
            for key, value in obj.items():
                if isinstance(value, (str, int, float)):
                    text_parts.append(f"{key}: {value}")
                else:
                    extract_values(value, text_parts)
        elif isinstance(obj, list):
            for item in obj:
                extract_values(item, text_parts)
        elif isinstance(obj, (str, int, float)):
            text_parts.append(str(obj))
        
        return text_parts
    
    text_parts = extract_values(data)
    return "\n".join(text_parts)

def extract_text_from_xml(xml_path):
    """Extract text from XML file"""
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        def extract_xml_text(element):
            text_parts = []
            if element.text and element.text.strip():
                text_parts.append(element.text.strip())
            
            for child in element:
                text_parts.extend(extract_xml_text(child))
                if child.tail and child.tail.strip():
                    text_parts.append(child.tail.strip())
            
            return text_parts
        
        text_parts = extract_xml_text(root)
        return "\n".join(text_parts)
    
    except ET.ParseError as e:
        return f"Error parsing XML file {xml_path}: {e}"

def extract_text_from_txt(txt_path):
    """Extract text from TXT file"""
    with open(txt_path, 'r', encoding='utf-8', errors='ignore') as file:
        return file.read()

def extract_text_from_file(file_path):
    """Extract text from any supported file type"""
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_ext == '.pdf':
            return extract_text_from_pdf(file_path)
        elif file_ext == '.json':
            return extract_text_from_json(file_path)
        elif file_ext in ['.xml', '.xsd']:
            return extract_text_from_xml(file_path)
        elif file_ext in ['.txt', '.md']:
            return extract_text_from_txt(file_path)
        else:
            # Try to read as text
            return extract_text_from_txt(file_path)
    except Exception as e:
        return f"Error extracting text from {file_path}: {e}"

def main():
    print("Building FDA/CLIA regulatory vector store...")
    
    # Check if corpus directory exists
    corpus_dir = "corpus"
    if not os.path.exists(corpus_dir):
        print(f"Error: {corpus_dir} directory not found!")
        return
    
    # Find all supported file types
    supported_extensions = ['*.pdf', '*.json', '*.xml', '*.xsd', '*.txt', '*.md']
    all_files = []
    
    for ext in supported_extensions:
        files = glob.glob(os.path.join(corpus_dir, ext))
        all_files.extend(files)
    
    if not all_files:
        print(f"Warning: No supported files found in {corpus_dir}/")
        print(f"Supported formats: {', '.join(supported_extensions)}")
        print("Please add regulatory documents to the corpus folder")
        return
    
    print(f"Found {len(all_files)} document(s):")
    for file in all_files:
        print(f"  - {os.path.basename(file)} ({os.path.splitext(file)[1]})")
    
    # Initialize text splitter and embeddings
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=900, 
        chunk_overlap=150
    )
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Process documents
    documents = []
    for file_path in all_files:
        print(f"Processing: {file_path}")
        try:
            text = extract_text_from_file(file_path)
            if text.strip() and not text.startswith("Error"):
                # Create document with metadata
                doc = Document(
                    page_content=text,
                    metadata={
                        "source": file_path,
                        "file_type": os.path.splitext(file_path)[1],
                        "filename": os.path.basename(file_path)
                    }
                )
                # Split document into chunks
                chunks = text_splitter.split_documents([doc])
                documents.extend(chunks)
                print(f"  -> Extracted {len(chunks)} chunks")
            else:
                print(f"  -> Warning: No text extracted from {file_path}")
                if text.startswith("Error"):
                    print(f"      {text}")
        except Exception as e:
            print(f"  -> Error processing {file_path}: {e}")
    
    if not documents:
        print("Error: No documents were successfully processed!")
        return
    
    # Create vector store
    print(f"Creating vector store with {len(documents)} document chunks...")
    try:
        vectorstore = FAISS.from_documents(documents, embeddings)
        
        # Save vector store
        store_dir = "stores"
        os.makedirs(store_dir, exist_ok=True)
        vectorstore.save_local(os.path.join(store_dir, "fda_clia"))
        
        print(f"✅ Successfully created vector store with {len(documents)} chunks")
        print(f"📁 Saved to: {store_dir}/fda_clia/")
        
    except Exception as e:
        print(f"Error creating vector store: {e}")

if __name__ == "__main__":
    main()