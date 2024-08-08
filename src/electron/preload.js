const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  dbQuery: (query, params) => ipcRenderer.invoke('db-query', query, params),
});