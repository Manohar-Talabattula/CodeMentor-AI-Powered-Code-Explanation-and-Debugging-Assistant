
import { useRef, useState } from 'react'
import API from '../services/api'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

function FileUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [document, setDocument] = useState(null)

  
const handleFileChange = async (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  setError('')
  setDocument(null)

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    setError('Please select a PDF file.')
    event.target.value = ''
    return
  }

  const formData = new FormData()

  // Field name must match FastAPI's parameter name
  formData.append('file', file, file.name)

  // Verify that FormData contains the selected file
  console.log('Selected file:', file.name)
  console.log('FormData file:', formData.get('file'))

  try {
    setUploading(true)

    const response = await API.post(
      '/api/documents/upload',
      formData
    )

    console.log('Upload response:', response.data)

    setDocument(response.data)

    if (onUploadSuccess) {
      onUploadSuccess(response.data)
    }

  } catch (err) {
    console.error('PDF upload error:', err)
    console.error('Backend response:', err.response?.data)

    setError(
      err.response?.data?.detail
        ? JSON.stringify(err.response.data.detail)
        : 'Unable to upload PDF. Please check your backend connection.'
    )

  } finally {
    setUploading(false)
    event.target.value = ''
  }
}
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">

      {/* Heading */}
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-violet-400" />
        <h3 className="text-sm font-semibold">
          Upload Document
        </h3>
      </div>

      {/* Hidden PDF input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-600 hover:border-violet-500 rounded-lg p-4 text-sm text-slate-300 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing PDF...
          </>
        ) : (
          <>
            <Upload size={18} />
            Choose PDF file
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400">
          <AlertCircle
            size={17}
            className="shrink-0 mt-0.5"
          />
          <p>{error}</p>
        </div>
      )}

      {/* Successful upload details */}
      {document && (
        <div className="bg-emerald-950/30 border border-emerald-800 rounded-lg p-3 space-y-2">

          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle size={17} />
            <span className="text-sm font-semibold">
              PDF processed successfully
            </span>
          </div>

          <p className="text-sm text-slate-200 break-all">
            {document.filename}
          </p>

          <div className="flex justify-between text-xs text-slate-400">
            <span>
              {document.total_pages} pages
            </span>

            <span>
              {document.stored_chunks} chunks stored
            </span>
          </div>

        </div>
      )}

    </div>
  )
}

export default FileUpload
