import * as path from "path"
import { promises as fs } from "fs"
import doesFileExists from "./../../lib/fileExists/fileExists"


// export const read = init(() => {
  
// })


// export const write = init(() => {
  
// })







export default Serialize
export class Serialize {
  private fileName: string;
  private fileRdy: Promise<void>
  constructor(private name: string = "Unamed") {
    if (takenNamesIndex[name] === undefined) {
      takenNamesIndex[name] = 0
      this.fileName = name
    }
    else {
      takenNamesIndex[name]++
      let potentualName = " (" + takenNamesIndex[name] + ")"
      
      while (takenNamesIndex[potentualName] !== undefined) {
        takenNamesIndex[name]++
        potentualName = " (" + takenNamesIndex[name] + ")"
      }
      
      this.fileName = potentualName
    }
   
    this.fileRdy = fs.writeFile(path.join(dir, this.fileName), "{\n  \n}")
  }
}

let takenNamesIndex: {[name: string]: number} = {}

let dir = path.join(__dirname, "store")

let init = doesFileExists(dir).then(async (does) => {
  if (does) {
    let files = await fs.readdir(dir)
    files.ea((file) => {
      takenNamesIndex[file] = 0
    })
  }
})


declare module "./serialize" {
  interface Serialize {
    wirte(): Promise<void>
    read(): Promise<GenericObject>
  }
}

let serProto = Serialize.prototype
initThenCall(init, async function write() {
  
}, serProto)

initThenCall(init, async function read() {
  await fs.readFile(this.)
}, serProto)



const notYetInited = Symbol("Not yet Inited")

function initThenCall<T, Params extends Array<T>, Return>(init: (() => void | Promise<void>) | Promise<void> | undefined, call: (...params: Params) => Return, attatchTo?: GenericObject) {
  let initProm = typeof init === "function" ? init() : init

  type Ret = typeof initProm extends Promise<any> ? Return extends Promise<any> ? Return : Promise<Return> : typeof call

  let instantFunc: Ret
  let initPromIsInstanceOfPromise = initProm instanceof Promise

  let wrappedPromise = call[notYetInited]
  let hasWrappedPromise = wrappedPromise !== undefined

  let bothProms: Promise<any>;
  if (hasWrappedPromise) {
    if (initPromIsInstanceOfPromise) bothProms = Promise.all([initProm, wrappedPromise])
    else bothProms = wrappedPromise
  }
  //@ts-ignore
  else bothProms = initProm

  if (initPromIsInstanceOfPromise) {
    //@ts-ignore
    instantFunc = async (...params: Params): Ret => {
      await bothProms
      return await call(...params)
    }
  }
  else {
    instantFunc = call
  }

  instantFunc[notYetInited] = bothProms


  if (attatchTo !== undefined) {
    let name = call.name
    if (name === "" || name === undefined) throw new Error("Cannot attatch anonymous function")
    attatchTo[name] = instantFunc

    if (hasWrappedPromise) {
      wrappedPromise.then(() => {
        initThenCall(undefined, call, attatchTo)
      })
    }
    else if (initPromIsInstanceOfPromise) {
      //@ts-ignore
      initProm.then(() => {
        attatchTo[name] = call
      })
    }

    

    
    
  }

  else return instantFunc
}



// let abc: any = {}
// //
// initThenCall(delay(1000), function www() {
//   console.log("CALLED")
// }, abc)

// //@ts-ignore
// initThenCall(delay(500), abc.www, abc)

// //@ts-ignore
// abc.www()

// console.log("qwer")






// TEST



// import delay from "delay"

// const notYetInited = Symbol("Not yet Inited")

// function initThenCall<T, Params extends Array<T>, Return>(init: (() => void | Promise<void>) | Promise<void> | undefined, call: (...params: Params) => Return, attatchTo?: GenericObject) {
//   let initProm = typeof init === "function" ? init() : init

//   type Ret = typeof initProm extends Promise<any> ? Return extends Promise<any> ? Return : Promise<Return> : typeof call

//   let instantFunc: Ret
//   let initPromIsInstanceOfPromise = initProm instanceof Promise

//   let wrappedPromise = call[notYetInited]
//   let hasWrappedPromise = wrappedPromise !== undefined

//   let bothProms: Promise<any>;
//   if (hasWrappedPromise) {
//     if (initPromIsInstanceOfPromise) bothProms = Promise.all([initProm, wrappedPromise])
//     else bothProms = wrappedPromise
//   }
//   //@ts-ignore
//   else bothProms = initProm

//   if (initPromIsInstanceOfPromise) {
//     //@ts-ignore
//     instantFunc = async (...params: Params): Ret => {
//       debugger
//       console.log(hasWrappedPromise && initPromIsInstanceOfPromise);
      
//       await bothProms
//       return await call(...params)
//     }
//   }
//   else {
//     instantFunc = call
//   }

//   Object.defineProperty(instantFunc, 'name', {value: call.name, writable: false});
//   instantFunc[notYetInited] = bothProms


//   if (attatchTo !== undefined) {
//     let name = call.name
//     if (name === "" || name === undefined) throw new Error("Cannot attatch anonymous function")
//     attatchTo[name] = instantFunc

//     if (hasWrappedPromise && !arguments[3]) {
//       wrappedPromise.then(() => {
//         //@ts-ignore
//         initThenCall(undefined, call, attatchTo, true)
//       })
//     }
//     else if (initPromIsInstanceOfPromise) {
//       //@ts-ignore
//       initProm.then(() => {
//         attatchTo[name] = call
//       })
//     }

    

    
    
//   }

//   else return instantFunc
// }



// let abc: any = {}
// //
// initThenCall(delay(1000).then(() => {console.log("1000")}), function www() {
//   console.log("CALLED")
// }, abc)

// delay(500).then(() => {console.log("500")}).then(() => {
//   initThenCall(delay(1000).then(() => {console.log("1500")}), abc.www, abc)

//   //@ts-ignore
//   abc.www()
// })


// delay(3000).then(() => {
//   abc.www()
// })