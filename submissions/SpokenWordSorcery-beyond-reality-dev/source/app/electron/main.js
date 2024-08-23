const { ipcMain, app, BrowserWindow } = require("electron");

function createWindow() {
  var window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.removeMenu();
  window.webContents.openDevTools();
  window.loadFile("app/src/index.html");
  window.webContents.on("did-finish-load", () => {
    window.show();
    window.focus();
  });
  window.maximize();
  window.webContents.executeJavaScript(`
        const { switchScreen, switchButton, switchMapButton, blockInput, allowInput } = require("./general.js");
        const { saveGame, loadGame, deleteGame, updateSaveGames, getValue, changeValue } = require("./save_data.js");
        const { updateMap, updateWorldMap, updateMapKey } = require("./map.js");
        const { intro } = require("./cutscenes/imperial_citadel/imperial_academy/intro/intro.js");

        // Start menu functions
        document.getElementById("start-button").onclick = function () {
          document.getElementById("game-screen").style.display = "block";
          document.getElementById("start-screen").style.display = "none";
          document.getElementById("home-button").style.backgroundColor = "#d1d1d1";
          document.getElementById("home-button").style.cursor = "default";
          intro();
        }

        document.getElementById("load-button").onclick = function () { 
          document.getElementById("loading-screen").style.display = "block";
          document.getElementById("start-screen").style.display = "none";
        }
        
        updateSaveGames();
        
        document.getElementById("load-save").onclick = function () {
          var saveFile = document.getElementById("save-games").value;
          var regex = /save_[0-9]+/;
          if (!regex.test(saveFile)) {
            window.alert("No save file selected.");
            setTimeout(function(){
                document.getElementById("input-bar").focus();
            }, 1);
            return;
          }
          document.getElementById("game-screen").style.display = "block";
          document.getElementById("loading-screen").style.display = "none";
          document.getElementById("home-button").style.backgroundColor = "#d1d1d1";
          document.getElementById("home-button").style.cursor = "default";
          loadGame(saveFile);
        }

        document.getElementById("delete-save").onclick = function () {
          var saveFile = document.getElementById("save-games").value;
          var regex = /save_[0-9]+/;
          if (!regex.test(saveFile)) {
            window.alert("No save file selected.");
            setTimeout(function(){
                document.getElementById("input-bar").focus();
            }, 1);
            return;
          }
          deleteGame(saveFile);
          updateSaveGames();
        }
        
        document.getElementById("loading-back").onclick = function () {
          document.getElementById("loading-screen").style.display = "none";
          document.getElementById("start-screen").style.display = "block";
        }
        
        document.getElementById("about-button").onclick = function () { 
          document.getElementById("about-screen").style.display = "block";
          document.getElementById("start-screen").style.display = "none";
        }
        
        document.getElementById("about-back").onclick = function () {
          document.getElementById("about-screen").style.display = "none";
          document.getElementById("start-screen").style.display = "block";
        }
        
        // Sidebar functions
        document.getElementById("spellbook-button").onclick = function () {
          switchScreen("spellbook-screen");
          switchButton("spellbook-button");
        }

        document.getElementById("equipment-button").onclick = function () {
          switchScreen("equipment-screen");
          switchButton("equipment-button");
        }

        document.getElementById("inventory-button").onclick = function () { 
          switchScreen("inventory-screen");
          switchButton("inventory-button");
        }

        document.getElementById("settings-button").onclick = function () {
          switchScreen("settings-screen");
          switchButton("settings-button");
        }

        document.getElementById("map-button").onclick = function () {
          switchScreen("map-screen");
          switchButton("map-button");
          var prologueCompleted = getValue("prologueCompleted");
          if (!prologueCompleted) {
            document.getElementById("local-map-button").style.display = "none";
            document.getElementById("world-map-button").style.display = "none";
            document.getElementById("map-key-button").style.display = "none";
            document.getElementById("map").style.marginTop = "2.75vh";
          } else {
            document.getElementById("local-map-button").style.display = "inline-block";
            document.getElementById("world-map-button").style.display = "inline-block";
            document.getElementById("map-key-button").style.display = "inline-block";
            document.getElementById("map").style.marginTop = "0vh";
            switchMapButton("local-map-button");
          }
          updateMap();
        }

        document.getElementById("home-button").onclick = function () {
          switchScreen("main");
          switchButton("home-button");
        }

        // Setttings functions
        try {
          var gameSpeed = getValue("gameSpeed");
        } catch (error) {
          var gameSpeed = 1000;
        }
        
        if (gameSpeed == 0) {
          document.getElementById("radio-zero").checked = true;
        } else if (gameSpeed == 1000) {
          document.getElementById("radio-one").checked = true;
        } else if (gameSpeed == 2000) {
          document.getElementById("radio-two").checked = true;
        } else if (gameSpeed == 3000) {
          document.getElementById("radio-three").checked = true;
        } else if (gameSpeed == 4000) {
          document.getElementById("radio-four").checked = true;
        }

        document.getElementById("radio-zero").onclick = function () {
          changeValue("gameSpeed", 0);
        }

        document.getElementById("radio-one").onclick = function () {
          changeValue("gameSpeed", 1000);
        }

        document.getElementById("radio-two").onclick = function () {
          changeValue("gameSpeed", 2000);
        }

        document.getElementById("radio-three").onclick = function () {
          changeValue("gameSpeed", 3000);
        }

        document.getElementById("radio-four").onclick = function () {
          changeValue("gameSpeed", 4000);;
        }

        document.getElementById("save-button").onclick = function () {
          var saveFile = getValue("saveFile");
          saveGame(saveFile);
        }

        document.getElementById("quit-save").onclick = function () {
          var saveFile = getValue("saveFile");
          var result = saveGame(saveFile);
          if (result) {
            window.close();
          }
        }

        document.getElementById("quit-button").onclick = function () {
          window.close();
        }

        // Map functions
        document.getElementById("local-map-button").onclick = function () {
          switchMapButton("local-map-button");
          updateMap();
        }

        document.getElementById("world-map-button").onclick = function () {
          switchMapButton("world-map-button");
          updateWorldMap();
        }

        document.getElementById("map-key-button").onclick = function () {
          switchMapButton("map-key-button");
          updateMapKey();
        }
    `);
}

// This method is called when Electron
// has finished initializing
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
