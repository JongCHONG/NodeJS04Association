const express = require("express")
const fs = require('fs')
const app = express()

const associations = require("../associations")
let messages = require("../messages")

const checkExistingAssoc = (req, res, next) => {
  const { name } = req.params
  
  const association = associations.find(element => element.name === name)

  if(association) {
    next()
  } else {
    res.status(404).send("Association not found.")
  }
}

app.get("/", (req, res) => {
  res.json(associations)
})

app.get("/:name", checkExistingAssoc, (req, res) => {
  const { name } = req.params

  const association = associations.find(element => element.name === name)

  res.json(association)
})

app.post("/", (req, res) => {
  const message = req.body
 
  messages = [ ...messages, message ]

  fs.writeFile("messages.json", JSON.stringify(messages),  function(err) {
    if (err) {
       return console.error(err);
    }
  })

  res.json(messages)
})

module.exports = app