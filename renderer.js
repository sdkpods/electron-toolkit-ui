/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // 使用通过contextBridge暴露的versions API
  replaceText('node-version', window.electronAPI.versions.node())
  replaceText('chrome-version', window.electronAPI.versions.chrome())
  replaceText('electron-version', window.electronAPI.versions.electron())

  // Theme toggling functionality
  const themeToggleBtn = document.getElementById('theme-toggle')
  const html = document.documentElement
  const sunIcon = document.getElementById('sun-icon')
  const moonIcon = document.getElementById('moon-icon')

  const setTheme = (theme) => {
    html.className = theme
    localStorage.setItem('theme', theme)
    
    // Update icons visibility
    if (theme === 'dark') {
      moonIcon.style.display = 'block'
      sunIcon.style.display = 'none'
    } else {
      moonIcon.style.display = 'none'
      sunIcon.style.display = 'block'
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = html.className
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  })

  // Set initial theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark'
  setTheme(savedTheme)

  // DevTools toggle functionality
  const devToolsBtn = document.getElementById('devtools-toggle')
  devToolsBtn.addEventListener('click', () => {
    window.electronAPI.toggleDevTools()
  })

  // 预览文件功能
  const previewFileBtn = document.getElementById('preview-file')
  previewFileBtn.addEventListener('click', () => {
    // 指定要预览的文件路径
    const filePath = '/Users/niugm/Downloads/666.docx'
    window.electronAPI.previewFile(filePath)
  })
})
