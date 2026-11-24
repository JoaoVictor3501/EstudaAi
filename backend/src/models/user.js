const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required:[true, "Nome é Obrigatório"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase:true,
            required:[true, "Email é obrigatório"],
            trim:true,
        },
        senha: {
            type: String,
            select: false,
            required:[true, "Senha é obrigatória"],
        },
        role:{
            type: String,
            enum: ["usuario", "admin"],
            default: "usuario"
        },
},
{timestamps:true}
)
module.exports = mongoose.model("Usuario", UsuarioSchema)