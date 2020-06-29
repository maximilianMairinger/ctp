import express from "express"
import SSE from "express-sse"
import chokidar from "chokidar"
import yargs from "yargs"
const args = yargs.argv
import pth from "path"
import bodyParser from "body-parser"
import fs from "fs"





//@ts-ignore
if (String.prototype.splice === undefined) {
  /**
   * Splices text within a string.
   * @param {int} offset The position to insert the text at (before)
   * @param {string} text The text to insert
   * @param {int} [removeCount=0] An optional number of characters to overwrite
   * @returns {string} A modified string containing the spliced text.
   */
  //@ts-ignore
  String.prototype.splice = function(offset, text, removeCount=0) {
    let calculatedOffset = offset < 0 ? this.length + offset : offset;
    return this.substring(0, calculatedOffset) +
      text + this.substring(calculatedOffset + removeCount);
  };
}

declare global {
  interface String {
    splice(offset: number, text: string, removeCount?: number): string
  }
}




function formatPath (path: string) {
  let localPath = path.substr(7)
  localPath = localPath.split("\\").join("/")
  if (pth.extname(localPath) === "") localPath += "/"
  return localPath
}

const swInjection = fs.readFileSync(pth.join(__dirname, "./../res/live-reload-inject.js")).toString()



export default function init(indexUrl: string = "/", publicPath: string = "./public", streamUrl: string = "/updateStream") {
  //@ts-ignore
  let sse = new SSE()

  const swInjUrl = `<!-- Code Injected By the live server -->
<script>
(() => {
let url = "${streamUrl}";
${swInjection}}
)()
</script>`
  

  let app = express()



  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());






  app.get(streamUrl, sse.init)


  chokidar.watch(publicPath, { ignoreInitial: true }).on("all", (event, path) => {
    path = formatPath(path)

    console.log("Change at: \"" + path + "\"; Restaring app.")
    //@ts-ignore
    sse.send("reloadPlease");
  })


  let port = args.port
  
  if (port === undefined) {
    port = 5500
  }

  app.listen(port)

  if (!args.port) {
    console.log("Serving on port 5500")
  }


  // inject

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
          let injectAt = file.lastIndexOf("</body>") - 1
          res.send(file.splice(injectAt, swInjUrl))
        }
        else res.old_sendFile(pth.join(pth.resolve(""), path))
      }
      cb(req, res)
    })
  }

  

  app.get(indexUrl, (req, res) => {
    res.sendFile("./public/index.html")
  })


  app.use(express.static(pth.join(pth.resolve(""), publicPath)))
  


  
  return app

}

