const mongoose = require("mongoose");

async function conectar() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Sucesso ao conectar")
    }catch(error){
        console.log("Erro ao conectar", error.message)
        process.exit(1)
    }

}

module.exports = conectar