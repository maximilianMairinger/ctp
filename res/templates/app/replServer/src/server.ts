import liveReloadServer from "./liveReloadServer"
let app = liveReloadServer()


import * as crypto from "crypto"
import delay from "delay"







let exampleStudentCardIdEncrypted = crypto.createHash("sha256").update("s").digest("hex")
let exampleTeacherCardIdEncrypted = crypto.createHash("sha256").update("t").digest("hex")





app.get("/cardIndex", (req, res) => {

  let msg = {
    student: {
      // s: {
      //   fullName: "Maximilian Mairinger",
      //   username: "mmairinger"
      // }
    },
    teacher: {
      // t: {
      //   fullName: "Domenik Dolezal",
      //   username: "ddolezal"
      // }
    }
  }

  msg.student[exampleStudentCardIdEncrypted] = {
    fullName: "Maximilian Mairinger",
    username: "mmairinger"
  }

  msg.teacher[exampleTeacherCardIdEncrypted] = {
    fullName: "Domenik Dolezal",
    username: "ddolezal"
  }



  res.send(msg)
})

app.post("/verifySession", ({ body: param }, res) => {
  console.log("")
  console.log("verifySession: ")
  console.log(param)


  if (param.sessKey === "sessKeyDummy") {
    res.send({valid: true, classroom: "H927", subject: "MEDT", hours: 4})
  }
  else res.send({valid: false})
})

app.post("/studentSignOut", ({ body: param }, res) => {
  console.log("")
  console.log("studentSignOut: ")
  console.log(param)


  res.send({})
})

app.post("/startUnit", async ({ body: param }, res) => {
  await delay(200)
  console.log("")
  console.log("start Unit: ")
  console.log(param)


  setTimeout(() => {
    res.send({})
  }, 600)
})

app.post("/LDAPAuth", (req, res) => {
  setTimeout(() => {
    if (req.body.username === "s") {
      res.send({valid: true, data: {fullName: "Maximilian Mairinger", username: "mmairinger", employeeType: "student", registered: ["active", "active", "active", "toBeGone"], sign: "out"}})
    }
    else if (req.body.username === "t") {
      res.send({valid: true, data: {fullName: "Domenik Dolezal", username: "ddolezal", employeeType: "teacher", sessKey: "sessKeyDummy"}})
    }
    else res.send({valid: false})
  }, 300)
})

app.post("/cardAuth", async (req, res) => {
  await delay(400)
  console.log("")
  console.log("cardAuth")
  console.log(req.body)
  if (req.body.encryptedCardId === exampleTeacherCardIdEncrypted) {
    res.send({entry: true, data: {employeeType: "teacher", username: "ddolezal", fullName: "Domenik Dolezal", sessKey: "sessKeyDummy"}})
  }
  else if (req.body.encryptedCardId === exampleStudentCardIdEncrypted) {
    res.send({entry: true, data: {employeeType: "student", username: "mmairinger", fullName: "Maximilian Mairinger", registered: ["active", "active", "active", "active"], sign: "in"}})
  }
  else {
    res.send({entry: false})
  }
  
})

app.post("/destroySession", (req, res) => {
  setTimeout(() => {
    res.send({})
  }, 6000)
})

