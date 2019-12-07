import * as path from "path"
import { promises as fs } from "fs"
import doesFileExists from "./../../lib/fileExists/fileExists"


// export const read = init(() => {
  
// })


// export const write = init(() => {
  
// })

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
  else if (initPromIsInstanceOfPromise) bothProms = initProm

  if (initPromIsInstanceOfPromise) {
    //@ts-ignore
    instantFunc = async function (...params: Params): Ret {
      await bothProms
      return await call.call(this, ...params)
    }
  }
  else {
    instantFunc = call
  }

  Object.defineProperty(instantFunc, 'name', {value: call.name, writable: false});
  instantFunc[notYetInited] = bothProms


  if (attatchTo !== undefined) {
    let name = call.name

    if (name === "" || name === undefined) throw new Error("Cannot attatch anonymous function")

    let hasAttatchedToPrototype = attatchTo[name] !== undefined && !attatchTo.hasOwnProperty(name)

    attatchTo[name] = instantFunc

    if (initPromIsInstanceOfPromise) bothProms.then(() => {
      if (attatchTo[name] === instantFunc) {
        if (hasAttatchedToPrototype) delete attatchTo[name]
        else attatchTo[name] = call
      }
    })

    

    
    
  }

  else return instantFunc
}








export class Serialize {
  private fileName: string;
  constructor(private name: string = "Unamed") {
    if (takenNamesIndex[name] === undefined) {
      takenNamesIndex[name] = 1
      this.fileName = name
    }
    else {
      takenNamesIndex[name]++
      let potentualName = name + " (" + takenNamesIndex[name] + ")"
      
      while (takenNamesIndex[potentualName] !== undefined) {
        takenNamesIndex[name]++
        potentualName = name + " (" + takenNamesIndex[name] + ")"
      }

      takenNamesIndex[potentualName] = 1
      this.fileName = potentualName
    }
    
    //@ts-ignore
    let fileCreation = this.mkdir()
    
   
    initThenCall(fileCreation, this.read, this)
    initThenCall(fileCreation, this.write, this)
  }

}

export default Serialize

let takenNamesIndex: {[name: string]: number} = {}

const dir = path.join("./", "data_store")


let init = doesFileExists(dir).then(async (does) => {
  if (does) {
    let files = await fs.readdir(dir)
    files.forEach((file) => {
      takenNamesIndex[file] = 1
    })
  }
  else {
    await fs.mkdir(dir)
  }
})


declare module "./serialize" {
  interface Serialize {
    write(data: any): Promise<void>
    read(): Promise<GenericObject>
  }
}

const extention = ".json"
let serProto = Serialize.prototype
initThenCall(init, async function write(ob: any) {  
  await fs.writeFile(path.join(dir, this.fileName + extention), JSON.stringify(ob, undefined, "  "))
}, serProto)


initThenCall(init, async function read() {
  return JSON.parse((await fs.readFile(path.join(dir, this.fileName + extention))).toString())
}, serProto)

initThenCall(init, function mkdir() {
  return fs.writeFile(path.join(dir, this.fileName + extention), "{\n  \n}")
}, serProto)



