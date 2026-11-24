require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Usuario = require("../models/User")

async function main() {
    const { ADMIN_NOME, ADMIN_EMAIL, ADMIN_SENHA, MONGO_URI } = process.env

    if (!ADMIN_NOME || !ADMIN_EMAIL || !ADMIN_SENHA) {
        throw new Error("Defina ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no .env")
    }
    if (ADMIN_SENHA.length < 6) {
        throw new Error("ADMIN_SENHA precisa ter pelo menos 6 caracteres")
    }

    await mongoose.connect(MONGO_URI)
    const email = ADMIN_EMAIL.trim().toLowerCase()

    const existente = await Usuario.findOne({ email })
    if (existente) {
        existente.role = "admin"
        await existente.save()
        console.log(`Conta já existia: ${email} agora é administrador.`)
        return
    }

    const hash = await bcrypt.hash(ADMIN_SENHA, 10)
    await Usuario.create({ nome: ADMIN_NOME, email, senha: hash, role: "admin" })
    console.log(`Administrador criado: ${email}`)
}

main()
    .catch((erro) => {
        console.error("Erro:", erro.message)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
