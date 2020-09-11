import setup from "./setup"



setup("$[name]").then(async ({app, db}) => {

  
  app.post("/echo", (req, res) => {
    res.send(req.body)
  })
})
