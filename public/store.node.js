const {ipcMain} = require('electron')
const Store = require('electron-store');

const initializeStore = () => {
    const store = new Store();
    store.set('unicorn', '🦄');
    store.set('workingDirectory', '/usr')

    return store;
}

module.exports = {
    initializeStore
}
