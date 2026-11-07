const express = require("express")
const cors = require ("cors")
const conectar = require("./src/config/db")
require("./src/models/edital")
require("./src/models/user")

require("dotenv").config()
const app = express()
app.use(cors())
app.use(express.json())

conectar();
app.get("/",(req, res) =>{
    res.json({message:"Api EstudaAí no ar"})
})

app.listen(process.env.PORT,() =>{
    console.log("Conectado ")
})