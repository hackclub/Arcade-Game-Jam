const { printLines } = require("../../../../general");
const { changeValue } = require("../../../../save_data");

async function imperialDreadnoughtExterior() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_port/imperial_dreadnought_exterior/1.txt"
  );
  changeValue(
    "imperialPort.imperialDreadnoughtExterior.cutscenePlayed",
    true,
    "locations"
  );
}

module.exports = { imperialDreadnoughtExterior };
