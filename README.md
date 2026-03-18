# React 19 Migration Agent — Frontend

A React 19 + TypeScript + Vite frontend for the [React 19 Migration Agent Backend](https://github.com/babs12316/react_migration_rag_backend). Users upload `.tsx` files and receive AI-migrated, React 19 compliant output.


https://github.com/user-attachments/assets/36fbe3f5-84ac-4fe3-843a-4e805a66bd3d


---

## Overview

This frontend communicates with the backend API to:

- Accept `.tsx` files via drag and drop or file picker
- Trigger the async migration pipeline
- Display real-time progress via polling
- Show per-file results — migrated, skipped, issues found
- Download individual migrated files from S3

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| State management | Zustand |
| HTTP client | Axios |
| Linting | ESLint |

---

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── client.ts        # All API calls
│   ├── components/
│   │   ├── UploadZone.tsx   # Drag and drop file picker
│   │   ├── MigrateButton.tsx # Triggers upload + migration
│   │   ├── ProgressBar.tsx  # Polls status every 2 seconds
│   │   ├── ResultsList.tsx  # Per-file results + download
│   │   └── DownloadButton.tsx
│   ├── store/
│   │   └── migrationStore.ts # Zustand global state
│   └── App.tsx
├── .env
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 22.12+
- The [backend service](https://github.com/babs12316/react_migration_rag_backend) running locally

### Install dependencies
```bash
npm install
```

### Configure environment
```env
VITE_API_URL=http://localhost:8000
```

### Run the development server
```bash
npm run dev
```

Available at `http://localhost:5173`.

### Build for production
```bash
npm run build
```

---

## Deploy to LocalStack S3
```bash
npm run build
awslocal s3 sync dist/ s3://migration-frontend --delete
```

Open `http://localhost:4566/migration-frontend/index.html`.

---

## User Flow
```
1. Drop .tsx files onto upload zone
2. Click "Migrate to React 19"
        │
        ▼
   POST /upload → files stored in S3
   POST /migrate/{job_id} → pipeline starts
        │
        ▼
3. Progress bar polls /status every 2 seconds
        │
        ▼
4. Results list appears when complete
   - ✓ migrated files with download link
   - – skipped files (already compliant)
        │
        ▼
5. Click Download → fetches migrated file from S3
```

---

## Linting
```bash
npm run lint
```

---

## Deployment
```bash
cd terraform
terraform init
terraform apply -var-file="terraform.prod.tfvars"
```

---

## Related

- **Backend**: [react_migration_rag_backend](https://github.com/babs12316/react_migration_rag_backend)
