const express = require("express")
const app = express()

let messages = require("../messages")

//get messages
app.get("/", (req, res) => {
  res.json(messages)
})

module.exports = app