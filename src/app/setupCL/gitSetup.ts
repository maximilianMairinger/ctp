import exec, { check } from "./shell"
import { Octokit } from "@octokit/rest"
import { info, log, warn } from "../lib/logger/logger"


export default async function(options: Options, publish: boolean) {
  check('git')
  exec("git init")
  exec("git add -A")
  exec('git commit -m "ctp init ' + options.__projectKind + '"')
  if (publish) {
    exec("git remote add origin https://github.com/" + options.githubUsername + "/" + options.name + ".git")
    exec("git push -u origin master")
  }
}