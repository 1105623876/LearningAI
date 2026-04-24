import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-8 shadow-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{concept.titleZh}</h1>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${
                  concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                  concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {concept.difficulty}
                </span>
                {concept.paths && concept.paths.length > 0 && (
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {concept.paths.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-slate-700 leading-relaxed">
            <ReactMarkdown className="prose prose-sm max-w-none prose-slate">
              {concept.descriptionZh}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                概念图解
              </h2>
            </div>
            <div className="p-6">
              <SVGDiagram
                conceptId={conceptId}
                svgPath={concept.diagramPath}
                codeLineMapping={concept.codeLineMapping}
                onElementClick={setHighlightedLines}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                参考实现
              </h2>
            </div>
            <div className="p-6">
              <CodePanel
                code={concept.code}
                language="python"
                highlightedLines={highlightedLines}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
