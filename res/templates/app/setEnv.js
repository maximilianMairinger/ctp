const yargs = require("yargs")
const agrs = yargs.argv
const preset = agrs.preset ? agrs.preset : "repl"
const fs = require("fs")
const editJson = require("edit-json-file")

fs.writeFileSync(".deploy", preset)
let file = editJson("package.json")
file.set("version", "1.0.0-" + preset)
file.save()
