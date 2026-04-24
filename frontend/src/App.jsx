import { useState, useEffect } from 'react'
import PathNav from './components/PathNav'
import ConceptView from './components/ConceptView'
import './index.css'

function App() {
  const [paths, setPaths] = useState([])
  const [concepts, setConcepts] = useState([])
  const [currentConceptId, setCurrentConceptId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8001/api/paths').then(r => r.json()),
      fetch('http://localhost:8001/api/concepts').then(r => r.json())
    ])
      .then(([pathsData, conceptsData]) => {
        setPaths(pathsData.paths)
        setConcepts(conceptsData.concepts)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-xl">加载中...</div>
    </div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-red-500">加载失败: {error}</div>
    </div>
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <PathNav
        paths={paths}
        concepts={concepts}
        currentConceptId={currentConceptId}
        onConceptSelect={setCurrentConceptId}
      />
      <div className="flex-1 overflow-auto">
        {currentConceptId ? (
          <ConceptView conceptId={currentConceptId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">
                LearningAI
              </h2>
              <p className="text-slate-600 text-lg">选择左侧的知识点开始学习</p>
              <p className="text-slate-400 text-sm">68 个核心概念 · 8 条学习路径</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
