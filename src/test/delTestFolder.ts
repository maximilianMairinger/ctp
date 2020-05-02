import { destination } from "./destination"
import * as fs from "fs"
import * as path from "path"


fs.rmdirSync(path.resolve(destination), {recursive: true})
