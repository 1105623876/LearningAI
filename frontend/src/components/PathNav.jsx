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
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 h-screen flex flex-col shadow-sm">
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          学习路径
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {paths.length} 条路径 · {concepts.length} 个知识点
        </p>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        {paths.map(path => (
          <div key={path.id} className="mb-1">
            <button
              onClick={() => togglePath(path.id)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group"
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{path.titleZh}</span>
              <svg
                className={`w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-transform flex-shrink-0 ${expandedPaths.includes(path.id) ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {expandedPaths.includes(path.id) && (
              <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-blue-100 pl-2">
                {getConceptsForPath(path.id).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all ${
                      currentConceptId === concept.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{concept.titleZh}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        currentConceptId === concept.id
                          ? 'bg-white/20 text-white'
                          : concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                            concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                      }`}>
                        {concept.difficulty === 'Easy' ? 'E' : concept.difficulty === 'Medium' ? 'M' : 'H'}
                      </span>
                    </div>
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
