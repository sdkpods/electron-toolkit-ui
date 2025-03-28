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
    // const filePath = '/Users/niugm/Downloads/666.docx'
    const filePath = '/Users/niugm/Downloads/777.pptx'
    window.electronAPI.previewFile(filePath)
  })

  // 修改Action按钮来控制BrowserView
  const actionBtn = document.querySelector('button:not(#theme-toggle):not(#devtools-toggle):not(#preview-file)')
  if (actionBtn) {
    // 将原来的Action按钮修改为地址栏
    actionBtn.innerHTML = `
      <div class="flex items-center gap-2 w-full">
        <input id="url-input" type="text" placeholder="输入URL..." class="w-64 px-2 py-1 rounded bg-background text-foreground border border-input" value="https://www.google.com">
        <button id="navigate-btn" class="bg-primary text-primary-foreground px-2 py-1 rounded">转到</button>
      </div>
    `
    
    // 添加导航按钮
    const navControls = document.createElement('div')
    navControls.className = 'flex items-center gap-2'
    navControls.innerHTML = `
      <button id="back-btn" class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">后退</button>
      <button id="forward-btn" class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">前进</button>
      <button id="refresh-btn" class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">刷新</button>
    `
    
    // 在Action按钮旁边插入导航控件
    actionBtn.parentNode.insertBefore(navControls, actionBtn.nextSibling)
    
    // 添加BrowserView控制按钮
    const viewControls = document.createElement('div')
    viewControls.className = 'flex items-center gap-2 ml-2'
    viewControls.innerHTML = `
      <button id="toggle-position-btn" class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">切换位置</button>
      <div class="flex items-center gap-2">
        <span class="text-sm">宽度:</span>
        <select id="size-select" class="px-2 py-1 rounded bg-background text-foreground border border-input">
          <option value="33">1/3</option>
          <option value="50">1/2</option>
          <option value="25">1/4</option>
          <option value="75">3/4</option>
        </select>
      </div>
    `
    
    // 添加边框样式控制
    const borderControls = document.createElement('div')
    borderControls.className = 'flex items-center gap-2 ml-2'
    borderControls.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-sm">边框:</span>
        <input id="border-color" type="color" value="#3b82f6" class="w-8 h-8 p-0 border border-input rounded cursor-pointer">
        <select id="border-width" class="px-2 py-1 rounded bg-background text-foreground border border-input">
          <option value="1">1px</option>
          <option value="2">2px</option>
          <option value="3" selected>3px</option>
          <option value="5">5px</option>
          <option value="8">8px</option>
        </select>
      </div>
    `
    
    // 插入视图控制按钮
    actionBtn.parentNode.insertBefore(viewControls, actionBtn.nextSibling)
    
    // 插入边框控制
    actionBtn.parentNode.insertBefore(borderControls, actionBtn.nextSibling)
    
    // 添加事件监听器
    document.getElementById('navigate-btn').addEventListener('click', () => {
      const url = document.getElementById('url-input').value
      if (url) {
        window.electronAPI.navigateTo(url)
      }
    })
    
    document.getElementById('url-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = document.getElementById('url-input').value
        if (url) {
          window.electronAPI.navigateTo(url)
        }
      }
    })
    
    document.getElementById('back-btn').addEventListener('click', () => {
      window.electronAPI.goBack()
    })
    
    document.getElementById('forward-btn').addEventListener('click', () => {
      window.electronAPI.goForward()
    })
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
      window.electronAPI.refreshPage()
    })
    
    // 添加BrowserView控制事件监听器
    document.getElementById('toggle-position-btn').addEventListener('click', () => {
      window.electronAPI.toggleBrowserViewPosition()
    })
    
    document.getElementById('size-select').addEventListener('change', (e) => {
      const widthPercentage = parseInt(e.target.value, 10)
      window.electronAPI.resizeBrowserView(widthPercentage)
    })
    
    // 添加边框样式控制事件监听器
    document.getElementById('border-color').addEventListener('change', (e) => {
      const color = e.target.value;
      const width = document.getElementById('border-width').value;
      window.electronAPI.setBorderStyle(color, width);
    });
    
    document.getElementById('border-width').addEventListener('change', (e) => {
      const width = e.target.value;
      const color = document.getElementById('border-color').value;
      window.electronAPI.setBorderStyle(color, width);
    });
  }
})
