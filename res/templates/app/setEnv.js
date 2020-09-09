const yargs = require("yargs")
const agrs = yargs.argv
const preset = agrs.preset ? agrs.preset : "repl"
const fs = require("fs")
const editJson = require("edit-json-file")

fs.writeFileSync(".deploy", preset)
let packageJson = editJson("package.json")
packageJson.set("version", "1.0.0-" + preset)
packageJson.save()

if (fs.existsSync("pm2Reload.js")) {
  require("./pm2Reload.js")
}
