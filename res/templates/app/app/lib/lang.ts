import { DataBase } from "josm"
import ger from "./../res/lang/ger.json"

interface Lang {
  "$[name]": {
    "longName": "$[nameAsHumanized]"
  }
}



export const lang = new DataBase<Lang>(ger as Lang)
export default lang

