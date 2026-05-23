import { createContext, useContext, useState, useCallback } from 'react'

const T = {
  zh: {
    nav: {
      about: '關於', projects: '記事', notes: '書評',
      photos: '相片', contact: '聯絡',
      login: '登入', logout: '登出', admin: '後台',
      langSwitch: 'EN',
    },
    about: {
      title: '滕雲飛',
      subtitle: '我是多倫多大學學生，專修於數學和物理，我的興趣廣泛，一言難盡。我喜歡閱讀一些書籍，並留下我對該書籍的想法。歡迎瀏覽我的想法並留下你寶貴的評論，謝謝!',
    },
    projects: { title: '專案', empty: '尚無專案。' },
    notes: {
      title: '', subtitle: '目錄', back: '← 返回目錄',
      empty: '尚無書評。',
      commentTitle: '評論區',
      commentPh: '留下您的匿名評論…',
      commentBtn: '送出',
      noComments: '尚無評論，來留下第一則吧！',
      keywords: '關鍵字',
      coreConcept: '核心概念',
      reasonToRead: '為何我要讀這本書',
      sectionQuotes: '名言佳句',
      sectionQuestions: '疑惑',
    },
    photos: { title: '相片', empty: '尚無相片。' },
    contact: {
      title: '聯絡我',
      namePh: '您的姓名', emailPh: '您的信箱', msgPh: '您的訊息',
      send: '送出',
      success: '訊息已送出！感謝您的聯絡。',
      error: '送出失敗，請稍後再試。',
    },
    admin: {
      title: '後台管理',
      tabProjects: '記事', tabBooks: '書評', tabPhotos: '相片', tabContacts: '聯絡訊息', tabAbout: '關於頁面',
      subtitleZh: '副標題（中文）', subtitleEn: '副標題（英文）',
      add: '新增', edit: '編輯', delete: '刪除', save: '儲存', cancel: '取消',
      confirmDelete: '確定刪除？此操作無法復原。',
      titleZh: '標題（中文）', titleEn: '標題（英文）',
      descZh: '說明（中文）', descEn: '說明（英文）',
      url: '連結網址', imageUrl: '圖片網址',
      author: '作者',
      reviewZh: '書評內容（中文）', reviewEn: '書評內容（英文）',
      coverUrl: '封面圖片網址',
      captionZh: '說明（中文）', captionEn: '說明（英文）',
      uploadPhoto: '選擇相片上傳',
      uploading: '上傳中…',
      noContacts: '尚無聯絡訊息。',
      keywords: '關鍵字（逗號分隔）',
      coreConcept: '核心概念',
      reasonToRead: '為何我要讀這本書',
      contentBlocks: '內容區塊',
      addSection: '＋ 新增區塊',
      removeSection: '移除',
      sectionTitle: '主標題',
      subsectionTitle: '次標題',
      body: '內文',
      quotes: '名言佳句',
      questions: '疑惑',
      published: '已發布',
    },
    auth: {
      loginTitle: '管理員登入',
      loginBtn: '使用 Google 帳號登入',
      loginNote: '僅限管理員帳號（flyincloud2001@gmail.com）',
      noAccess: '此 Google 帳號無管理員權限。',
    },
  },
  en: {
    nav: {
      about: 'About', projects: 'Notes', notes: 'Book Reviews',
      photos: 'Photos', contact: 'Contact',
      login: 'Login', logout: 'Logout', admin: 'Admin',
      langSwitch: '中',
    },
    about: {
      title: 'Foster Teng',
      subtitle: 'I am a student at the University of Toronto, majoring in Mathematics and Physics. My interests are wide and hard to summarize. I enjoy reading books and leaving my thoughts on them. Feel free to browse my ideas and leave your valuable comments. Thank you!',
    },
    projects: { title: 'Projects', empty: 'No projects yet.' },
    notes: {
      title: '', subtitle: 'Index', back: '← Back to list',
      empty: 'No book reviews yet.',
      commentTitle: 'Comments',
      commentPh: 'Leave an anonymous comment…',
      commentBtn: 'Submit',
      noComments: 'No comments yet. Be the first!',
      keywords: 'Keywords',
      coreConcept: 'Core Concept',
      reasonToRead: 'Why I Read This Book',
      sectionQuotes: 'Notable Quotes',
      sectionQuestions: 'Questions',
    },
    photos: { title: 'Photos', empty: 'No photos yet.' },
    contact: {
      title: 'Contact Me',
      namePh: 'Your name', emailPh: 'Your email', msgPh: 'Your message',
      send: 'Send',
      success: 'Message sent! Thank you for reaching out.',
      error: 'Failed to send. Please try again.',
    },
    admin: {
      title: 'Admin Panel',
      tabProjects: 'Notes', tabBooks: 'Book Reviews', tabPhotos: 'Photos', tabContacts: 'Contact Messages', tabAbout: 'About Page',
      subtitleZh: 'Subtitle (Chinese)', subtitleEn: 'Subtitle (English)',
      add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
      confirmDelete: 'Delete this item? This cannot be undone.',
      titleZh: 'Title (Chinese)', titleEn: 'Title (English)',
      descZh: 'Description (Chinese)', descEn: 'Description (English)',
      url: 'URL', imageUrl: 'Image URL',
      author: 'Author',
      reviewZh: 'Review (Chinese)', reviewEn: 'Review (English)',
      coverUrl: 'Cover Image URL',
      captionZh: 'Caption (Chinese)', captionEn: 'Caption (English)',
      uploadPhoto: 'Choose photo to upload',
      uploading: 'Uploading…',
      noContacts: 'No contact messages yet.',
      keywords: 'Keywords (comma-separated)',
      coreConcept: 'Core Concept',
      reasonToRead: 'Why I Read This Book',
      contentBlocks: 'Content Blocks',
      addSection: '＋ Add Block',
      removeSection: 'Remove',
      sectionTitle: 'Main Title',
      subsectionTitle: 'Subtitle',
      body: 'Body',
      quotes: 'Notable Quotes',
      questions: 'Questions / Doubts',
      published: 'Published',
    },
    auth: {
      loginTitle: 'Admin Login',
      loginBtn: 'Sign in with Google',
      loginNote: 'Admin account only (flyincloud2001@gmail.com)',
      noAccess: 'This Google account does not have admin access.',
    },
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('pw_lang') || 'zh' } catch { return 'zh' }
  })

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh'
      try { localStorage.setItem('pw_lang', next) } catch {}
      return next
    })
  }, [])

  const t = useCallback((section, key) => {
    return T[lang]?.[section]?.[key] ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
