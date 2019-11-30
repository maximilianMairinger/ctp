import exec, { check } from "./shell"

export default function(options: Options) {
  check('git')
  exec("git init")
  exec("git add -A")
  exec('git commit -m "init"')
  exec("git remote add origin https://github.com/" + options.githubUsername + "/" + options.name + ".git")
  exec("git push -u origin master")
}