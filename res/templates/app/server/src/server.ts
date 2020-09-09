import express from "express"
import * as bodyParser from "body-parser"
import xrray from "xrray"; xrray(Array);
import * as MongoDB from "mongodb";
const MongoClient = MongoDB.MongoClient
const args = require("yargs").argv

const port = args.port === undefined ? 6051 : args.port

const dbConfig = {
  url: "mongodb://localhost:27017",
  dbName: "$[name]"
};



(async () => {
  const app = express()
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  let client = await MongoClient.connect(dbConfig.url, { useUnifiedTopology: true });
  let db = client.db(dbConfig.dbName)
  

  app.post("/call", (req, res) => {
    console.log("call")
    res.send("\"Hello\"")
  })

  


  app.listen(port, () => {
    console.log("Listening on port " + port)
  })
})()

