'use client'

import { useState } from 'react'
import { 
  File, FolderOpen, Plus, Trash2, Edit3, Check, X,
  FileCode, FileJson, FileText, Database, ChevronRight, ChevronDown
} from 'lucide-react'

export interface VirtualFile {
  id: string
  name: string
  language: string
  content: string
  isUnsaved?: boolean
}

interface FileExplorerProps {
  files: VirtualFile[]
  activeFileId: string | null
  onSelectFile: (id: string) => void
  onCreateFile: (name: string) => void
  onDeleteFile: (id: string) => void
  onRenameFile: (id: string, newName: string) => void
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  python: <FileCode size={14} className="text-yellow-400" />,
  javascript: <FileCode size={14} className="text-yellow-300" />,
  typescript: <FileCode size={14} className="text-blue-400" />,
  java: <FileCode size={14} className="text-orange-400" />,
  cpp: <FileCode size={14} className="text-blue-300" />,
  sql: <Database size={14} className="text-green-400" />,
  json: <FileJson size={14} className="text-yellow-500" />,
  rust: <FileCode size={14} className="text-orange-500" />,
  default: <FileText size={14} className="text-gray-400" />,
}

export function FileExplorer({ files, activeFileId, onSelectFile, onCreateFile, onDeleteFile, onRenameFile }: FileExplorerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  const handleCreate = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim())
      setNewFileName('')
      setIsCreating(false)
    }
  }

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameFile(id, renameValue.trim())
      setRenamingId(null)
      setRenameValue('')
    }
  }

  const getIcon = (lang: string) => FILE_ICONS[lang] || FILE_ICONS.default

  return (
    <div className="h-full bg-[#181818] border-r border-gray-800 flex flex-col select-none">
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-gray-800/50">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Explorer</span>
        <button
          onClick={() => setIsCreating(true)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
          title="New File"
        >
          <Plus size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Project Folder */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3 py-1.5 flex items-center gap-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:bg-gray-800/50"
        >
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <FolderOpen size={12} className="text-blue-400" />
          <span className="ml-1">workspace</span>
        </button>

        {isExpanded && (
          <div className="pl-2">
            {/* New file input */}
            {isCreating && (
              <div className="flex items-center gap-1 px-2 py-1">
                <File size={12} className="text-gray-500 shrink-0" />
                <input
                  autoFocus
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreate()
                    if (e.key === 'Escape') { setIsCreating(false); setNewFileName('') }
                  }}
                  placeholder="filename.py"
                  className="flex-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded outline-none border border-blue-500/50 focus:border-blue-500"
                />
                <button onClick={handleCreate} className="text-green-400 hover:text-green-300"><Check size={12} /></button>
                <button onClick={() => { setIsCreating(false); setNewFileName('') }} className="text-red-400 hover:text-red-300"><X size={12} /></button>
              </div>
            )}

            {/* File list */}
            {files.map(file => (
              <div
                key={file.id}
                className={`group flex items-center gap-1.5 px-4 py-1 cursor-pointer text-xs transition-colors ${
                  activeFileId === file.id 
                    ? 'bg-gray-700/50 text-white' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
                onClick={() => onSelectFile(file.id)}
              >
                {getIcon(file.language)}

                {renamingId === file.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(file.id)
                        if (e.key === 'Escape') setRenamingId(null)
                      }}
                      className="flex-1 bg-gray-800 text-white text-xs px-1 py-0 rounded outline-none border border-blue-500/50"
                      onClick={e => e.stopPropagation()}
                    />
                    <button onClick={e => { e.stopPropagation(); handleRename(file.id) }}><Check size={10} className="text-green-400" /></button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 truncate">{file.name}</span>
                    {file.isUnsaved && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={e => { e.stopPropagation(); setRenamingId(file.id); setRenameValue(file.name) }}
                        className="p-0.5 hover:bg-gray-600 rounded"
                      >
                        <Edit3 size={10} className="text-gray-400" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteFile(file.id) }}
                        className="p-0.5 hover:bg-gray-600 rounded"
                      >
                        <Trash2 size={10} className="text-red-400" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {files.length === 0 && !isCreating && (
              <div className="px-4 py-3 text-[11px] text-gray-600 italic">
                No files yet. Click + to create one.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
