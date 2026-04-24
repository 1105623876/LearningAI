import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodePanel from './CodePanel'
import SVGDiagram from './SVGDiagram'

export default function ConceptView({ conceptId }) {
  const [concept, setConcept] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highlightedLines, setHighlightedLines] = useState([])

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
    <div className="h-full overflow-y-auto">
      <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">{concept.titleZh}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
            concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            {concept.difficulty}
          </span>
        </div>
        <div className="text-slate-600 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {concept.descriptionZh}
          </ReactMarkdown>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">概念图解</h2>
            <SVGDiagram
              conceptId={conceptId}
              svgPath={concept.diagramPath}
              codeLineMapping={concept.codeLineMapping}
              onElementClick={setHighlightedLines}
            />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">参考实现</h2>
            <CodePanel
              code={concept.code}
              language="python"
              highlightedLines={highlightedLines}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
