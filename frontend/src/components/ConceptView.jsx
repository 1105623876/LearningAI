import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodePanel from './CodePanel'
import SVGDiagram from './SVGDiagram'
import PracticeMode from './PracticeMode'

export default function ConceptView({ conceptId }) {
  const [concept, setConcept] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highlightedLines, setHighlightedLines] = useState([])
  const [mode, setMode] = useState('understand')

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8001/api/concepts/${conceptId}`)
      .then(r => r.json())
      .then(data => {
        setConcept(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load concept:', err)
        setLoading(false)
      })
  }, [conceptId])

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">加载中...</div>
    </div>
  }

  if (!concept) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-red-500">加载失败</div>
    </div>
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-white">{concept.titleZh}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            concept.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
            concept.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-rose-500/20 text-rose-300'
          }`}>
            {concept.difficulty}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('understand')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === 'understand'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            理解模式
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === 'practice'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            实践模式
          </button>
        </div>

        {mode === 'understand' && (
          <div className="text-slate-300 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {concept.descriptionZh}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mx-auto">
          {mode === 'understand' ? (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">概念图解</h2>
                <SVGDiagram
                  conceptId={conceptId}
                  svgPath={concept.diagramPath}
                  codeLineMapping={concept.codeLineMapping}
                  onElementClick={setHighlightedLines}
                />
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">参考实现</h2>
                <CodePanel
                  code={concept.code}
                  language="python"
                  highlightedLines={highlightedLines}
                />
              </div>
            </div>
          ) : (
            <PracticeMode conceptId={conceptId} concept={concept} />
          )}
        </div>
      </div>
    </div>
  )
}
