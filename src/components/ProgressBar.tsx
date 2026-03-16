import { useEffect } from "react"
import { useMigrationStore } from "../store/migrationStore"
import { getStatus, getResults } from "../api/client"

export const ProgressBar = () => {
    const { job_id, status, progress, setStatus, setProgress, setResults, addError } =
        useMigrationStore()

    useEffect(() => {
        // only poll when running
        if (status !== "running" || !job_id) return

        const interval = setInterval(async () => {
            try {
                const data = await getStatus(job_id)
                setProgress(data.progress_percent)

                if (data.status === "completed") {
                    clearInterval(interval)

                    // fetch full results
                    const results = await getResults(job_id)
                    setResults(results.results)
                    setStatus("complete")
                }

                if (data.status === "failed") {
                    clearInterval(interval)
                    setStatus("failed")
                    addError("Migration pipeline failed")
                }

            } catch (err) {
                clearInterval(interval)
                setStatus("failed")
                addError(err instanceof Error ? err.message : "Polling failed")
            }
        }, 2000)

        // cleanup on unmount
        return () => clearInterval(interval)
    }, [status, job_id])

    // only show when running or complete
    if (status === "idle" || status === "uploading") return null

    return (
        <div className="w-full mt-6">

            {/* Label */}
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                    {status === "running"  && "Migrating..."}
                    {status === "complete" && "Migration complete"}
                    {status === "failed"   && "Migration failed"}
                </span>
                <span>{progress}%</span>
            </div>

            {/* Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`
                        h-2 rounded-full transition-all duration-500
                        ${status === "failed"   ? "bg-red-500"   : ""}
                        ${status === "running"  ? "bg-blue-500"  : ""}
                        ${status === "complete" ? "bg-green-500" : ""}
                    `}
                    style={{ width: `${progress}%` }}
                />
            </div>

        </div>
    )
}