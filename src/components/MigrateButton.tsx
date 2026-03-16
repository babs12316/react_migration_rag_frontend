import { useMigrationStore } from "../store/migrationStore"
import { uploadFiles, triggerMigration } from "../api/client"

interface Props {
    files: File[]
}

export const MigrateButton = ({ files }: Props) => {
    const { status, setJobId, setStatus, addError } = useMigrationStore()

    const handleClick = async () => {
        if (files.length === 0) return

        try {
            // ── 1. Upload files ──
            setStatus("uploading")
            const { job_id } = await uploadFiles(files)
            setJobId(job_id)

            // ── 2. Trigger migration immediately ──
            setStatus("running")
            await triggerMigration(job_id)

        } catch (err) {
            setStatus("failed")
            addError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    const isDisabled = files.length === 0 || status !== "idle"

    const label = {
        idle:      "Migrate to React 19",
        uploading: "Uploading...",
        running:   "Migrating...",
        complete:  "Done",
        failed:    "Failed",
    }[status]

    return (
        <button
            onClick={handleClick}
            disabled={isDisabled}
            className={`
                w-full py-3 px-6 rounded-xl font-medium text-white
                transition-colors duration-200
                ${isDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }
            `}
        >
            {label}
        </button>
    )
}