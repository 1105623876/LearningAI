import { useState, useEffect } from 'react'
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
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{concept.titleZh}</h1>
          <span className={`text-xs px-2 py-1 rounded ${
            concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {concept.difficulty}
          </span>
        </div>
        <p className="text-gray-600">{concept.descriptionZh}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">概念图解</h2>
            <SVGDiagram
              conceptId={conceptId}
              svgPath={concept.diagramPath}
              codeLineMapping={concept.codeLineMapping}
              onElementClick={setHighlightedLines}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">参考实现</h2>
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
