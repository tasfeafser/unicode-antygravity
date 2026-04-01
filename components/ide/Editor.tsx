'use client'

import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  language: string
  theme?: 'vs-dark' | 'light'
  value: string
  onChange: (value: string | undefined) => void
}

export function CodeEditor({ language, theme = 'vs-dark', value, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          fontFamily: 'var(--font-mono), monospace'
        }}
      />
    </div>
  )
}
