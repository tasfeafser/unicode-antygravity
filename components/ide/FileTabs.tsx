'use client'

import { X, FileCode } from 'lucide-react'
import { VirtualFile } from './FileExplorer'

interface FileTabsProps {
  files: VirtualFile[]
  activeFileId: string | null
  onSelectFile: (id: string) => void
  onCloseFile: (id: string) => void
}

const LANG_COLORS: Record<string, string> = {
  python: 'text-yellow-400',
  javascript: 'text-yellow-300',
  typescript: 'text-blue-400',
  java: 'text-orange-400',
  cpp: 'text-blue-300',
  sql: 'text-green-400',
  rust: 'text-orange-500',
}

export function FileTabs({ files, activeFileId, onSelectFile, onCloseFile }: FileTabsProps) {
  if (files.length === 0) return null

  return (
    <div className="flex items-center bg-[#1e1e1e] border-b border-gray-800 overflow-x-auto scrollbar-thin">
      {files.map(file => {
        const isActive = file.id === activeFileId
        const colorClass = LANG_COLORS[file.language] || 'text-gray-400'

        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={`group flex items-center gap-2 px-4 py-2 text-xs cursor-pointer border-r border-gray-800/50 transition-colors min-w-0 shrink-0 ${
              isActive
                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500'
                : 'bg-[#181818] text-gray-500 hover:text-gray-300 border-t-2 border-t-transparent'
            }`}
          >
            <FileCode size={13} className={colorClass} />
            <span className="truncate max-w-[120px]">{file.name}</span>
            {file.isUnsaved && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            )}
            <button
              onClick={e => { e.stopPropagation(); onCloseFile(file.id) }}
              className={`p-0.5 rounded hover:bg-gray-600 transition-colors shrink-0 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
