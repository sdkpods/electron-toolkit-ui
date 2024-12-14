/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

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
    ipcRenderer.send('toggle-devtools')
  })
})
