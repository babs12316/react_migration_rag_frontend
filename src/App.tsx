import { useState } from "react"
import { UploadZone } from "./components/UploadZone"
import { MigrateButton } from "./components/MigrateButton"
import { ProgressBar } from "./components/ProgressBar"
import { ResultsList } from "./components/ResultsList"
import { useMigrationStore } from "./store/migrationStore"

export default function App() {
    const [files, setFiles] = useState<File[]>([])
    const { status, reset } = useMigrationStore()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-medium text-gray-900">
                        React 19 Migration Agent
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload your .tsx files and migrate them to React 19 automatically
                    </p>
                </div>

                {/* Upload zone */}
                <UploadZone onFilesSelected={setFiles} />

                {/* Migrate button */}
                <div className="mt-4">
                    <MigrateButton files={files} />
                </div>

                {/* Progress bar */}
                <ProgressBar />

                {/* Results */}
                <ResultsList />

                {/* Reset button — only show when complete or failed */}
                {(status === "complete" || status === "failed") && (
                    <button
                        onClick={() => {
                            reset()
                            setFiles([])
                        }}
                        className="mt-6 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Start over
                    </button>
                )}

            </div>
        </div>
    )
}