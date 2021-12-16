const express = require("express")
const morgan = require ("morgan")
// const cors = require("cors")
const app = express()
const port = 5000

//relier back et front
// app.use(cors())

//import json
const associations = require("./routes/associations")
const messages = require("./routes/messages")

//accéder à req.body
app.use(express.json())

//middleware gobal des requetes
app.use(morgan('tiny'))

app.use("/associations", associations)
app.use("/messages", messages)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})