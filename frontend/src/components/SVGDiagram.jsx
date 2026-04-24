export default function SVGDiagram({ conceptId, svgPath, codeLineMapping, onElementClick }) {
  return (
    <div className="bg-gray-50 rounded border border-gray-200 p-8 min-h-[300px] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">该知识点的图解正在制作中</p>
        <p className="text-xs mt-2">概念 ID: {conceptId}</p>
      </div>
    </div>
  )
}
