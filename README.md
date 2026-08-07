# CV Builder

A simple full-stack Resume (CV) Builder web application. Fill in four form pages, submit your data, and view a professional resume preview.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React (Vite), React Router, Axios, Plain CSS    |
| Backend  | Django, Django REST Framework, PostgreSQL       |
| Storage  | Local media (dev) / Azure Blob Storage (prod)   |

## Project Structure

```
cv_builder/
├── frontend/          # React (Vite) app
│   └── src/
│       ├── pages/     # Form pages + Resume Preview
│       ├── context/   # React Context for form state
│       ├── App.jsx
│       └── main.jsx
├── backend/           # Django REST API
│   ├── resume_project/
│   ├── resume_app/
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

### 1. PostgreSQL Configuration

Create a database for the app:

```sql
CREATE DATABASE cv_builder;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE cv_builder TO postgres;
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

API endpoints:
- `GET  /api/resume/` — list resume (returns first record)
- `POST /api/resume/` — create resume
- `GET  /api/resume/<id>/` — retrieve resume
- `PUT  /api/resume/<id>/` — update resume

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

The Vite dev server proxies `/api` and `/media` requests to the Django backend.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

| Variable                          | Description                          | Default                    |
|-----------------------------------|--------------------------------------|----------------------------|
| `SECRET_KEY`                      | Django secret key                    | (required in production)   |
| `DEBUG`                           | Debug mode                           | `True`                     |
| `ALLOWED_HOSTS`                   | Comma-separated allowed hosts        | `localhost,127.0.0.1`      |
| `DB_NAME`                         | PostgreSQL database name             | `cv_builder`               |
| `DB_USER`                         | PostgreSQL username                  | `postgres`                 |
| `DB_PASSWORD`                     | PostgreSQL password                  | `postgres`                 |
| `DB_HOST`                         | PostgreSQL host                      | `localhost`                |
| `DB_PORT`                         | PostgreSQL port                      | `5432`                     |
| `DATABASE_URL`                    | Alternative: full database URL       | (optional)                 |
| `CORS_ALLOWED_ORIGINS`            | Frontend URLs for CORS               | `http://localhost:5173`    |
| `AZURE_STORAGE_ACCOUNT_NAME`      | Azure Blob Storage account           | (empty = local storage)    |
| `AZURE_STORAGE_ACCOUNT_KEY`       | Azure Blob Storage key               |                            |
| `AZURE_STORAGE_CONTAINER_NAME`    | Blob container name                  | `media`                    |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | App Insights (future use)      | (optional)                 |

For production frontend, set `VITE_API_URL` to your backend API URL before building:

```bash
VITE_API_URL=https://your-backend.azurewebsites.net/api npm run build
```

---

## Azure Deployment

### Database — Azure Database for PostgreSQL

1. Create an **Azure Database for PostgreSQL Flexible Server**.
2. Create a database named `cv_builder`.
3. Note the connection string: `postgres://user:password@host:5432/cv_builder`
4. Set `DATABASE_URL` in App Service configuration.

### Backend — Azure App Service (Linux)

1. Create an **App Service** (Linux, Python 3.10+).
2. Set **Startup Command**:
   ```
   gunicorn --bind=0.0.0.0:8000 resume_project.wsgi:application
   ```
3. Configure **Application Settings** (environment variables):
   - `SECRET_KEY` — generate a strong random key
   - `DEBUG` — `False`
   - `ALLOWED_HOSTS` — your-app.azurewebsites.net
   - `DATABASE_URL` — PostgreSQL connection string
   - `CORS_ALLOWED_ORIGINS` — your Static Web App URL
   - `AZURE_STORAGE_ACCOUNT_NAME` — blob storage account
   - `AZURE_STORAGE_ACCOUNT_KEY` — blob storage key
   - `AZURE_STORAGE_CONTAINER_NAME` — `media`
   - `APPLICATIONINSIGHTS_CONNECTION_STRING` — (optional)
4. Deploy backend code (Git, ZIP, or Azure DevOps).
5. Run migrations via SSH console:
   ```
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

### Media Files — Azure Blob Storage

1. Create a **Storage Account** with a blob container named `media`.
2. Set the three `AZURE_STORAGE_*` environment variables in App Service.
3. Profile images will be stored in Azure Blob Storage automatically.

### Frontend — Azure Static Web Apps

1. Build the frontend:
   ```bash
   cd frontend
   VITE_API_URL=https://your-backend.azurewebsites.net/api npm run build
   ```
2. Create an **Azure Static Web App**.
3. Deploy the `frontend/dist` folder.
4. Add the Static Web App URL to backend `CORS_ALLOWED_ORIGINS`.

### Secrets — Azure Key Vault (Future)

Store sensitive values (`SECRET_KEY`, `DATABASE_URL`, storage keys) in Azure Key Vault and reference them as App Service environment variables using Key Vault references.

### Monitoring — Application Insights

The `APPLICATIONINSIGHTS_CONNECTION_STRING` setting is prepared in `settings.py`. To enable monitoring, install the OpenTelemetry SDK and configure it in a future update.

---

## Usage

1. Open **http://localhost:5173**
2. Fill in **Personal Details** (Page 1) → click Next
3. Add **Education** entries (Page 2) → click Next
4. Add **Work Experience** entries (Page 3) → click Next
5. Add **Projects** (Page 4) → click **Generate Resume**
6. View your **Resume Preview**

No login or registration required. The app stores one resume record.
