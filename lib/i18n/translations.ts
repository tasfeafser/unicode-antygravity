export type Language = 'en' | 'zh'

export interface Translations {
  nav: {
    vision: string
    pricing: string
    languageToggle: string
  }
  hero: {
    titlePrefix: string
    titleSuffix: string
    badges: string[]
    descriptions: string[]
  }
  features: {
    ide: { title: string; desc: string }
    linux: { title: string; desc: string }
    aiMentor: { title: string; desc: string }
    cyber: { title: string; desc: string }
    course: { title: string; desc: string }
    docs: { title: string; desc: string }
    concierge: { title: string; desc: string }
    appBuilder: { title: string; desc: string }
    ee: { title: string; desc: string }
    architecture: { title: string; desc: string }
    unigame: { title: string; desc: string }
  }
  footer: {
    visionLink: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      vision: "Our Vision",
      pricing: "Subscription",
      languageToggle: "EN / 中"
    },
    hero: {
      titlePrefix: "From \"Hello World\"",
      titleSuffix: "to Software Engineer.",
      badges: ["Unified Academic OS"],
      descriptions: [
        "Unicode acts as a co-pilot for someone diving into the deep end of Computer Science without a life jacket.",
        "Master Linux, Cybersecurity, and Software Engineering in one unified Academic OS.",
        "Bridge the gap from student to engineer with AI-guided walkthroughs and integrated tools.",
        "The ultimate success engine for the next generation of Computer Science leaders."
      ]
    },
    features: {
      ide: { title: "{ In-Browser IDE }", desc: "Write, compile, and execute code directly. No local setup required." },
      linux: { title: "root@unicode:~#", desc: "A safe space to learn the command line without breaking your OS." },
      aiMentor: { title: "AI Code Mentor", desc: "Intelligent pair-programming powered by Groq and Gemini. Explains logic, debugging, and CS fundamentals." },
      cyber: { title: "Cybersecurity Lab", desc: "Practice ethical hacking and understand vulnerabilities safely." },
      course: { title: "Course Library", desc: "Searchable vector-indexed CS courses with RAG comprehension." },
      docs: { title: "Docs & Slides", desc: "Auto-generate professional documentation and presentations." },
      concierge: { title: "Academic Concierge", desc: "Upload PDFs. The AI tracks syllabus and extracts pure knowledge." },
      appBuilder: { title: "AppBuilder", desc: "Build and deploy full-stack apps with AI assistance. Low-code to pro-code." },
      ee: { title: "Electrical Engineering", desc: "Advanced circuit simulation and logic design. Powered by withdiode.com." },
      architecture: { title: "Arcstructure", desc: "Complex software systems design. Mapping out the skeleton of your ideas." },
      unigame: { title: "Unigame", desc: "Create games from scratch with AI. Powered by Rosebud AI." }
    },
    footer: {
      visionLink: "Read our vision for the future of CS education"
    }
  },
  zh: {
    nav: {
      vision: "我们的愿景",
      pricing: "订阅服务",
      languageToggle: "中 / EN"
    },
    hero: {
      titlePrefix: "从 \"Hello World\"",
      titleSuffix: "到软件工程师。",
      badges: ["统一学术操作系统"],
      descriptions: [
        "Unicode 就像是一个副驾驶，为那些在没有救生衣的情况下潜入计算机科学深处的人提供指引。",
        "在一个统一的学术操作系统中掌握 Linux、网络安全和软件工程。",
        "通过 AI 引导的演练和集成工具，缩小学生与工程师之间的差距。",
        "下一代计算机科学领袖的终极成功引擎。"
      ]
    },
    features: {
      ide: { title: "{ 浏览器集成开发环境 }", desc: "直接编写、编译和执行代码。无需本地环境配置。" },
      linux: { title: "root@unicode:~#", desc: "在不损坏操作系统的情况下学习命令行的安全空间。" },
      aiMentor: { title: "AI 代码导师", desc: "由 Groq 和 Gemini 提供支持的智能结对编程。解释逻辑、调试和计算机科学基础知识。" },
      cyber: { title: "网络安全实验室", desc: "安全地练习道德黑客攻击并了解漏洞。" },
      course: { title: "课程库", desc: "具有 RAG 理解能力的、可搜索的矢量索引计算机科学课程。" },
      docs: { title: "文档与演示文稿", desc: "自动生成专业的项目文档和演示文稿。" },
      concierge: { title: "学术管家", desc: "上传 PDF。AI 跟踪教学大纲并提取纯粹的知识。" },
      appBuilder: { title: "应用构建器", desc: "在 AI 的协助下构建和部署全栈应用。支持低代码到专业代码。" },
      ee: { title: "电气工程", desc: "先进的电路模拟和逻辑设计。由 withdiode.com 提供支持。" },
      architecture: { title: "系统架构", desc: "复杂的软件系统设计。绘制您想法的骨架。" },
      unigame: { title: "Unigame 游戏实验室", desc: "使用 AI 从零开始创建游戏。由 Rosebud AI 提供支持。" }
    },
    footer: {
      visionLink: "阅读我们对计算机科学教育未来的愿景"
    }
  }
}
