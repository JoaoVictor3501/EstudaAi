require("dotenv").config()
const express = require("express")
const cors = require ("cors")
const conectar = require("./src/config/db")
const usuarioRoutes = require("./src/routes/usuarioRoutes")
const editalRoutes = require("./src/routes/editalRoutes")
const app = express()


app.use(cors())
app.use(express.json())

conectar();
app.use("/api/auth", usuarioRoutes)
app.use("/api/editais", editalRoutes)

app.listen(process.env.PORT,() =>{
    console.log("Conectado ")
})