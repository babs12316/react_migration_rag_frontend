import { useCallback, useState } from "react"
import { useMigrationStore } from "../store/migrationStore"

interface Props {
    onFilesSelected: (files: File[]) => void
}

export const UploadZone = ({ onFilesSelected }: Props) => {
    const status = useMigrationStore((state) => state.status)
    const [dragging, setDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [error, setError] = useState<string | null>(null)

    const validateAndSet = (selected: File[]) => {
        const invalid = selected.filter((f) => !f.name.endsWith(".tsx"))
        if (invalid.length > 0) {
            setError(`Only .tsx files allowed: ${invalid.map((f) => f.name).join(", ")}`)
            return
        }
        setError(null)
        setFiles(selected)
        onFilesSelected(selected)
    }

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const dropped = Array.from(e.dataTransfer.files)
        validateAndSet(dropped)
    }, [])

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(true)
    }

    const onDragLeave = () => setDragging(false)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || [])
        validateAndSet(selected)
    }

    const isDisabled = status !== "idle"

    return (
        <div className="w-full">
            {/* Drop zone */}
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`
                    border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                    transition-colors duration-200
                    ${dragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }
                    ${isDisabled ? "opacity-50 pointer-events-none" : ""}
                `}
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <p className="text-gray-500 text-sm">
                    Drop <span className="font-medium text-gray-700">.tsx</span> files here
                </p>
                <p className="text-gray-400 text-xs mt-1">or click to browse</p>
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".tsx"
                    className="hidden"
                    onChange={onChange}
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Selected files list */}
            {files.length > 0 && (
                <ul className="mt-4 space-y-1">
                    {files.map((f) => (
                        <li key={f.name} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {f.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}