const { app, BrowserWindow, shell } = require('electron');
const http = require('http');

// Start Real Backend Server (Express + Nodemailer + Live Map Scraper)
require('./backend/server.js');

let mainWindow;

function waitForServer(url, callback) {
  const req = http.get(url, (res) => {
    if (res.statusCode === 200) {
      callback();
    } else {
      setTimeout(() => waitForServer(url, callback), 350);
    }
  });
  req.on('error', () => {
    setTimeout(() => waitForServer(url, callback), 350);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    backgroundColor: '#03060C',
    title: 'Sophia v2.0 | Omnix Global Autonomous AI Lead Gen CRM',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Open WhatsApp & external links in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  waitForServer('http://127.0.0.1:5000/api/health', () => {
    mainWindow.loadURL('http://127.0.0.1:5000');
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});