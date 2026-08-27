//main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

console.log(`Using data file: ${dataPath}`);

function readData() {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return {
            decks: Array.isArray(data.decks) ? data.decks : [],
            gameStats: Array.isArray(data.gameStats) ? data.gameStats : [],
        };
    } catch (error) {
        console.error(`Unable to read ${dataPath}:`, error.message);
        return { decks: [], gameStats: [] };
    }
}

function writeData(data) {
    const normalizedData = {
        decks: Array.isArray(data.decks) ? data.decks : [],
        gameStats: Array.isArray(data.gameStats) ? data.gameStats : [],
    };

    fs.writeFileSync(dataPath, JSON.stringify(normalizedData, null, 2), 'utf8');
    console.log(`Saved ${normalizedData.decks.length} decks and ${normalizedData.gameStats.length} game stats`);
    return normalizedData;
}

ipcMain.handle('load-data', () => {
    const data = readData();
    console.log(`Loaded ${data.decks.length} decks and ${data.gameStats.length} game stats`);
    return data;
});
ipcMain.handle('save-data', (_event, data) => {
    return writeData(data);
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile('views/home.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});