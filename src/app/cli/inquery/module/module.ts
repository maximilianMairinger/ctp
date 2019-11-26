import delay from "delay"
import * as inq from "inquirer"


let cli: any[] = [
  {name: "test", message: "testmessage", finish: async (res) => {
    console.log(res);
    await delay(2000)
    cli.add(
      {name: "testadd", message: "testadd msg"}
    )
  }},
  {name: "test2", finish: {wait: "end", func: async (erg) => {
    console.log("test2: " + erg);
    await delay(5000)
    
  }}},
  {name: "test3", finish: {wait: "end", func: async (erg) => {
    console.log("test3: " + erg);
    await delay(1000)
    console.log("test3 done");
  }}}

]

export default cli 