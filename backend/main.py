from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import os
import re
from datetime import datetime
from typing import List, Dict, Any, Union
from pydantic import BaseModel
import pdfplumber
import PyPDF2
from dateutil import parser
import io

app = FastAPI(title="Finance API", description="Financial data processing API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

category_file = "categories.json"

# Pydantic models
class Transaction(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    category: str
    type: str  # "debit" or "credit"
    currency: str

class CategoryRule(BaseModel):
    category: str
    keywords: List[str]

class CategoryUpdate(BaseModel):
    category: str
    keyword: str

# Load categories from file
def load_categories():
    if os.path.exists(category_file):
        with open(category_file, "r") as f:
            return json.load(f)
    return {"Uncategorized": []}

def save_categories(categories):
    with open(category_file, "w") as f:
        json.dump(categories, f)

def categorize_transactions(df, categories):
    df["Category"] = "Uncategorized"
    
    for category, keywords in categories.items():
        if category == "Uncategorized" or not keywords:
            continue
        
        lowered_keywords = [keyword.lower().strip() for keyword in keywords]
        
        for idx, row in df.iterrows():
            details = row["Details"].lower().strip()
            if details in lowered_keywords:
                df.at[idx, "Category"] = category
                
    return df

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF using multiple methods"""
    text = ""
    
    try:
        # Try with pdfplumber first (better for tables)
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception:
        # Fallback to PyPDF2
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not extract text from PDF: {str(e)}")
    
    return text

def parse_pdf_transactions(text: str) -> pd.DataFrame:
    """Parse transactions from PDF text using regex patterns"""
    transactions = []
    
    # Common patterns for bank statements
    patterns = [
        # Pattern 1: Date Description Amount Status
        r'(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s+([^0-9-]+?)\s+([\d,.-]+)\s+([A-Z]+)\s+(Debit|Credit|DEBIT|CREDIT)',
        # Pattern 2: Date Amount Description Status
        r'(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s+([\d,.-]+)\s+([^0-9-]+?)\s+(Debit|Credit|DEBIT|CREDIT)',
        # Pattern 3: Description Date Amount Type
        r'([^0-9]+?)\s+(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s+([\d,.-]+)\s+(Debit|Credit|DEBIT|CREDIT)',
    ]
    
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        for pattern in patterns:
            match = re.search(pattern, line)
            if match:
                groups = match.groups()
                
                # Extract based on pattern structure
                if len(groups) >= 4:
                    try:
                        # Determine which group is what based on pattern
                        date_str, desc, amount_str, trans_type = groups[0], groups[1], groups[2], groups[3]
                        
                        # Clean and parse amount
                        amount_str = re.sub(r'[^\d.-]', '', amount_str)
                        amount = float(amount_str)
                        
                        # Parse date
                        date_obj = parser.parse(date_str)
                        
                        transactions.append({
                            'Date': date_obj.strftime('%Y-%m-%d'),
                            'Details': desc.strip(),
                            'Amount': amount,
                            'Currency': 'AED',  # Default, could be extracted
                            'Debit/Credit': trans_type.title(),
                            'Status': 'SETTLED'
                        })
                        break
                    except (ValueError, TypeError):
                        continue
    
    if not transactions:
        raise HTTPException(status_code=400, detail="No valid transactions found in PDF")
    
    return pd.DataFrame(transactions)

def process_json_file(file_content: bytes) -> pd.DataFrame:
    """Process JSON file and convert to DataFrame"""
    try:
        data = json.loads(file_content.decode('utf-8'))
        
        # Handle different JSON structures
        if isinstance(data, list):
            df = pd.DataFrame(data)
        elif isinstance(data, dict):
            if 'transactions' in data:
                df = pd.DataFrame(data['transactions'])
            else:
                # Assume the dict itself contains transaction data
                df = pd.DataFrame([data])
        else:
            raise ValueError("Invalid JSON structure")
        
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing JSON file: {str(e)}")

def process_excel_file(file_content: bytes, filename: str) -> pd.DataFrame:
    """Process Excel file and convert to DataFrame"""
    try:
        # Determine engine based on file extension
        if filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
        elif filename.endswith('.xls'):
            df = pd.read_excel(io.BytesIO(file_content), engine='xlrd')
        else:
            # Try both engines
            try:
                df = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
            except:
                df = pd.read_excel(io.BytesIO(file_content), engine='xlrd')
        
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing Excel file: {str(e)}")

def process_csv_file(file_content: bytes) -> pd.DataFrame:
    """Process CSV file and convert to DataFrame"""
    try:
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'cp1252']
        
        for encoding in encodings:
            try:
                csv_string = file_content.decode(encoding)
                df = pd.read_csv(io.StringIO(csv_string))
                break
            except UnicodeDecodeError:
                continue
        else:
            raise ValueError("Could not decode CSV file with any supported encoding")
        
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV file: {str(e)}")

def standardize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize DataFrame to expected format"""
    # Clean column names
    df.columns = [col.strip() for col in df.columns]
    
    # Map common column variations to standard names
    column_mapping = {
        # Date columns
        'date': 'Date',
        'transaction_date': 'Date',
        'trans_date': 'Date',
        'posting_date': 'Date',
        
        # Description columns
        'description': 'Details',
        'details': 'Details',
        'transaction_details': 'Details',
        'memo': 'Details',
        'reference': 'Details',
        'narrative': 'Details',
        
        # Amount columns
        'amount': 'Amount',
        'transaction_amount': 'Amount',
        'value': 'Amount',
        
        # Type columns
        'type': 'Debit/Credit',
        'transaction_type': 'Debit/Credit',
        'dr_cr': 'Debit/Credit',
        'debit_credit': 'Debit/Credit',
        
        # Currency columns
        'currency': 'Currency',
        'ccy': 'Currency',
        'curr': 'Currency',
        
        # Status columns
        'status': 'Status',
        'transaction_status': 'Status',
    }
    
    # Apply column mapping (case insensitive)
    for old_name in df.columns:
        for key, new_name in column_mapping.items():
            if old_name.lower() == key.lower():
                df.rename(columns={old_name: new_name}, inplace=True)
                break
    
    # Ensure required columns exist
    required_columns = ['Date', 'Details', 'Amount']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise HTTPException(
            status_code=400, 
            detail=f"Missing required columns: {missing_columns}. Available columns: {list(df.columns)}"
        )
    
    # Clean and convert Amount column
    if 'Amount' in df.columns:
        df['Amount'] = df['Amount'].astype(str).str.replace(r'[,$]', '', regex=True)
        df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
        df = df.dropna(subset=['Amount'])
    
    # Parse dates with flexibility
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce', dayfirst=True)
        df = df.dropna(subset=['Date'])
    
    # Handle Debit/Credit column
    if 'Debit/Credit' not in df.columns:
        # Try to infer from amount sign
        df['Debit/Credit'] = df['Amount'].apply(lambda x: 'Debit' if x < 0 else 'Credit')
        df['Amount'] = df['Amount'].abs()  # Make amounts positive
    
    # Add default values for missing optional columns
    if 'Currency' not in df.columns:
        df['Currency'] = 'AED'  # Default currency
    
    if 'Status' not in df.columns:
        df['Status'] = 'SETTLED'  # Default status
    
    return df

def process_transactions_file(file_content: bytes, filename: str, content_type: str) -> pd.DataFrame:
    """Process uploaded file based on its type and return standardized DataFrame"""
    try:
        # Determine file type
        file_extension = filename.lower().split('.')[-1]
        
        if file_extension == 'csv' or content_type == 'text/csv':
            df = process_csv_file(file_content)
        elif file_extension in ['xlsx', 'xls'] or 'excel' in content_type:
            df = process_excel_file(file_content, filename)
        elif file_extension == 'json' or content_type == 'application/json':
            df = process_json_file(file_content)
        elif file_extension == 'pdf' or content_type == 'application/pdf':
            pdf_text = extract_text_from_pdf(file_content)
            df = parse_pdf_transactions(pdf_text)
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format: {file_extension}. Supported formats: CSV, Excel, JSON, PDF"
            )
        
        # Standardize the DataFrame
        df = standardize_dataframe(df)
        
        # Load categories and categorize transactions
        categories = load_categories()
        df = categorize_transactions(df, categories)
        
        return df
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Finance API is running"}

@app.get("/supported-formats")
async def get_supported_formats():
    """Get information about supported file formats"""
    return {
        "supported_formats": {
            "csv": {
                "description": "Comma-separated values file",
                "extensions": [".csv"],
                "requirements": "Must contain Date, Details, and Amount columns",
                "example_columns": ["Date", "Details", "Amount", "Currency", "Debit/Credit", "Status"]
            },
            "excel": {
                "description": "Microsoft Excel spreadsheet",
                "extensions": [".xlsx", ".xls"],
                "requirements": "Must contain Date, Details, and Amount columns in any sheet",
                "example_columns": ["Date", "Details", "Amount", "Currency", "Type", "Status"]
            },
            "json": {
                "description": "JavaScript Object Notation file",
                "extensions": [".json"],
                "requirements": "Array of transaction objects or object with 'transactions' array",
                "example_structure": {
                    "transactions": [
                        {
                            "date": "2024-01-15",
                            "description": "Coffee Shop",
                            "amount": 5.50,
                            "type": "debit"
                        }
                    ]
                }
            },
            "pdf": {
                "description": "Portable Document Format (Bank Statements)",
                "extensions": [".pdf"],
                "requirements": "Text-based PDF with transaction data in table format",
                "note": "PDF parsing uses pattern recognition and may require manual verification"
            }
        },
        "column_mapping": {
            "date_columns": ["date", "transaction_date", "trans_date", "posting_date"],
            "description_columns": ["description", "details", "memo", "reference", "narrative"],
            "amount_columns": ["amount", "transaction_amount", "value"],
            "type_columns": ["type", "debit/credit", "dr_cr", "transaction_type"],
            "currency_columns": ["currency", "ccy", "curr"],
            "status_columns": ["status", "transaction_status"]
        },
        "limits": {
            "max_file_size": "10MB",
            "supported_encodings": ["utf-8", "latin-1", "cp1252"]
        }
    }

@app.get("/categories")
async def get_categories():
    """Get all categories and their keywords"""
    return load_categories()

@app.post("/categories")
async def add_category(category_data: CategoryUpdate):
    """Add a keyword to a category"""
    categories = load_categories()
    
    if category_data.category not in categories:
        categories[category_data.category] = []
    
    keyword = category_data.keyword.strip()
    if keyword and keyword not in categories[category_data.category]:
        categories[category_data.category].append(keyword)
        save_categories(categories)
        return {"message": f"Keyword '{keyword}' added to category '{category_data.category}'"}
    
    return {"message": "Keyword already exists or is empty"}

@app.post("/upload-transactions")
async def upload_transactions(file: UploadFile = File(...)):
    """Upload and process transaction file (CSV, Excel, JSON, or PDF)"""
    
    # Validate file extension
    allowed_extensions = {'.csv', '.xlsx', '.xls', '.json', '.pdf'}
    file_extension = '.' + file.filename.lower().split('.')[-1] if '.' in file.filename else ''
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file_extension}. Supported types: {', '.join(allowed_extensions)}"
        )
    
    # Check file size (10MB limit)
    file_content = await file.read()
    if len(file_content) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File size too large. Maximum size is 10MB.")
    
    # Process the file
    try:
        df = process_transactions_file(file_content, file.filename, file.content_type)
        
        # Convert DataFrame to list of transactions
        transactions = []
        for idx, row in df.iterrows():
            transaction = {
                "id": f"txn-{idx}",
                "date": row["Date"].strftime("%Y-%m-%d"),
                "description": str(row["Details"]),
                "amount": float(row["Amount"]),
                "category": str(row["Category"]),
                "type": "debit" if str(row["Debit/Credit"]).lower() in ["debit", "dr"] else "credit",
                "currency": str(row["Currency"])
            }
            transactions.append(transaction)
        
        # Separate debits and credits
        debits = [t for t in transactions if t["type"] == "debit"]
        credits = [t for t in transactions if t["type"] == "credit"]
        
        return {
            "message": f"Successfully processed {len(transactions)} transactions from {file.filename}",
            "file_info": {
                "filename": file.filename,
                "file_type": file_extension,
                "size_bytes": len(file_content),
                "content_type": file.content_type
            },
            "transactions": transactions,
            "summary": {
                "total_count": len(transactions),
                "debit_count": len(debits),
                "credit_count": len(credits),
                "total_debit_amount": sum(t["amount"] for t in debits),
                "total_credit_amount": sum(t["amount"] for t in credits)
            },
            "debits": debits,
            "credits": credits
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error processing file: {str(e)}")

@app.get("/transactions/summary")
async def get_transaction_summary():
    """Get transaction summary data"""
    # This would typically come from a database
    # For now, return sample data structure
    return {
        "total_expenses": 0,
        "total_income": 0,
        "expense_by_category": [],
        "monthly_trends": []
    }

@app.get("/analytics/expenses-by-category")
async def get_expenses_by_category():
    """Get expenses grouped by category"""
    # This would process real transaction data
    return {
        "categories": [],
        "amounts": []
    }

@app.get("/analytics/monthly-trends")
async def get_monthly_trends():
    """Get monthly income vs expenses trends"""
    # This would process real transaction data
    return {
        "months": [],
        "income": [],
        "expenses": []
    }