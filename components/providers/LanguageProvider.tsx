'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    "nav.ide": "IDE",
    "nav.linux": "Linux",
    "nav.courses": "Courses",
    "nav.security": "Security",
    "nav.docs": "Docs",
    "nav.login": "Log In",
    "nav.getAccess": "Get Access",
    "hero.badge": "Unicode Platform 3.0 is now live",
    "hero.title1": "Computer Science",
    "hero.title2": "for the ",
    "hero.title3": "Future",
    "hero.desc": "Unicode blends a powerful web-based IDE, Linux sandboxing, and AI mentoring to help you master engineering 10x faster.",
    "hero.start": "Start Coding",
    "hero.github": "View on GitHub",
    "hero.integrated": "Integrated with:",
    "features.title1": "The Operating System for",
    "features.title2": "Modern CS Students",
    "features.desc": "Replace your fragmented toolset with one cohesive learning platform driven by AI.",
    "pricing.title": "Simple, Transparent Pricing",
    "pricing.desc": "Start for free, unlock unlimited power when you need it.",
    "pricing.basic": "Basic",
    "pricing.basicDesc": "For students exploring programming basics.",
    "pricing.pro": "Pro",
    "pricing.proDesc": "For serious learners and aspiring engineers.",
    "pricing.team": "University",
    "pricing.teamDesc": "For academic institutions and bootcamps.",
    "pricing.recommended": "Recommended",
    "pricing.getStarted": "Get Started",
    "pricing.goPro": "Go Pro",
    "pricing.contactSales": "Contact Sales",
    "cta.title1": "Ready to ",
    "cta.title2": "Build?",
    "cta.desc": "Create an account today and get instant access to our next generation of learning tools.",
    "cta.placeholder": "Enter your email to join...",
    "cta.subscribe": "Subscribe to beta updates",
    "cta.join": "Join Now",
    "footer.desc": "Pioneering the future of computer science education with artificial intelligence and hands-on environments.",
    "footer.platform": "Platform",
    "footer.company": "Company",
    "footer.about": "About Us",
    "footer.architecture": "Architecture",
    "footer.blog": "Blog",
    "footer.privacy": "Privacy Policy",
    "footer.rights": "© 2026 Unicode Platform Inc. All rights reserved.",
    
    // Light Theme specific
    "light.hero.title1": "System",
    "light.hero.title2": "Reboot",
    "light.hero.desc": "A bold new way to master computer science. No soft edges. Just hard code and raw execution.",
    "light.hero.initiate": "INITIATE",
    "light.hero.raw": "Raw",
    "light.hero.power": "Power",
    "light.features.title": "Core Modules",
    "light.features.ide": "Cloud IDE",
    "light.features.ideDesc": "A full-blown editor in your browser. No setup. Just write code.",
    "light.features.access": "Access Module",
    "light.features.linux": "Linux Sim",
    "light.features.linuxDesc": "Real bash environment.",
    "light.features.sec": "Security",
    "light.features.secDesc": "Hack the mainframe.",
    "light.drops.title": "New Drops",
    "light.drops.builder": "App Builder",
    "light.drops.ppt": "Slide Gen",
    "light.drops.game": "Unigame Engine",
    "light.drops.coming": "Coming Soon",
    "light.footer.desc": "Neo-brutalist education platform. No fluff. Just hard skills.",
    "light.footer.newsletter": "JOIN NEWSLETTER",
    "light.footer.submit": "Submit"
  },
  zh: {
    "nav.ide": "云端开发",
    "nav.linux": "Linux终端",
    "nav.courses": "课程库",
    "nav.security": "安全实验室",
    "nav.docs": "文档中心",
    "nav.login": "登录",
    "nav.getAccess": "获取权限",
    "hero.badge": "Unicode 平台 3.0 现已上线",
    "hero.title1": "为未来而生的",
    "hero.title2": "",
    "hero.title3": "计算机科学",
    "hero.desc": "Unicode 集成了强大的 Web IDE、Linux 沙箱和 AI 导师，帮助您以十倍速掌握软件工程。",
    "hero.start": "开始编程",
    "hero.github": "访问 GitHub",
    "hero.integrated": "核心技术：",
    "features.title1": "现代计算机学生的",
    "features.title2": "专属操作系统",
    "features.desc": "用基于人工智能的统一学习平台，取代您碎片化的工具集。",
    "pricing.title": "简单透明的定价",
    "pricing.desc": "免费开始使用，在需要时解锁无限算力。",
    "pricing.basic": "基础版",
    "pricing.basicDesc": "适合探索编程基础的学生。",
    "pricing.pro": "专业版",
    "pricing.proDesc": "适合认真的学习者和未来的工程师。",
    "pricing.team": "高校版",
    "pricing.teamDesc": "适合学术机构和编程训练营。",
    "pricing.recommended": "强烈推荐",
    "pricing.getStarted": "免费开始",
    "pricing.goPro": "升级专业版",
    "pricing.contactSales": "联系销售",
    "cta.title1": "准备好",
    "cta.title2": "构建了吗？",
    "cta.desc": "立即创建帐户，即可访问我们的下一代学习工具。",
    "cta.placeholder": "输入邮箱加入...",
    "cta.subscribe": "订阅测试版更新",
    "cta.join": "立即加入",
    "footer.desc": "利用人工智能和实践环境，开创计算机科学教育的未来。",
    "footer.platform": "平台产品",
    "footer.company": "关于我们",
    "footer.about": "公司简介",
    "footer.architecture": "系统架构",
    "footer.blog": "技术博客",
    "footer.privacy": "隐私政策",
    "footer.rights": "© 2026 Unicode Platform Inc. 保留所有权利。",

    // Light Theme specific
    "light.hero.title1": "系统",
    "light.hero.title2": "重启",
    "light.hero.desc": "掌握计算机科学的全新大胆方式。没有圆滑的边缘。只有硬核代码和原生执行。",
    "light.hero.initiate": "立即启动",
    "light.hero.raw": "原生",
    "light.hero.power": "力量",
    "light.features.title": "核心模块",
    "light.features.ide": "云端 IDE",
    "light.features.ideDesc": "浏览器中的全功能编辑器。免配置，直接写代码。",
    "light.features.access": "访问模块",
    "light.features.linux": "Linux 模拟器",
    "light.features.linuxDesc": "真实的 Bash 环境。",
    "light.features.sec": "网络安全",
    "light.features.secDesc": "黑入主系统。",
    "light.drops.title": "最新发布",
    "light.drops.builder": "应用构建器",
    "light.drops.ppt": "AI 幻灯片",
    "light.drops.game": "Unigame 引擎",
    "light.drops.coming": "敬请期待",
    "light.footer.desc": "新粗野主义教育平台。拒绝花哨。唯有硬实力。",
    "light.footer.newsletter": "加入新闻邮件",
    "light.footer.submit": "提交"
  }
};

const LanguageContext = createContext<{
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('unicode_lang') as Language;
    if (saved === 'zh' || saved === 'en') {
      setLang(saved);
    } else if (navigator.language.startsWith('zh')) {
      setLang('zh');
    }
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'zh' : 'en';
    setLang(next);
    localStorage.setItem('unicode_lang', next);
  };

  const t = (key: string) => {
    return dictionaries[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
