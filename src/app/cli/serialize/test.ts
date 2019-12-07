import Serialize from "./serialize";

(async () => {
  let ser = new Serialize("name")
  console.log("wwee");
  

  console.log("www", await ser.read())

  await ser.write({"whatever": 123})
  console.log(await ser.read());



  let ser2 = new Serialize("name")

  await ser2.write("something elese")
  await ser2.write("wow")

  await new Serialize("name").write("test")
  new Serialize("name")
  new Serialize("name")
  new Serialize("name")
  new Serialize("name")

  let sss = new Serialize("name (3)")

  console.log("done");
})()
