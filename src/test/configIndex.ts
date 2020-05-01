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
    dependencies: ["tweenSvg"],
    author: "Maximilian Mairinger", 
    githubUsername: "maximilianMairinger",
  }
}