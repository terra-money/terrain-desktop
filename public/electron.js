const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;

const path = require('path');
const isDev = require('electron-is-dev');
const { ipcMain } = require('electron');
const {
    startLocalTerra, stopLocalTerra, blockWs, txWs,
} = require('./utils');

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => mainWindow = null);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron.shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.openDevTools();

    const compose = await startLocalTerra(mainWindow);

    txWs.subscribeTx({}, async ({ value }) => {
        mainWindow.webContents.send('Tx', value);
    });

    blockWs.subscribe('NewBlock', {}, ({ value }) => {
        mainWindow.webContents.send('NewBlock', value);
    });

    ipcMain.on('Transacation', (_, txMsg) => {
        const NOTIFICATION_TITLE = 'Transaction Occurred'
        const NOTIFICATION_BODY = `${txMsg}`

        function showNotification() {
            new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
        }
        if (txMsg) {
            showNotification();
        }
    });

    app.on('window-all-closed', () => {
        stopLocalTerra(compose);
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
