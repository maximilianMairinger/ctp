import crypto from "crypto"
import * as tgm from "./../authTgm/authTgm"
import delay from "delay"
import moment from "moment"
import roschgar from "./../ajaon/attendanceStoreRemote"



import * as MongoDB from 'mongodb'
const MongoClient = MongoDB.MongoClient;


const url = 'mongodb://localhost:27017';
const dbName = 'labAuth';



const floorToLastSchoolHour = (() => {
  const hourBeginOffset = 5



  function timeStamp(time: string) {
    var m = moment()
    var splitTime = time.split(":")
    return m.hours(+splitTime[0]).minutes(+splitTime[1]).seconds(0).milliseconds(0);
  }

  const hourBegin = [
    "07:10",
    "08:00",
    "08:50",
  
    "09:50",
    "10:40",
    "11:30",
  
    "12:30",
    "13:20",
    "14:10",
  
    "15:10",
    "16:00",
  
    "17:00",
    "17:45",
  
    "18:45",
    "19:30",
    "20:15"
  ].map((s) => timeStamp(s))

  return function floorToLastSchoolHour(time: moment.Moment = moment()) {
    time = time.clone().minutes(time.minute() + hourBeginOffset)
    let end: any
    let i = hourBegin.findIndex((s) => s.isAfter(time))
    if (!i) {
      end = time
    }
    else {
      end = hourBegin[i-1]
    }


    return end
  }
})()






export default async function init(salt: string, outageReciliance: "strong" | "onDemand" | "weak", authKeyForRegistration?: string) {
  let client: MongoDB.MongoClient
  
  while (true) {
    try {
      client = await MongoClient.connect(url, { useUnifiedTopology: true });
      break;
    }
    catch(e) {
      console.error("Failed to connect to DB, retrying in 5sec")
      await delay(5000)
    }
  }
  

  const db = client.db(dbName);

  const sessionCollection = db.collection('session');
  const cardCollection = db.collection('card');
  const attendanceCollection = db.collection('attendance');


  sessionCollection.deleteMany({})

  const authKeyForRegistrationGiven = authKeyForRegistration !== undefined


  return {
    async createTeacherSession(teacherUsername: string) {
      let sha = crypto.createHash('sha512');
      sha.update(Math.random().toString() + salt);
      let key = sha.digest("base64")
    
      await sessionCollection.insertOne({teacherUsername: teacherUsername, sessKey: key})

    
      
      return key;
    },

    getCardData(hashedCardId: string) {
      return cardCollection.findOne({id: hashedCardId})
    },

    async startUnit(sessKey: string, metaData: any) {
      metaData.start = {raw: new Date(), parsed: floorToLastSchoolHour()}
      delay(metaData.hours * 60 * 60 * 1000).then(() => {
        this.destroySession(sessKey)
      })
      await sessionCollection.findOneAndUpdate({sessKey}, {sessKey, metaData})
    },

    async getUnitData(sessKey: string) {
      let e = await sessionCollection.findOne({sessKey})
      delete e.sessKey
      return e
    },

    async getUnitId(sessKey: string) {
      return (await this.getUnitData(sessKey))._id
    },


    async getLdapAuthData(username: string, password: string) {
      try {
        return await tgm.auth(username, password)
      }
      catch(e) {
        return null
      }
    },

    async saveCardData(personData: any, cardId: string) {
      let insert = {cardId, personData}
      await cardCollection.insertOne(insert)
      //@ts-ignore
      return insert._id
    },
    
    async destroySession(sessKey: string) {
      await sessionCollection.updateOne({sessKey}, { $unset: {sessKey} })
    },

    isStudent(data: any) {
      if (!data) return null
      return data.type === "student"
    },

    async registerStudent(studentId: any, studentData: any, unitData: any) {
      let proms = []
      if (outageReciliance === "strong") {
        proms.add(this.saveStudentRegistration(studentId, unitData))
      }

      if (authKeyForRegistrationGiven) {
        // ask roschgar how he wants the hours

        let duration = moment.duration(unitData.hours, "hours")
        
        let from = moment().toDate()
        let to = moment(unitData.start).add(duration).toDate()

        let req = roschgar.post("registerStudent", {sessKey: authKeyForRegistrationGiven, username: studentData.username, class: studentData.class, from, to })
        proms.add(req)

        let res: Function

        proms.add(Promise.race([req, new Promise((r) => {res = r})]))

        req.fail(async () => {
          if (outageReciliance === "onDemand") {
            await this.saveStudentRegistration(studentId, unitData)
            res()
          }
        })
      }
      else if (outageReciliance === "onDemand") {
        proms.add(this.saveStudentRegistration(studentId, unitData))
      }
      
    },

    async saveStudentRegistration(studentId: any, unitData: any) {
      let from = ""
      let to = ""
      // TODO


      await attendanceCollection.insertOne({unitId: unitData._id, studentId, from, to})
    }
  }

  
}
