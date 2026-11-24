
import { useEffect, useState } from 'react'
import API from './services/api'
import Editor from '@monaco-editor/react'
import FileUpload from './components/FileUpload'

import {
  Code2,
  Bug,
  Lightbulb,
  FileText,
  Settings,
  Send,
  Sparkles,
  Plus,
  TestTube,
  Zap
} from 'lucide-react'

function App() {
  // Uploaded document
  const [uploadedDocument, setUploadedDocument] = useState(null)

  // Main assistant mode
  const [assistantMode, setAssistantMode] = useState('code')

  // Selected code analysis task
  const [selectedTask, setSelectedTask] = useState('explain')

  // Code editor
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40};

        for (int i = 0; i < numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}`)

  // Chat states
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sources, setSources] = useState([])

  // Backend status
  const [backendStatus, setBackendStatus] = useState('Checking...')

  // Task labels
  const taskLabels = {
    explain: 'Explain Code',
    debug: 'Debug Code',
    test: 'Test Code',
    optimize: 'Optimize Code'
  }

  // Task-specific suggestions
  const taskSuggestions = {
    explain: [
      'Explain this code line by line',
      'Explain the important concepts',
      'Analyze time and space complexity',
      'Explain how this algorithm works'
    ],
    debug: [
      'Find bugs in my code',
      'Identify syntax and logical errors',
      'Correct the errors in my code',
      'Explain why this code is failing'
    ],
    test: [
      'Generate test cases for this code',
      'Generate boundary and edge cases',
      'Include expected outputs',
      'Identify scenarios where this code may fail'
    ],
    optimize: [
      'Optimize this solution',
      'Improve time complexity',
      'Reduce space complexity',
      'Suggest a more efficient approach'
    ]
  }

  // Check backend connection
  useEffect(() => {
    API.get('/api/health')
      .then((response) => {
        setBackendStatus(response.data.message)
      })
      .catch(() => {
        setBackendStatus('Backend connection failed')
      })
  }, [])

  // Handle PDF upload success
  const handleUploadSuccess = (document) => {
    setUploadedDocument(document)
    setAssistantMode('document')
    setAnswer('')
    setError('')
    setSources([])
    setQuestion('')
  }

  // Clear previous response
  const clearResponse = () => {
    setAnswer('')
    setError('')
    setSources([])
    setQuestion('')
  }

  // Switch between code and document modes
  const handleModeChange = (mode) => {
    setAssistantMode(mode)
    clearResponse()
  }

  // Switch code analysis task
  const handleTaskChange = (task) => {
    setAssistantMode('code')
    setSelectedTask(task)
    clearResponse()
  }

  // Start a new session
  const handleNewSession = () => {
    clearResponse()
  }

  // Send request to selected assistant
  const handleSend = async () => {
    if (!question.trim() || loading) return

    if (assistantMode === 'code' && !code.trim()) {
      setError('Please enter some code in the editor.')
      return
    }

    if (assistantMode === 'document' && !uploadedDocument) {
      setError('Please upload a PDF document before asking questions.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setAnswer('')
      setSources([])

      let response

      if (assistantMode === 'code') {
        // Code analysis using Gemini
        response = await API.post('/api/code/analyze', {
          language: 'Java',
          code: code,
          question: question,
          task: selectedTask
        })
      } else {
        // Document Q&A using RAG
        response = await API.post('/api/chat/ask', {
          question: question,
          filename: uploadedDocument.filename
        })
      }

      setAnswer(response.data.answer || 'No answer was returned.')

      if (assistantMode === 'document') {
        setSources(response.data.sources || [])
      }

    } catch (err) {
      console.error('AI Assistant Error:', err)

      setError(
        err.response?.data?.detail ||
        'Unable to get a response. Please check your backend connection.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-5 flex flex-col overflow-y-auto shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <Code2 className="text-violet-400" size={28} />
          <h1 className="text-xl font-bold">CodeMentor</h1>
        </div>

        {/* New Session */}
        <button
          onClick={handleNewSession}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 p-3 rounded-lg mb-8"
        >
          <Plus size={18} />
          New Session
        </button>

        {/* Workspace */}
        <p className="text-xs text-slate-500 uppercase mb-4">
          Workspace
        </p>

        <nav className="space-y-2 text-slate-300">

          <button
            onClick={() => handleTaskChange('explain')}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
              assistantMode === 'code' && selectedTask === 'explain'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800'
            }`}
          >
            <Code2 size={18} />
            Code Editor
          </button>

          <button
            onClick={() => handleTaskChange('debug')}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
              assistantMode === 'code' && selectedTask === 'debug'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800'
            }`}
          >
            <Bug size={18} />
            Debug Code
          </button>

          <button
            onClick={() => handleTaskChange('test')}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
              assistantMode === 'code' && selectedTask === 'test'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800'
            }`}
          >
            <TestTube size={18} />
            Test Code
          </button>

          <button
            onClick={() => handleTaskChange('optimize')}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
              assistantMode === 'code' && selectedTask === 'optimize'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800'
            }`}
          >
            <Zap size={18} />
            Optimize Code
          </button>

          <button
            onClick={() => handleModeChange('document')}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
              assistantMode === 'document'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800'
            }`}
          >
            <FileText size={18} />
            Documents
          </button>

        </nav>

        {/* PDF Upload */}
        <div className="mt-6">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Uploaded Document Status */}
        {uploadedDocument && (
          <div className="mt-3 text-xs text-emerald-400 break-words">
            <FileText size={14} className="inline mr-1" />
            Document ready: {uploadedDocument.filename}
          </div>
        )}

        {/* Backend Status */}
        <div className="mt-auto text-xs border-t border-slate-800 pt-4">

          <Settings size={16} className="inline mr-2" />
          Settings

          <p className="mt-3 text-slate-400">
            Backend:
            <span
              className={`block mt-1 ${
                backendStatus === 'Backend connection failed'
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}
            >
              {backendStatus}
            </span>
          </p>

        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">

          <div>
            <h2 className="font-semibold">
              {assistantMode === 'code'
                ? taskLabels[selectedTask]
                : 'Document Workspace'}
            </h2>

            <p className="text-xs text-slate-500">
              {assistantMode === 'code'
                ? 'Write, understand and improve your code'
                : 'Ask questions about your uploaded documents'}
            </p>
          </div>

          {assistantMode === 'code' && (
            <span className="text-xs bg-violet-950 text-violet-300 px-3 py-2 rounded-lg">
              {taskLabels[selectedTask]} Mode
            </span>
          )}

        </header>

        {/* Editor and AI Panel */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0">

          {/* Code Editor */}
          <section className="border-r border-slate-800 flex flex-col min-h-0">

            <div className="h-12 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <span className="text-sm text-slate-300">
                Main.java
              </span>

              <span className="text-xs text-slate-500">
                Java
              </span>
            </div>

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language="java"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false
                }}
              />
            </div>

          </section>

          {/* AI Assistant */}
          <section className="flex flex-col min-h-0">

            {/* Assistant Header */}
            <div className="min-h-12 px-5 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">

              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" />

                <span className="text-sm font-semibold">
                  AI Assistant
                </span>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => handleModeChange('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    assistantMode === 'code'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Code Assistant
                </button>

                <button
                  onClick={() => handleModeChange('document')}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    assistantMode === 'document'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Document Q&A
                </button>

              </div>
            </div>

            {/* AI Response Area */}
            <div className="flex-1 p-6 overflow-y-auto">

              {/* Initial Suggestions */}
              {!answer && !loading && !error && (
                <>
                  <h3 className="font-semibold mb-3">
                    <Sparkles className="inline mr-2 text-violet-400" />

                    {assistantMode === 'code'
                      ? `How can I help? ${taskLabels[selectedTask]}`
                      : 'Ask questions about your document'}
                  </h3>

                  <p className="text-sm text-slate-400 mb-6">
                    {assistantMode === 'code'
                      ? `Select a suggestion below or enter your own question to ${selectedTask} your code.`
                      : uploadedDocument
                        ? `You can now ask questions about ${uploadedDocument.filename}.`
                        : 'Upload a PDF document from the sidebar to start asking questions.'}
                  </p>

                  <div className="space-y-3">

                    {(assistantMode === 'code'
                      ? taskSuggestions[selectedTask]
                      : [
                          'Explain the overall architecture',
                          'Summarize the important concepts',
                          'Explain the methodology step by step',
                          'What are the key findings?'
                        ]
                    ).map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuestion(item)}
                        className="block w-full text-left text-sm border border-slate-700 hover:border-violet-500 rounded-lg p-3 text-slate-300"
                      >
                        {item}
                      </button>
                    ))}

                  </div>
                </>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-3 text-violet-400">
                  <Sparkles size={20} className="animate-pulse" />

                  <p>
                    {assistantMode === 'code'
                      ? `CodeMentor is performing ${selectedTask} analysis...`
                      : 'CodeMentor is searching your document and generating an answer...'}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-950/40 border border-red-800 rounded-lg p-4">

                  <h3 className="font-semibold text-red-400 mb-2">
                    Request Failed
                  </h3>

                  <p className="text-sm text-red-300 whitespace-pre-wrap">
                    {error}
                  </p>

                </div>
              )}

              {/* AI Answer */}
              {answer && (
                <div className="space-y-4">

                  <h3 className="font-semibold text-violet-400">
                    <Sparkles className="inline mr-2" size={18} />

                    {assistantMode === 'code'
                      ? `${taskLabels[selectedTask]} Result`
                      : 'Document Answer'}
                  </h3>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap break-words text-sm text-slate-200 leading-7 font-sans">
                      {answer}
                    </pre>
                  </div>

                  {/* Retrieved Sources */}
                  {assistantMode === 'document' && sources.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">

                      <h4 className="text-sm font-semibold text-violet-400 mb-3">
                        <FileText size={16} className="inline mr-2" />
                        Retrieved Sources
                      </h4>

                      <div className="space-y-3">

                        {sources.map((source, index) => (
                          <div
                            key={`${source.filename}-${source.chunk_index}-${index}`}
                            className="text-xs text-slate-400 border-b border-slate-800 pb-3 last:border-0"
                          >
                            <p className="break-all font-medium text-slate-300">
                              {source.filename}
                            </p>

                            <div className="flex gap-3 mt-2">
                              <span className="text-violet-400">
                                Page: {source.page_number ?? 'Not available'}
                              </span>

                              <span className="text-slate-500">
                                Chunk: {source.chunk_index}
                              </span>
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Question Input */}
            <div className="p-4 border-t border-slate-800">

              <div className="flex gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">

                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend()
                  }}
                  placeholder={
                    assistantMode === 'code'
                      ? `Ask CodeMentor to ${selectedTask} your code...`
                      : 'Ask anything about your uploaded document...'
                  }
                  className="flex-1 bg-transparent outline-none text-sm px-2"
                />

                <button
                  onClick={handleSend}
                  disabled={loading || !question.trim()}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-lg"
                >
                  <Send size={18} />
                </button>

              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  )
}

export default App
