# back/app/api/endpoints/comparison.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.comparison_engine import compare_documents
import tempfile
import shutil
import os

# Add imports for extraction
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import pdfplumber
import docx

router = APIRouter()

# -------------------- Text extraction helper --------------------
def extract_text_from_file(file_path: str) -> str:
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    try:
        if ext == ".pdf":
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            if not text.strip():
                # OCR fallback
                pages = convert_from_path(file_path)
                for page in pages:
                    text += pytesseract.image_to_string(page) + "\n"
            return text.strip()
        elif ext == ".docx":
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        elif ext in [".png", ".jpg", ".jpeg"]:
            img = Image.open(file_path).convert("RGB")
            return pytesseract.image_to_string(img)
        else:
            # Plain text fallback
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

# ------------------------------------------------------------------

@router.post("/compare/")
async def compare_documents_endpoint(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # Save uploaded files to temp files
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file1.filename)[1]) as tmp1:
            shutil.copyfileobj(file1.file, tmp1)
            path1 = tmp1.name
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file2.filename)[1]) as tmp2:
            shutil.copyfileobj(file2.file, tmp2)
            path2 = tmp2.name
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error saving uploaded files: {str(e)}")

    try:
        # Extract text from files
        text1 = extract_text_from_file(path1)
        text2 = extract_text_from_file(path2)

        # Build YOLO model path
        current_dir = os.path.dirname(os.path.abspath(__file__))  # app/api/endpoints
        app_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))  # app
        yolo_model_path = os.path.join(app_dir, "models", "signatureyolo.pt")

        # Call the comparison engine
        result = compare_documents(text1, text2, path1, path2, yolo_model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing documents: {str(e)}")
    finally:
        # Clean up temporary files
        try:
            os.remove(path1)
            os.remove(path2)
        except Exception:
            pass

    return result
