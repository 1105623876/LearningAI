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
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold">学习路径</h1>
        <p className="text-sm text-gray-500 mt-1">{paths.length} 条路径 · {concepts.length} 个知识点</p>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        {paths.map(path => (
          <div key={path.id} className="mb-2">
            <button
              onClick={() => togglePath(path.id)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center justify-between"
            >
              <span className="font-medium">{path.titleZh}</span>
              <span className="text-gray-400">
                {expandedPaths.includes(path.id) ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedPaths.includes(path.id) && (
              <div className="ml-4 mt-1">
                {getConceptsForPath(path.id).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm ${
                      currentConceptId === concept.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {concept.titleZh}
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
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
