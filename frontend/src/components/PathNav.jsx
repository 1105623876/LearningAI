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
    <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto h-screen">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">学习路径</h1>
            <p className="text-xs text-slate-600">{paths.length} 条路径 · {concepts.length} 个知识点</p>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        {paths.map(path => (
          <div key={path.id} className="mb-1">
            <button
              onClick={() => togglePath(path.id)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center justify-between transition-all duration-200 group"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{path.titleZh}</span>
              <span className="text-slate-400 group-hover:text-blue-500 transition-all duration-200">
                {expandedPaths.includes(path.id) ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            </button>
            
            {expandedPaths.includes(path.id) && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-200 pl-3">
                {getConceptsForPath(path.id).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                      currentConceptId === concept.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`font-medium ${currentConceptId === concept.id ? 'text-white' : 'group-hover:text-blue-600'}`}>
                      {concept.titleZh}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      currentConceptId === concept.id
                        ? 'bg-white/20 text-white'
                        : concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                          concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                    }`}>
                      {concept.difficulty}
                    </span>
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
