import expressWs from "express-ws"
import chokidar from "chokidar"
import pth from "path"
import fs from "fs"
import xtring from "xtring"; xtring();

import { configureExpressApp, SendFileProxyFunc } from "./../../server/src/setup"



function formatPath (path: string) {
  let localPath = path.substr(7)
  localPath = localPath.split("\\").join("/")
  if (pth.extname(localPath) === "") localPath += "/"
  return localPath
}

const swInjection = fs.readFileSync(pth.join(__dirname, "./../res/live-reload-inject.js")).toString()




const publicPath = "./public"


export default function init(indexUrl: string = "/", wsUrl: string = "/") {
  if (!wsUrl.startsWith("/")) wsUrl = "/" + wsUrl

  let appWss: any

  let activateSetFileProxy: (f: SendFileProxyFunc) => void

  let ex = configureExpressApp(indexUrl, publicPath, new Promise((res) => {activateSetFileProxy = res}), (app) => {
    appWss = expressWs(app)
  })

  let app = ex as typeof ex & { ws: (route: string, fn: (ws: WebSocket & {on: WebSocket["addEventListener"], off: WebSocket["removeEventListener"]}, req: any) => void) => void }
  

  //@ts-ignore
  let clients: Set<WebSocket> = appWss.getWss(wsUrl).clients
  app.ws(wsUrl, () => {})
  
  chokidar.watch(publicPath, { ignoreInitial: true }).on("all", (event, path) => {
    path = formatPath(path)

    console.log("Change at: \"" + path + "\"; Restarting app.")

    clients.forEach((c) => {
      c.send("reload please")
    })
  })


  
  app.port.then((port) => {
  // inject
  const swInjUrl = `
<!-- Code Injected By the live server -->
<script>
(() => {
let url = "ws://127.0.0.1:${port}${wsUrl}";
${swInjection}
})()
</script>`

    activateSetFileProxy((file, ext) => {
      if (ext === ".html" || ext === ".htm") {
        let injectAt = file.lastIndexOf("</body>")
        return file.splice(injectAt, 0, swInjUrl)
      }
    })
  })

  
  return app
}
