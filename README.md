# Folio - Personal Finance Dashboard

A modern financial data processing and visualization application with a FastAPI backend and Next.js frontend.

## Architecture

- **Backend**: FastAPI server that processes CSV bank statements and provides REST API endpoints
- **Frontend**: Next.js React application with interactive financial dashboard
- **Data Flow**: Upload CSV files → Process transactions → Categorize automatically → Visualize data

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   python start.py
   ```
   
   The API will be available at `http://localhost:8000`
   
   You can view the interactive API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Usage

1. **Start both servers**: Make sure both the backend (port 8000) and frontend (port 3000) are running
2. **Upload file**: Use the file uploader in the dashboard to upload your bank statement (CSV, Excel, JSON, or PDF)
3. **View processed data**: The transactions will be automatically categorized and displayed in the dashboard
4. **Analyze finances**: Use the various charts and filters to analyze your financial data

## Supported File Formats

The system supports multiple file formats for bank statement uploads:

### CSV Files (.csv)
- `Date`: Transaction date (flexible formats supported)
- `Details`: Transaction description
- `Amount`: Transaction amount (can include commas)
- `Currency`: Currency code (optional, defaults to "AED")
- `Debit/Credit`: Type of transaction ("Debit" or "Credit", optional)
- `Status`: Transaction status (optional, defaults to "SETTLED")

### Excel Files (.xlsx, .xls)
- Same column requirements as CSV
- Automatically detects the first sheet with data
- Supports both modern (.xlsx) and legacy (.xls) formats

### JSON Files (.json)
Structure should be an array of transaction objects or an object with a "transactions" array:
```json
{
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "Coffee Shop",
      "amount": 5.50,
      "type": "debit",
      "currency": "AED"
    }
  ]
}
```

### PDF Files (.pdf)
- Text-based bank statement PDFs
- Automatically extracts transaction data using pattern recognition
- Supports common bank statement formats
- Note: PDF parsing may require manual verification for complex layouts

### Column Flexibility
The system intelligently maps various column names:
- **Date**: date, transaction_date, trans_date, posting_date
- **Description**: description, details, memo, reference, narrative  
- **Amount**: amount, transaction_amount, value
- **Type**: type, debit/credit, dr_cr, transaction_type
- **Currency**: currency, ccy, curr
- **Status**: status, transaction_status

## Features

- **Multi-Format Support**: Upload CSV, Excel, JSON, or PDF bank statements
- **Intelligent Column Mapping**: Automatically detects and maps various column names
- **Automatic Categorization**: Transactions are automatically categorized based on keywords
- **Interactive Dashboard**: Multiple chart types and filtering options
- **Real-time Processing**: Upload and see results immediately
- **Category Management**: Add custom categories and keywords via the API
- **Flexible Date Parsing**: Supports various date formats automatically
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `GET /` - API health check
- `GET /supported-formats` - Get detailed information about supported file formats
- `GET /categories` - Get all categories and keywords
- `POST /categories` - Add keyword to category
- `POST /upload-transactions` - Upload and process transaction files (CSV, Excel, JSON, PDF)
- `GET /transactions/summary` - Get transaction summary
- `GET /analytics/expenses-by-category` - Get expenses by category
- `GET /analytics/monthly-trends` - Get monthly trends

## Development

The application uses:
- **FastAPI** for the backend API
- **Pandas** for data processing and file handling
- **pdfplumber & PyPDF2** for PDF text extraction
- **openpyxl & xlrd** for Excel file processing
- **python-dateutil** for flexible date parsing
- **Next.js** with TypeScript for the frontend
- **Tailwind CSS** for styling
- **Recharts** for data visualization

## File Structure

```
Folio/
├── backend/
│   ├── main.py              # FastAPI application with multi-format support
│   ├── start.py             # Server startup script
│   ├── requirements.txt     # Python dependencies
│   ├── categories.json      # Category keywords storage
│   ├── sample_bank_statement.csv    # Sample CSV file
│   └── sample_transactions.json     # Sample JSON file
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utilities and types
│   └── package.json         # Node.js dependencies
└── README.md
```
