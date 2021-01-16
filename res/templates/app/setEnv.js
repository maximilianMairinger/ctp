const yargs = require("yargs")
const agrs = yargs.argv
const preset = agrs.preset ? agrs.preset : "repl"
const fs = require("fs")

fs.writeFileSync(".deploy", preset)

if (fs.existsSync("pm2Reload.js")) {
  require("./pm2Reload.js")
}
