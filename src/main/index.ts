import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport'

const port = new SerialPort({
  path: 'COM3', // Replace with your Arduino's serial port path
  baudRate: 9600
})

port.on('open', () => {
  console.log('Serial port opened.')
  const data = 'Hello, Arduino!'
  console.log('Sending:', data)
  port.write(`${data}\n`, (err) => {
    if (err) {
      console.error('Error writing to serial port:', err)
    } else {
      console.log('Data sent successfully.')
    }
  })
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#c8fab1',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false, // Disable context isolation (only for development)
      webSecurity: false, // Disable web security (only for development)
      enableBlinkFeatures: 'MediaStream' // Enable MediaStream features
    }
  })

  const session = mainWindow.webContents.session
  session.webRequest.onHeadersReceived((details, callback) => {
    // console.log('Applying CSP...');
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'self';"
        ]
      }
    })
  })
  session.setPermissionRequestHandler((_, permission, callback) => {
    console.log('Media permission requested')
    if (permission === 'media') {
      console.log('Media permission granted')
      callback(true) // Allow webcam access
    } else {
      console.log('Media permission denied')
      callback(false) // Deny other permissions
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.on('serial-write', (event, data) => {
  console.log('Received data to send to Arduino:', data)
  port.write(`${data}\n`, (err) => {
    if (err) {
      console.error('Error writing to serial port:', err)
    } else {
      console.log('Data sent to Arduino:', data)
    }
  })
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

console.log('test')

SerialPort.list()
  .then((ports) => {
    if (ports.length === 0) {
      console.log('No serial ports found.')
    } else {
      console.log('Available ports:', ports)
    }
  })
  .catch((err) => {
    console.error('Error listing serial ports:', err)
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
