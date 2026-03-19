import { create } from "zustand"

type JobStatus = "idle" | "uploading" | "running" | "complete" | "failed"

interface JobResult {
    file:         string
    issues_found: string[]
    migrated:     boolean
}

export interface JobError {
    file?:  string
    error: string
}

interface MigrationStore {
    // state
    job_id:   string | null
    status:   JobStatus
    progress: number
    results:  JobResult[]
    errors:   JobError[]

    // actions
    setJobId:    (id: string) => void
    setStatus:   (status: JobStatus) => void
    setProgress: (progress: number) => void
    setResults:  (results: JobResult[]) => void
    setErrors:   (errors: JobError[]) => void
    addError:    (error: JobError) => void
    reset:       () => void
}

const initialState = {
    job_id:   null,
    status:   "idle" as JobStatus,
    progress: 0,
    results:  [],
    errors:   [],
}

export const useMigrationStore = create<MigrationStore>((set) => ({
    ...initialState,

    setJobId:    (id)       => set({ job_id: id }),
    setStatus:   (status)   => set({ status }),
    setProgress: (progress) => set({ progress }),
    setResults:  (results)  => set({ results }),
    setErrors:   (errors)   => set({ errors }),
    addError:    (error)    => set((state) => ({ errors: [...state.errors, error] })),
    reset:       ()         => set(initialState),
}))