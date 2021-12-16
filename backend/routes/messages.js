const express = require("express")
const app = express()
const moment = require("moment")

let messages = require("../messages")

//get messages
app.get("/", (req, res) => {
  const test = messages.sort((a, b) => {
    return moment(b.date).diff(a.date)
  })
  res.json(test)
})

module.exports = app