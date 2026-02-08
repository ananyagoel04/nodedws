// config/subdomainMap.js
module.exports = {
  admissions: {
    view: "admissions",
    data: async () => ({}) // optional async data
  },

  // future examples:
  // results: {
  //   view: "results",
  //   data: async () => ({})
  // },

  // events: {
  //   redirect: "https://divinewisdom.edu.in/events"
  // }
};
