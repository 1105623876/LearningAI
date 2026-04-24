import { useState, useEffect } from 'react'
import PathNav from './components/PathNav'
import ConceptView from './components/ConceptView'
import PathOverview from './components/PathOverview'
import './index.css'

function App() {
  const [paths, setPaths] = useState([])
  const [concepts, setConcepts] = useState([])
  const [currentConceptId, setCurrentConceptId] = useState(null)
  const [currentPathId, setCurrentPathId] = useState(null)
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
        currentPathId={currentPathId}
        onConceptSelect={setCurrentConceptId}
        onPathSelect={setCurrentPathId}
      />
      <div className="flex-1 overflow-auto">
        {currentPathId && !currentConceptId ? (
          <PathOverview
            path={paths.find(p => p.id === currentPathId)}
            concepts={concepts}
            onConceptSelect={setCurrentConceptId}
          />
        ) : currentConceptId ? (
          <ConceptView conceptId={currentConceptId} />
        ) : (
          <div className="overflow-y-auto h-full">
            <div className="max-w-5xl mx-auto p-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">LearningAI</h1>
                <p className="text-slate-600 text-lg mb-2">大模型知识点可视化学习平台</p>
                <p className="text-slate-500">68 个核心概念 · 8 条学习路径 · 从零实现 Transformers、vLLM、TRL</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paths.map((path, index) => (
                  <div key={path.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{path.titleZh}</h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{path.descriptionZh}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {path.problems?.length || 0} 个知识点
                          </span>
                          <button
                            onClick={() => setCurrentPathId(path.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            开始学习 →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-slate-500 text-sm">
                  选择左侧导航栏中的学习路径，或点击上方卡片开始学习
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
