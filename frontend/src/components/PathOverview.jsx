import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PathOverview({ path, concepts, onConceptSelect }) {
  if (!path) return null

  const pathConcepts = path.problems?.map(problemId => 
    concepts.find(c => c.id === problemId)
  ).filter(Boolean) || []

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">{path.titleZh}</h1>
          <p className="text-blue-100 text-lg">{path.titleEn}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">路径介绍</h2>
          <div className="prose prose-slate max-w-none text-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {path.descriptionZh}
            </ReactMarkdown>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {pathConcepts.length} 个知识点
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">知识点列表</h2>
          <div className="space-y-3">
            {pathConcepts.map((concept, index) => (
              <button
                key={concept.id}
                onClick={() => onConceptSelect(concept.id)}
                className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {concept.titleZh}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        concept.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        concept.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {concept.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{concept.title}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
