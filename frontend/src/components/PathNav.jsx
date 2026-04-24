import { useState } from 'react'

export default function PathNav({ paths, concepts, currentConceptId, onConceptSelect }) {
  const [expandedPaths, setExpandedPaths] = useState([])

  const togglePath = (pathId) => {
    setExpandedPaths(prev => 
      prev.includes(pathId) 
        ? prev.filter(id => id !== pathId)
        : [...prev, pathId]
    )
  }

  const getConceptsForPath = (pathId) => {
    const path = paths.find(p => p.id === pathId)
    if (!path) return []
    
    return path.problems.map(problemId => 
      concepts.find(c => c.id === problemId)
    ).filter(Boolean)
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col flex-shrink-0">
      <div className="px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <h1 className="text-sm font-semibold text-slate-700">学习路径</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {paths.map(path => (
          <div key={path.id} className="mb-1">
            <button
              onClick={() => togglePath(path.id)}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between text-xs"
            >
              <span className="font-medium text-slate-700 truncate">{path.titleZh}</span>
              <span className="text-slate-400 text-xs ml-1 flex-shrink-0">
                {expandedPaths.includes(path.id) ? '▼' : '▶'}
              </span>
            </button>

            {expandedPaths.includes(path.id) && (
              <div className="ml-2 mt-0.5 space-y-0.5 pl-2 border-l border-slate-200">
                {getConceptsForPath(path.id).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    className={`w-full text-left px-2 py-1 rounded text-xs ${
                      currentConceptId === concept.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="truncate">{concept.titleZh}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
