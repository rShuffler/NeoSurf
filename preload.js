const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  goBack: () => window.history.back(),
  goForward: () => window.history.forward(),
  reload: () => window.location.reload(),
  openAbout: () => ipcRenderer.send('open-about'),
});
