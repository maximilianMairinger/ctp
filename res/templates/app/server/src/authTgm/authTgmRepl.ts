import delay from "delay"

export async function auth(username: string, password: string): Promise<{username: string, fullName: string, class: string, type: string}> {
  await delay(1000)
  let teacher = username === "ddolezal"

  return {
    username,
    fullName: username + "full",
    class: "4ahit",
    type: teacher ? "teacher" : "student"
  }

  
}

export default login

