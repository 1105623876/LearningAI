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
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 overflow-y-auto h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          学习路径
        </h1>
        <p className="text-sm text-slate-600 mt-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {paths.length} 条路径
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {concepts.length} 个知识点
          </span>
        </p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        {paths.map(path => (
          <div key={path.id} className="mb-1">
            <button
              onClick={() => togglePath(path.id)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group"
            >
              <span className="font-medium text-slate-700 group-hover:text-blue-700">{path.titleZh}</span>
              <svg
                className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform ${expandedPaths.includes(path.id) ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {expandedPaths.includes(path.id) && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-blue-100 pl-3">
                {getConceptsForPath(path.id).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      currentConceptId === concept.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{concept.titleZh}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        currentConceptId === concept.id
                          ? 'bg-white/20 text-white'
                          : concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                            concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                      }`}>
                        {concept.difficulty}
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
