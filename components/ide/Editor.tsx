'use client'

import Editor, { OnMount } from '@monaco-editor/react'
import { useRef } from 'react'

interface CodeEditorProps {
  language: string
  theme?: 'vs-dark' | 'light'
  value: string
  onChange: (value: string | undefined) => void
  fileName?: string
}

// Map our language names to Monaco language IDs
const LANG_MAP: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp',
  sql: 'sql',
  json: 'json',
  rust: 'rust',
  html: 'html',
  css: 'css',
}

export function CodeEditor({ language, theme = 'vs-dark', value, onChange, fileName }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Add custom keyboard shortcuts
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        // Trigger save (handled by parent)
        console.log('Save triggered via Ctrl+S')
      }
    })

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        // Trigger run (handled by parent)
        console.log('Run triggered via Ctrl+Enter')
      }
    })

    // Set up Python hints
    if (language === 'python') {
      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }
          return {
            suggestions: [
              { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Print to console' },
              { label: 'def', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Define function' },
              { label: 'class', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, params}):\n\t\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Define class' },
              { label: 'for', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'For loop' },
              { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if ${1:condition}:\n\t${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'If statement' },
              { label: 'while', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'while ${1:condition}:\n\t${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'While loop' },
              { label: 'try', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${3:print(e)}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Try/except block' },
              { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import ${1:module}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Import module' },
              { label: 'lambda', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'lambda ${1:x}: ${2:x}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'Lambda expression' },
              { label: 'list_comprehension', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[${1:expr} for ${2:item} in ${3:iterable}]', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, detail: 'List comprehension' },
            ]
          }
        }
      })
    }
  }

  const monacoLang = LANG_MAP[language] || language

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={monacoLang}
        theme={theme}
        value={value}
        onChange={onChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: true, scale: 1, showSlider: 'mouseover' },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          scrollBeyondLastLine: false,
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
          guides: { bracketPairs: true, indentation: true },
          renderLineHighlight: 'all',
          lineNumbers: 'on',
          suggest: { showSnippets: true, showKeywords: true, showFunctions: true },
          quickSuggestions: { other: true, comments: false, strings: false },
          parameterHints: { enabled: true },
          tabSize: 4,
          detectIndentation: true,
        }}
      />
    </div>
  )
}
