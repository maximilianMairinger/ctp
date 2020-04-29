import { promises as fs } from "fs"

fs.rmdir("./test_out", { recursive: true }).then(() => {
  console.log("Successfully deleted test folder.\n\n")
})
