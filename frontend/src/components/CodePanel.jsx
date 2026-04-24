import Editor from '@monaco-editor/react'
import { useEffect, useRef } from 'react'

export default function CodePanel({ code, language, highlightedLines }) {
  const editorRef = useRef(null)

  function handleEditorDidMount(editor) {
    editorRef.current = editor
  }

  useEffect(() => {
    if (!editorRef.current || !highlightedLines.length) return

    const decorations = highlightedLines.map(line => ({
      range: new window.monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'highlighted-line',
        glyphMarginClassName: 'highlighted-glyph'
      }
    }))

    editorRef.current.deltaDecorations([], decorations)
  }, [highlightedLines])

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <Editor
        height="400px"
        language={language}
        value={code}
        theme="vs-light"
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          fontSize: 14
        }}
      />
    </div>
  )
}
