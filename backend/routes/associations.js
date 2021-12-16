const express = require("express")
const app = express()
const fs = require('fs')
const moment = require("moment")
const { body, validationResult } = require('express-validator')

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

//creation d'un message
app.post("/", 
  body('name')
    .exists().withMessage("Name is required")
    .isLength({ min: 4 }).withMessage("name is too short"),
  body('message')
    .exists().withMessage("Message is required"),
  body('association')
    .exists().withMessage("Association is required"),
  body().custom(value => {
    const allowedKeys = ["name", "message", "association"]
    
    // On recupere les clés du body dans un tableau de strings
    const bodyKeys = Object.keys(value)

    // Je cherche une clé dans mon body qui n'est pas dans le tableau allowedKeys
    const invalidKey = bodyKeys.find(key => !allowedKeys.includes(key))

    if (invalidKey) {
      return false
    } else {
      return true
    }
  }).withMessage("Invalid key"),
  body().custom(value => {
    const existingAssoc = associations.find(element => element.name === value.association)

    if (existingAssoc) {
      return true
    } else {
      return false
    }
  }).withMessage("Assoc does not exist."),
  (req, res) => {
    const { errors } = validationResult(req)
    // console.log(errors)

    if (errors.length > 0) {
      res.status(400).json({ errors })
    } else {
      const message = { 
        ...req.body,
        date : moment().format()
      }
    
      messages = [ ...messages, message ]

      fs.writeFile("messages.json", JSON.stringify(messages),  function(err) {
        if (err) {
          return console.error(err);
        }
      })

      res.json(messages)
    }
})

module.exports = app