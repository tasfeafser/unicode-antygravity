'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  ArrowLeft, FileText, GitBranch, Globe, Presentation, 
  ClipboardList, Download, Loader2, Sparkles, Code,
  ChevronDown
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/useLanguage'
import { exportToPDF } from '@/lib/docs/pdf-export'
import { exportToPPTX } from '@/lib/docs/pptx-export'

type DocType = 'srs' | 'uml' | 'api' | 'ppt' | 'report'

interface TabConfig {
  id: DocType
  label: string
  labelZh: string
  icon: React.ReactNode
  description: string
  descriptionZh: string
  color: string
  fields: FieldConfig[]
}

interface FieldConfig {
  name: string
  label: string
  labelZh: string
  type: 'text' | 'textarea' | 'tags'
  placeholder: string
  placeholderZh: string
  required?: boolean
}

const TABS: TabConfig[] = [
  {
    id: 'srs',
    label: 'SRS Generator',
    labelZh: 'SRS 生成器',
    icon: <ClipboardList size={18} />,
    description: 'Generate IEEE-830 compliant Software Requirements Specifications',
    descriptionZh: '生成符合IEEE-830标准的软件需求规格说明书',
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { name: 'title', label: 'Project Title', labelZh: '项目标题', type: 'text', placeholder: 'e.g. E-Commerce Platform', placeholderZh: '例如：电商平台', required: true },
      { name: 'description', label: 'Project Description', labelZh: '项目描述', type: 'textarea', placeholder: 'Describe the software system, its purpose, target users, and key objectives...', placeholderZh: '描述软件系统、目的、目标用户和主要目标...', required: true },
      { name: 'requirements', label: 'Key Requirements', labelZh: '关键需求', type: 'tags', placeholder: 'Type a requirement and press Enter', placeholderZh: '输入需求后按回车' },
    ]
  },
  {
    id: 'uml',
    label: 'UML Diagrams',
    labelZh: 'UML 图表',
    icon: <GitBranch size={18} />,
    description: 'Generate class, sequence, ER, and use case diagrams with Mermaid.js',
    descriptionZh: '使用 Mermaid.js 生成类图、时序图、ER图和用例图',
    color: 'from-purple-500 to-pink-500',
    fields: [
      { name: 'title', label: 'System Name', labelZh: '系统名称', type: 'text', placeholder: 'e.g. Library Management System', placeholderZh: '例如：图书管理系统', required: true },
      { name: 'description', label: 'System Description', labelZh: '系统描述', type: 'textarea', placeholder: 'Describe the system architecture, entities, relationships, and workflows...', placeholderZh: '描述系统架构、实体关系和工作流...', required: true },
      { name: 'code', label: 'Source Code (optional)', labelZh: '源代码（可选）', type: 'textarea', placeholder: 'Paste code to analyze for class/ER diagrams...', placeholderZh: '粘贴代码用于分析类图/ER图...' },
    ]
  },
  {
    id: 'api',
    label: 'API Docs',
    labelZh: 'API 文档',
    icon: <Globe size={18} />,
    description: 'Generate comprehensive API documentation with Swagger-style formatting',
    descriptionZh: '生成带有Swagger风格格式的综合API文档',
    color: 'from-green-500 to-emerald-500',
    fields: [
      { name: 'title', label: 'API Name', labelZh: 'API 名称', type: 'text', placeholder: 'e.g. User Management API', placeholderZh: '例如：用户管理API', required: true },
      { name: 'description', label: 'API Description', labelZh: 'API 描述', type: 'textarea', placeholder: 'Describe the API endpoints, purpose, authentication method, and data models...', placeholderZh: '描述API端点、目的、认证方式和数据模型...', required: true },
      { name: 'code', label: 'Schema / Routes', labelZh: '模式/路由', type: 'textarea', placeholder: 'Paste route definitions or database schema to document...', placeholderZh: '粘贴路由定义或数据库模式...' },
    ]
  },
  {
    id: 'ppt',
    label: 'Presentation',
    labelZh: '演示文稿',
    icon: <Presentation size={18} />,
    description: 'Generate professional slide decks with content and speaker notes',
    descriptionZh: '生成带有内容和演讲者备注的专业幻灯片',
    color: 'from-orange-500 to-red-500',
    fields: [
      { name: 'title', label: 'Presentation Title', labelZh: '演示标题', type: 'text', placeholder: 'e.g. Introduction to Machine Learning', placeholderZh: '例如：机器学习入门', required: true },
      { name: 'description', label: 'Topic Description', labelZh: '主题描述', type: 'textarea', placeholder: 'Describe the topic, target audience, key points to cover, and presentation goals...', placeholderZh: '描述主题、目标受众、要点和演示目标...', required: true },
    ]
  },
  {
    id: 'report',
    label: 'Report',
    labelZh: '报告',
    icon: <FileText size={18} />,
    description: 'Generate project reports, lab reports, and research documentation',
    descriptionZh: '生成项目报告、实验报告和研究文档',
    color: 'from-teal-500 to-sky-500',
    fields: [
      { name: 'title', label: 'Report Title', labelZh: '报告标题', type: 'text', placeholder: 'e.g. Q4 Performance Analysis Report', placeholderZh: '例如：第四季度绩效分析报告', required: true },
      { name: 'description', label: 'Report Topic', labelZh: '报告主题', type: 'textarea', placeholder: 'Describe the subject, scope, methodology, and what the report should cover...', placeholderZh: '描述主题、范围、方法和报告内容...', required: true },
      { name: 'requirements', label: 'Key Findings / Data Points', labelZh: '主要发现/数据点', type: 'tags', placeholder: 'Add data points or findings', placeholderZh: '添加数据点或发现' },
    ]
  }
]

export default function DocsPage() {
  const { language: uiLang } = useLanguage()
  const [activeTab, setActiveTab] = useState<DocType>('srs')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [tagInput, setTagInput] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const currentTab = TABS.find(t => t.id === activeTab)!

  // Reset form when tab changes
  useEffect(() => {
    setFormData({})
    setGeneratedContent('')
    setTagInput('')
  }, [activeTab])

  // Mermaid rendering
  useEffect(() => {
    if (generatedContent && activeTab === 'uml') {
      import('mermaid').then(({ default: mermaid }) => {
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'dark',
          themeVariables: {
            primaryColor: '#3B82F6',
            primaryTextColor: '#E2E8F0',
            primaryBorderColor: '#475569',
            lineColor: '#64748B',
            secondaryColor: '#1E293B',
            tertiaryColor: '#0F172A',
          }
        })
        // Find all mermaid blocks and render them
        const mermaidBlocks = document.querySelectorAll('.mermaid-block')
        mermaidBlocks.forEach(async (el, i) => {
          try {
            const code = el.textContent || ''
            const { svg } = await mermaid.render(`mermaid-${i}-${Date.now()}`, code)
            el.innerHTML = svg
            el.classList.add('rendered')
          } catch (e) {
            console.warn('Mermaid render error:', e)
          }
        })
      })
    }
  }, [generatedContent, activeTab])

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleAddTag = (fieldName: string) => {
    if (!tagInput.trim()) return
    const existing = formData[fieldName] || []
    setFormData(prev => ({ ...prev, [fieldName]: [...existing, tagInput.trim()] }))
    setTagInput('')
  }

  const handleRemoveTag = (fieldName: string, index: number) => {
    const existing = formData[fieldName] || []
    setFormData(prev => ({ ...prev, [fieldName]: existing.filter((_: any, i: number) => i !== index) }))
  }

  const handleGenerate = async () => {
    if (!formData.title || !formData.description) return
    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const res = await fetch('/api/docs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          code: formData.code,
        })
      })

      const data = await res.json()
      if (data.error) {
        setGeneratedContent(`> ⚠️ Error: ${data.error}`)
      } else {
        setGeneratedContent(data.content)
      }
    } catch (err) {
      setGeneratedContent(`> ⚠️ Network error: ${String(err)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = async () => {
    if (!generatedContent) return
    setIsExporting(true)
    try {
      await exportToPDF(generatedContent, formData.title || 'Document', activeTab)
    } catch (e) {
      console.error('PDF export failed:', e)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPPTX = async () => {
    if (!generatedContent) return
    setIsExporting(true)
    try {
      await exportToPPTX(generatedContent, formData.title || 'Presentation')
    } catch (e) {
      console.error('PPTX export failed:', e)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <ArrowLeft size={16} className="text-gray-400" />
            </Link>
            <div className="h-6 w-px bg-gray-800" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {uiLang === 'en' ? 'Doc Tools' : '文档工具'}
            </h1>
          </div>

          {generatedContent && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Code size={14} />
                {uiLang === 'en' ? 'Copy MD' : '复制'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={14} />
                PDF
              </button>
              {activeTab === 'ppt' && (
                <button
                  onClick={handleExportPPTX}
                  disabled={isExporting}
                  className="px-3 py-1.5 text-sm bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Download size={14} />
                  PPTX
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/20`
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {uiLang === 'en' ? tab.label : tab.labelZh}
            </button>
          ))}
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Form */}
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentTab.color} bg-opacity-10 border border-gray-800/50`}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {currentTab.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{uiLang === 'en' ? currentTab.label : currentTab.labelZh}</h2>
                  <p className="text-sm text-gray-300">{uiLang === 'en' ? currentTab.description : currentTab.descriptionZh}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800/50 p-5 space-y-4">
              {currentTab.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {uiLang === 'en' ? field.label : field.labelZh}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={e => handleFieldChange(field.name, e.target.value)}
                      placeholder={uiLang === 'en' ? field.placeholder : field.placeholderZh}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={e => handleFieldChange(field.name, e.target.value)}
                      placeholder={uiLang === 'en' ? field.placeholder : field.placeholderZh}
                      rows={field.name === 'code' ? 8 : 4}
                      className={`w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none ${
                        field.name === 'code' ? 'font-mono text-sm' : ''
                      }`}
                    />
                  )}

                  {field.type === 'tags' && (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddTag(field.name)
                            }
                          }}
                          placeholder={uiLang === 'en' ? field.placeholder : field.placeholderZh}
                          className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                        <button
                          onClick={() => handleAddTag(field.name)}
                          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData[field.name] || []).map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-1">
                            {tag}
                            <button onClick={() => handleRemoveTag(field.name, i)} className="ml-1 hover:text-red-400">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.title || !formData.description}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r ${currentTab.color} hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {uiLang === 'en' ? 'Generating...' : '生成中...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {uiLang === 'en' ? 'Generate Document' : '生成文档'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800/50 overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/80">
              <span className="text-sm font-medium text-gray-400">
                {uiLang === 'en' ? 'Preview' : '预览'}
              </span>
              {generatedContent && (
                <span className="text-xs text-gray-500">
                  {generatedContent.length.toLocaleString()} {uiLang === 'en' ? 'chars' : '字符'}
                </span>
              )}
            </div>

            <div 
              ref={previewRef}
              className="flex-1 p-6 overflow-y-auto max-h-[70vh] prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h1:text-2xl prose-h1:border-b prose-h1:border-gray-700 prose-h1:pb-2
                prose-h2:text-xl prose-h2:text-blue-300
                prose-h3:text-lg prose-h3:text-purple-300
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-li:text-gray-300
                prose-code:text-green-400 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700
                prose-table:border-collapse
                prose-th:bg-gray-800 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:border prose-th:border-gray-700
                prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-700
                prose-strong:text-white
                prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-400
                prose-a:text-blue-400"
            >
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                  <p className="text-lg">{uiLang === 'en' ? 'AI is generating your document...' : 'AI正在生成您的文档...'}</p>
                  <p className="text-sm mt-1">{uiLang === 'en' ? 'This may take 15-30 seconds' : '这可能需要15-30秒'}</p>
                </div>
              ) : generatedContent ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      if (match && match[1] === 'mermaid') {
                        return (
                          <div className="mermaid-block my-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700 overflow-x-auto">
                            {String(children).replace(/\n$/, '')}
                          </div>
                        )
                      }
                      return match ? (
                        <pre className="bg-gray-800/80 rounded-xl p-4 overflow-x-auto border border-gray-700">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      )
                    }
                  }}
                >
                  {generatedContent}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                  <FileText size={48} className="mb-4 opacity-30" />
                  <p>{uiLang === 'en' ? 'Your generated document will appear here' : '生成的文档将显示在此处'}</p>
                  <p className="text-sm mt-1">{uiLang === 'en' ? 'Fill in the form and click Generate' : '填写表单并点击生成'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
