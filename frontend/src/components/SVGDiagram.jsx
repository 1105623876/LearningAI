export default function SVGDiagram({ conceptId, svgPath, codeLineMapping, onElementClick }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-300 p-12 min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-2">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-600 font-medium mb-1">该知识点的图解正在制作中</p>
          <p className="text-sm text-slate-500">我们正在为所有 68 个知识点制作精美的可视化图解</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          概念 ID: <code className="font-mono text-blue-600">{conceptId}</code>
        </div>
      </div>
    </div>
  )
}
