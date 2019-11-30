import exec, { check } from "./shell"
import * as Octokit from "@octokit/rest"
import req from "./../cli/inquery/inq"
import { info } from "../lib/logger/logger"


export default async function(options: Options) {
  check('git')
  exec("git init")
  exec("git add -A")
  exec('git commit -m "init"')
  exec("git remote add origin https://github.com/" + options.githubUsername + "/" + options.name + ".git")
  


  let octokit = new Octokit({
    auth: {
      username: options.githubUsername,
      password: options.githubPassword,
      async on2fa() {
        return req({name: "2fa", message: "Two-factor authentication Code"});
      }
    }
  });

  info("Creating Repo")

  await octokit.repos.createForAuthenticatedUser({
    name: options.name,
    description: options.description,
    private: !options.public,


  })


  exec("git push -u origin master")
}