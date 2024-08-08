import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Database from "better-sqlite3";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(path.join('./', "src/electron/preload.js")), // Use path.join with __dirname
    },
  });

  win.loadURL("http://localhost:5173");
};

// Initialize Database
const db = new Database("mydatabase.db");

// Handle database operations via IPC
ipcMain.handle("db-query", (event, query, params) => {
  try {
    const stmt = db.prepare(query);
    const result = stmt.all(params);
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();
});
