import liveReloadServer from "./liveReloadServer"
let app = liveReloadServer()


import delay from "delay"



app.post("/call", (req, res) => {
  console.log("call")
  delay(300).then(() => res.send("\"Hello\""))
})

