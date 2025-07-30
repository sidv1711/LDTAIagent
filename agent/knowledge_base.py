"""
Knowledge base loader for FDA/CLIA regulatory documents
"""
import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

def load_knowledge_base():
    """Load the FDA/CLIA vector store"""
    store_path = "stores/fda_clia"
    
    if not os.path.exists(store_path):
        raise FileNotFoundError(
            f"Vector store not found at {store_path}. "
            "Please run 'python scripts/build_vector_store.py' first."
        )
    
    # Initialize embeddings (must match those used during creation)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Load the vector store
    knowledge_base = FAISS.load_local(
        store_path,
        embeddings=embeddings,
        allow_dangerous_deserialization=True  # Required for FAISS
    )
    
    return knowledge_base

# Initialize knowledge base (will be loaded when imported)
try:
    knowledge_base = load_knowledge_base()
    print("✅ Knowledge base loaded successfully")
except FileNotFoundError as e:
    print(f"⚠️  {e}")
    knowledge_base = None
except Exception as e:
    print(f"❌ Error loading knowledge base: {e}")
    knowledge_base = None