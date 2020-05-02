import fs from "fs"

export const index = {
  module: {
    // destination, will be injected in test runner
    name: "testName", 
    description: "desc", 
    keywords: ["keyword1", "keyword2"],
    dependencies: ["xrray", "animation-frame-delta"],
    author: "Maximilian Mairinger", 
    githubUsername: "maximilianMairinger",
  },
  app: {
    // destination, will be injected in test runner
    name: "testApp", 
    description: "This is an app description", 
    keywords: ["keyword123", "keyword456"],
    dependencies: ["tweenSvgPath"],
    author: "Maximilian Mairinger", 
    githubUsername: "maximilianMairinger",
    remote: "161.35.76.169",
    remoteUser: "root",
    remoteSSHKey: fs.readFileSync("/mnt/c/Users/Maximilian Mairinger/Desktop/droplet/digitalOceanMain"),
    
  }
}