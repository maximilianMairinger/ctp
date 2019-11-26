import inq from "../inq";


export default async (ignore: string) => {
  
  inq({name: "asd"}, ignore) 
  
}


// export default [
//   // github name & main files name, default is foldername

//   // handle when folder is not found
//   {name: "name", message: "Project name"},
//   {name: "npmName", message: "Npm name"},
// ]