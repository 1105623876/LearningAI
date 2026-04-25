import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

function formatMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1.5 py-0.5 rounded text-amber-300">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-amber-200">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    .replace(/\n/g, '<br/>')
}

export default function PracticeMode({ conceptId, concept }) {
  const [task, setTask] = useState(null)
  const [code, setCode] = useState('')
  const [testResults, setTestResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8001/api/practice/task/${conceptId}`)
      .then(r => r.json())
      .then(data => {
        setTask(data)
        const initialCode = `def ${data.functionName}(...):\n    # TODO: 实现这个函数\n    pass`
        setCode(initialCode)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load task:', err)
        setLoading(false)
      })
  }, [conceptId])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('http://localhost:8001/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept_id: conceptId, code })
      })
      const results = await response.json()
      setTestResults(results)
    } catch (err) {
      console.error('Submit failed:', err)
      setTestResults({
        passed: 0,
        total: 0,
        allPassed: false,
        results: [],
        totalTimeMs: 0,
        error: '提交失败: ' + err.message
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">加载题目中...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">加载失败</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">代码编辑器</h3>
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language="python"
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'line',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              bracketPairColorization: { enabled: true },
              readOnly: false,
              domReadOnly: false,
              contextmenu: true
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '运行中...' : '运行测试'}
        </button>
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          {showHint ? '隐藏提示' : '查看提示'}
        </button>
        <button
          type="button"
          onClick={() => setShowSolution(!showSolution)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          {showSolution ? '隐藏答案' : '查看答案'}
        </button>
      </div>

      {showHint && task.hint && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            提示
          </h3>
          <div
            className="text-slate-300 text-sm prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(task.hint) }}
          />
        </div>
      )}

      {showSolution && task.solution && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">参考答案</h3>
          <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
            <code>{task.solution}</code>
          </pre>
        </div>
      )}

      {testResults && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">测试结果</h3>

          {testResults.error ? (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
              <div className="text-rose-400 font-medium mb-2">错误</div>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap">{testResults.error}</pre>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {testResults.results?.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                      result.passed
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-rose-500/10 border border-rose-500/30'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {result.passed ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium mb-1 ${
                        result.passed ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {result.name}
                      </div>
                      {result.error && (
                        <pre className="text-sm text-slate-400 mt-2 whitespace-pre-wrap break-words">
                          {result.error}
                        </pre>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex-shrink-0">
                      {result.execTimeMs.toFixed(1)}ms
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  通过: <span className={testResults.allPassed ? 'text-emerald-400' : 'text-slate-300'}>
                    {testResults.passed}/{testResults.total}
                  </span>
                  {' · '}
                  总耗时: {testResults.totalTimeMs.toFixed(1)}ms
                </div>
                {testResults.allPassed && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    全部通过！
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
