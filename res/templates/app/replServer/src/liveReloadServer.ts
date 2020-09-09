import express from "express"
import expressWs from "express-ws"
import chokidar from "chokidar"
import yargs from "yargs"
//@ts-ignore
const args = yargs.argv
import pth from "path"
import bodyParser from "body-parser"
import fs from "fs"
import xtring from "xtring"
import xrray from "xrray"
import detectPort from "detect-port"
xrray()
xtring()



const defaultPortStart = 3050



function formatPath (path: string) {
  let localPath = path.substr(7)
  localPath = localPath.split("\\").join("/")
  if (pth.extname(localPath) === "") localPath += "/"
  return localPath
}

const swInjection = fs.readFileSync(pth.join(__dirname, "./../res/live-reload-inject.js")).toString()




export default function init(indexUrl: string = "/", publicPath: string = "./public", wsUrl: string = "/") {

  if (!wsUrl.startsWith("/")) wsUrl = "/" + wsUrl

  



  

  let ex = express()
  let appWss = expressWs(ex)
  let app = ex as typeof ex & { ws: (route: string, fn: (ws: WebSocket & {on: WebSocket["addEventListener"], off: WebSocket["removeEventListener"]}, req: any) => void) => void }

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  

  let clients: Set<WebSocket> = new Set()

  chokidar.watch(publicPath, { ignoreInitial: true }).on("all", (event, path) => {
    path = formatPath(path)

    console.log("Change at: \"" + path + "\"; Restaring app.")


    clients.forEach((c) => {
      c.send("reload please")
    })
  })


  
  let port = args.port
  
  if (port === undefined) {
    (detectPort(defaultPortStart) as any).then((port) => {
      go(port)
      console.log("Serving on http://127.0.0.1:" + port)
    })
    
  }
  else go(port)
  

  function go(port: number) {

    // inject
  const swInjUrl = `
<!-- Code Injected By the live server -->
<script>
(() => {
let url = "ws://127.0.0.1:${port}${wsUrl}";
${swInjection}
})()
</script>`
  
  
  
  
    //@ts-ignore
    app.old_get = app.get
    //@ts-ignore
    app.get = (url: string, cb: (req: any, res: any) => void) => {
      //@ts-ignore
      app.old_get(url, (req, res) => {
        res.old_sendFile = res.sendFile
        res.sendFile = (path: string) => {
          let ext = pth.extname(path)
          if (ext === ".html" || ext === ".htm") {
            let file = fs.readFileSync(path).toString()
            let injectAt = file.lastIndexOf("</body>")
            res.send(file.splice(injectAt, 0, swInjUrl))
          }
          else res.old_sendFile(pth.join(pth.resolve(""), path))
        }
        cb(req, res)
      })
    }


    app.ws(wsUrl, (ws) => {
    })

    //@ts-ignore
    clients = appWss.getWss(wsUrl).clients
  
  
    
  
  

    
    app.use(express.static(pth.join(pth.resolve(""), publicPath)))

    app.get(indexUrl, (req, res) => {
      res.sendFile("./public/index.html")
    })
    


    app.listen(port)
  }



  

  


  

  
  



  
  return app
}
