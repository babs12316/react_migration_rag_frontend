import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
    baseURL: BASE_URL,
})

// ── 1. Upload files ──
export const uploadFiles = async (files: File[]): Promise<{ job_id: string }> => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    const response = await api.post("/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
}

// ── 2. Trigger migration ──
export const triggerMigration = async (job_id: string): Promise<void> => {
    await api.post(`/migrate/${job_id}`)
}

// ── 3. Poll status ──
export const getStatus = async (job_id: string): Promise<{
    status:           string
    progress_percent: number
    processed:        number
    total_files:      number
}> => {
    const response = await api.get(`/status/${job_id}`)
    return response.data
}

// ── 4. Get results ──
export const getResults = async (job_id: string): Promise<{
    results: { file: string; issues_found: string[]; migrated: boolean }[]
    errors:  string[]
}> => {
    const response = await api.get(`/results/${job_id}`)
    return response.data
}

// ── 5. Download migrated file ──
export const downloadFile = (job_id: string, filename: string): string => {
    return `${BASE_URL}/download/${job_id}/${filename}`
}