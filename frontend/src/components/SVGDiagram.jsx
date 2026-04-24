import { useState, useEffect } from 'react'

export default function SVGDiagram({ conceptId, svgPath, codeLineMapping, onElementClick }) {
  const [svgContent, setSvgContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch(`/src/data/diagrams/${conceptId}.svg`)
        if (response.ok) {
          const text = await response.text()
          setSvgContent(text)
        } else {
          setSvgContent(null)
        }
      } catch (err) {
        setSvgContent(null)
      } finally {
        setLoading(false)
      }
    }
    loadSVG()
  }, [conceptId])

  useEffect(() => {
    if (!svgContent) return

    const handleClick = (e) => {
      const target = e.target.closest('[data-code-line]')
      if (target) {
        const lines = target.getAttribute('data-code-line').split(',').map(Number)
        onElementClick(lines)
      }
    }

    const container = document.getElementById(`svg-${conceptId}`)
    if (container) {
      container.addEventListener('click', handleClick)
      return () => container.removeEventListener('click', handleClick)
    }
  }, [svgContent, conceptId, onElementClick])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 min-h-[300px] flex items-center justify-center">
        <div className="text-slate-400">加载图解中...</div>
      </div>
    )
  }

  if (!svgContent) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">该知识点的图解正在制作中</p>
          <p className="text-xs mt-2">概念 ID: {conceptId}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id={`svg-${conceptId}`}
      className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 overflow-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
