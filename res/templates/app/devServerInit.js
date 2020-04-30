const nodemon = require("nodemon")
const detectPort = require("detect-port")
const args = require("yargs").argv;
const path = require("path")
const fs = require("fs")
const open = require("open")
const waitOn = require("wait-on")
const del = require("del")

// configureable
const serverEntryFileName = "server.js"
const appEntryFileName = "app/app.js"






let serverDir = "./server/dist";
let appDir = "./public/dist";

if (args.dev === "repl") {
  serverDir = "./replServer/dist"
}
else if (args.dev === "server") {
  serverDir = "./server/dist";
}


let serverEntryPath = path.join(serverDir, serverEntryFileName)
let appEntryPath = path.join(appDir, appEntryFileName);




(async (wantedPort = 6500) => {


  await Promise.all([
    del(appDir).then(() => console.log("Deleted \"" + appDir + "\".")),
    del(serverDir).then(() => console.log("Deleted \"" + serverDir + "\"."))
  ])

  


  await waitOn({
    resources: [serverEntryPath, appEntryPath]
  })


  console.log("")
  console.log("")
  console.log("Waiting for build to finish, before starting the server...")


  let gotPort;
  try {
    gotPort = await detectPort(wantedPort)
  }
  catch(e) {
    console.error(e)
  }
  
  let server = nodemon({
    watch: serverDir,
    script: serverEntryPath,
    args: ["--port", gotPort]
  })

  server.on("restart", (e) => {
    console.log("")
    console.log("-----------------")
    console.log("Server restarting")
    console.log("-----------------")
    console.log("")
  })

  
  
  
  
  console.log("")
  console.log("")

  if (gotPort !== wantedPort) console.log(`Port ${wantedPort} was occupied, falling back to: ${gotPort}.\n----------------------------------------------\n`)
  else console.log(`Serving on port ${gotPort}.\n---------------------\n`)

  
  
  console.log("Starting Browser")
  open(`http://127.0.0.1:${gotPort}`)
  
  
  
  
})(args.port)






