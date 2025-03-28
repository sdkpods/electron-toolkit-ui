/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron')

// 暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  previewFile: (filePath) => ipcRenderer.send('preview-file', filePath),
  toggleDevTools: () => ipcRenderer.send('toggle-devtools'),
  navigateTo: (url) => ipcRenderer.send('navigate-to', url),
  refreshPage: () => ipcRenderer.send('refresh-page'),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  resizeBrowserView: (widthPercentage) => ipcRenderer.send('resize-browser-view', widthPercentage),
  toggleBrowserViewPosition: () => ipcRenderer.send('toggle-browser-view-position'),
  setBorderStyle: (color, width) => ipcRenderer.send('set-border-style', color, width),
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  }
})

window.addEventListener('DOMContentLoaded', () => {
  // 这部分代码不再需要，因为我们已经通过contextBridge暴露了process.versions
})
