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

  const handleConceptSelect = (conceptId) => {
    setCurrentConceptId(conceptId)
  }

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
    <div className="flex h-screen bg-slate-900">
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
          <div className="overflow-y-auto h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-8 shadow-2xl shadow-blue-500/50 animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
                  Learning<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
                </h1>
                <p className="text-slate-300 text-xl mb-6 font-light">大模型知识点可视化学习平台</p>

                <div className="max-w-3xl mx-auto mb-8 space-y-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h2 className="text-lg font-bold text-white mb-3">🎯 学习目标</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      从零实现 Transformers、vLLM、TRL 等系统的核心模块。通过 68 个实现题，深入理解注意力机制、训练技巧、推理优化、对齐算法等核心概念。
                      <span className="text-blue-400 font-medium">读完论文，写出代码。无需 GPU。</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
                      <div className="text-blue-400 font-bold mb-2">🧠 核心框架</div>
                      <p className="text-slate-400 text-xs">Transformer 架构是现代大模型的基础，理解其内部机制是掌握 AI 的第一步</p>
                    </div>
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
                      <div className="text-purple-400 font-bold mb-2">⚡ 工程优化</div>
                      <p className="text-slate-400 text-xs">从 KV Cache 到量化，从分布式训练到推理加速，掌握工业级优化技巧</p>
                    </div>
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
                      <div className="text-pink-400 font-bold mb-2">🎓 前沿技术</div>
                      <p className="text-slate-400 text-xs">Flash Attention、MoE、RLHF 等前沿技术，紧跟 DeepSeek、Meta 最新研究</p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-sm">68 个核心概念 · 8 条学习路径 · 图解 + 代码联动</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {paths.map((path, index) => {
                  const gradients = [
                    'from-blue-500 to-cyan-500',
                    'from-purple-500 to-pink-500',
                    'from-orange-500 to-red-500',
                    'from-green-500 to-emerald-500',
                    'from-indigo-500 to-blue-500',
                    'from-pink-500 to-rose-500',
                    'from-yellow-500 to-orange-500',
                    'from-teal-500 to-green-500'
                  ]
                  const gradient = gradients[index % gradients.length]

                  return (
                    <div
                      key={path.id}
                      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        <div className="flex items-start gap-6 mb-6">
                          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                              {path.titleZh}
                            </h3>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {path.descriptionZh}
                        </p>

                        <div className="text-xs text-slate-400 mb-4 space-y-1">
                          {path.id === 'transformer-internals' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>Transformer 是所有现代大模型的基础架构，理解其内部机制是深入学习的第一步</p>
                          )}
                          {path.id === 'attention-position' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>注意力机制是 Transformer 的核心，位置编码决定了模型如何理解序列顺序</p>
                          )}
                          {path.id === 'train-gpt-from-scratch' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>从零训练 GPT 让你理解完整的训练流程，掌握优化器、学习率调度等关键技巧</p>
                          )}
                          {path.id === 'inference-distributed' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>工业级部署必备技能，KV Cache、量化、分布式训练是提升性能的关键</p>
                          )}
                          {path.id === 'alignment-agents' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>RLHF 和 PPO 是让 AI 更安全、更有用的核心技术，理解对齐算法是构建可控 AI 的基础</p>
                          )}
                          {path.id === 'vision-transformer' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>ViT 将 Transformer 扩展到视觉领域，是多模态大模型的基础</p>
                          )}
                          {path.id === 'diffusion-transformer' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>扩散模型是 AIGC 的核心技术，Stable Diffusion 和 DALL-E 都基于此</p>
                          )}
                          {path.id === 'llm-frontiers' && (
                            <p>💡 <span className="text-slate-300">为什么重要：</span>前沿架构如 MoE、差分注意力代表了大模型的最新发展方向</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {path.problems?.length || 0} 个知识点
                          </span>
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                            点击左侧开始
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-16 text-center">
                <p className="text-slate-400 text-sm">
                  点击左侧导航栏展开学习路径，选择知识点开始学习
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
