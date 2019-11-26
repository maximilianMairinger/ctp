export default {
  
}




// {
//   type: "object",
//   properties: {
//     name: {type: "string"},
//     year: {type: "number"},
//     username: {type: "string"},
//     password: {type: "string"},
//     teachers: {
//       type: "object",
//       properties: {
//         0: {$ref: "/teacher"},
//         1: {$ref: "/teacher"},
//         2: {$ref: "/teacher"},
//       },
//       required: ["0", "1", "2"]
//     },
//   },
//   required: ["name", "year", "username"]
// };