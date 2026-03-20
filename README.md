# React 19 Migration Agent — Frontend

A React 19 + TypeScript + Vite frontend for the [React 19 Migration Agent Backend](https://github.com/babs12316/react_migration_rag_backend). Users upload `.tsx` files and receive AI-migrated, React 19 compliant output.

https://github.com/user-attachments/assets/36fbe3f5-84ac-4fe3-843a-4e805a66bd3d

---

## Overview

This frontend communicates with the backend API to:

- Accept `.tsx` files via drag and drop or file picker
- Trigger the async migration pipeline
- Display real-time progress via polling
- Show per-file results — migrated, skipped, issues found, errors
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
│   │   └── client.ts           # All API calls
│   ├── components/
│   │   ├── UploadZone.tsx      # Drag and drop file picker
│   │   ├── MigrateButton.tsx   # Chains upload + migration calls
│   │   ├── ProgressBar.tsx     # Polls status every 2 seconds
│   │   └── ResultsList.tsx     # Per-file results + download links
│   ├── store/
│   │   └── migrationStore.ts   # Zustand global state
│   └── App.tsx
├── terraform/                  # Frontend S3 + CloudFront infrastructure
├── .env
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- macOS
- Node.js 22.12+
- The [backend](https://github.com/babs12316/react_migration_rag_backend) running locally — frontend uses the same LocalStack instance

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

---

## User Flow
```
1. Drop .tsx files onto upload zone
2. Click "Migrate to React 19"
        │
        ▼
   POST /upload → files stored in S3, job_id returned
   POST /migrate/{job_id} → pipeline starts in background
        │
        ▼
3. Progress bar polls /status + /results every 2 seconds
   Results appear file by file as each completes
        │
        ▼
4. Results list shows:
   ✓ migrated files with download link
   – skipped files (already React 19 compliant)
   ✗ failed files with error message
        │
        ▼
5. Click Download → FastAPI fetches from S3 → browser saves file
```

---

## Deploy to LocalStack S3

Make sure the backend is running first:
```bash
cd react-migration-agent
docker-compose up
```

Then deploy the frontend in one command:
```bash
npm run deploy
```

This runs terraform to create the S3 bucket, builds the React app, and syncs files to LocalStack S3 automatically.

Open `http://localhost:4566/migration-frontend/index.html`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run deploy` | Build + deploy to LocalStack S3 |
| `npm run open` | Open deployed frontend in browser |
| `npm run lint` | Run ESLint |

---

## Production Deployment
```bash
cd terraform
terraform apply -var-file="terraform.prod.tfvars"
```

Set AWS credentials via environment variables — never in files:
```bash
export AWS_ACCESS_KEY_ID=your_real_key
export AWS_SECRET_ACCESS_KEY=your_real_secret
```

---

## Related

- **Backend**: [react_migration_rag_backend](https://github.com/babs12316/react_migration_rag_backend)