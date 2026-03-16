import { useMigrationStore } from "../store/migrationStore"
import { downloadFile } from "../api/client"

export const ResultsList = () => {
    const { job_id, status, results, errors } = useMigrationStore()

    if (status !== "complete" && status !== "failed") return null

    return (
        <div className="w-full mt-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-gray-800 font-medium">Results</h2>
                <span className="text-sm text-gray-500">
                    {results.filter((r) => r.migrated).length} migrated,{" "}
                    {results.filter((r) => !r.migrated).length} skipped
                </span>
            </div>

            {/* Results list */}
            <ul className="space-y-2">
                {results.map((result) => (
                    <li
                        key={result.file}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        {/* Left — status + filename */}
                        <div className="flex items-center gap-3">
                            <span className={result.migrated ? "text-green-500" : "text-gray-400"}>
                                {result.migrated ? "✓" : "–"}
                            </span>
                            <div>
                                <p className="text-sm text-gray-700">{result.file}</p>
                                {result.issues_found.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {result.issues_found.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right — download button */}
                        {result.migrated && job_id && (<a
                            
                                href={downloadFile(job_id, result.file)}
                                download
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Download
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600 font-medium mb-1">Errors</p>
                    {errors.map((error, i) => (
                        <p key={i} className="text-xs text-red-500">{error}</p>
                    ))}
                </div>
            )}

        </div>
    )
}