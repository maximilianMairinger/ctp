import generateSalt from "crypto-random-string"
import express from "express"
import * as bodyParser from "body-parser"
import xrray from "xrray"; xrray(Array);
import initLib from "./lib/lib"
import * as MongoDB from "mongodb";
const MongoClient = MongoDB.MongoClient

const args = require("yargs").argv
const port = args.port !== undefined ? args.port : console.log("Serving on port 443\n") as undefined || 443
const salt = args.salt !== undefined ? args.salt : generateSalt({length: 15})
const securityLevel: "paranoid" | "casual" = ["paranoid", "casual"].includes(args.securityLevel) ? args.securityLevel : console.warn("Unable to find \"securityLevel\" as valid command line option (only \"paranoid\" | \"casual\" allowed). Defaulting to \"casual\"\n") as undefined || "casual"
const outageReciliance: "strong" | "onDemand" | "weak" = ["strong", "onDemand", "weak"].includes(args.outageReciliance) ? args.outageReciliance : console.warn("Unable to find \"outageReciliance\" as valid command line option (only \"strong\" | \"onDemand\" | \"weak\" allowed). Defaulting to \"strong\"\n") as undefined || "strong"
const authKeyForRegistration = args.authKeyForRegistration !== undefined ? args.authKeyForRegistration : console.warn("Unable to find \"authKeyForRegistration\" as command line option. As outageResiliance is " + (outageReciliance === "strong" || outageReciliance === "onDemand" ? "enabled, attendance will be stored locally." : "disabled, attendance cannot be stored anywhere. Shuting down...") + "\n") as undefined || undefined


console.log("")
console.log("")

const url = 'mongodb://localhost:27017';
const dbName = 'labAuth';

(async () => {
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });

  let db = client.db(dbName)
  
  let ses = db.collection("session")

  ses.insert({ok: "", nested: {o: "ooo", b: "bbb"}})

  // ses.insertOne({d: moment().toDate()})
  
  // let r = await ses.findOne({})

  // let d = moment(r.d as Date)
  // let now = moment()
  // console.log(moment.duration(d.diff(now)).humanize())
  

  // ses.findOneAndUpdate({}, {$set: {w: "added"}})



})();

if (!(outageReciliance === "weak" && authKeyForRegistration === undefined) && false) {
  const app = express()
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.listen(port)
  
  app.use(express.static("./public"))
  
  
  
  initLib(salt, outageReciliance, authKeyForRegistration).then((lib) => {
  
  
  
    app.post("/startUnit", async (req, res) => {
      await lib.startUnit(req.body.sessKey, req.body)
  
      res.send(true)
    })
  
    app.post("/destroySession", async (req, res) => {
      await lib.destroySession(req.body.sessKey)
      res.send(true)
    })
  
    app.post("/LDAPAuth", async (req, res) => {
      let studentOrTeacherData = await lib.getLdapAuthData(req.body.username, req.body.password)
  
      let isStudent = lib.isStudent(studentOrTeacherData)
  
      if (isStudent) {
        let studentData = studentOrTeacherData
  
        let studentId = await lib.saveCardData(studentData, req.body.hashedCardId)
        let unitData = await lib.getUnitData(req.body.sessKey)
        let data = await lib.registerStudent(studentId, studentData, unitData)
        res.send({valid: true, data})
  
      }
      else if (isStudent === null) {
        res.send({valid: false})
      }
      else {
        let teacherDatas = studentOrTeacherData
  
  
      }
      
      
      
    })
  
    app.post("/studentSignOut", async (req, res) => {
      
    })
  
    app.post("/cardAuth", async (req, res) => {
      let cardData = await lib.getCardData(req.body.hashedCardId)
      if (cardData !== null) res.send({entry: true, data: cardData})
      else res.send({entry: false})
    })
  
    if (securityLevel === "casual") {
      app.post("/cardIndex", async (req, res) => {
  
      })
    }
  
  })
}












