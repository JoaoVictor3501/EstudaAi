const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Usuario = require("../models/User")

const SENHA_MINIMA = 6

const HASH_FALSO = bcrypt.hashSync("senha-que-nao-existe", 10)

function dadosPublicos(usuario) {
    return {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        admin: usuario.role === "admin",
    }
}

// O crachá do usuário: leva o id e o role, e vale por 1 dia.
function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario._id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

async function createUsuario(req, res) {
    try {
        const { nome, email, senha } = req.body || {}

        // Só aceita texto: um objeto no lugar do e-mail (ex.: {"$ne": null}) não passa daqui
        if (typeof nome !== "string" || typeof email !== "string" || typeof senha !== "string"
            || !nome.trim() || !email.trim() || !senha) {
            return res.status(400).json({ message: "Preencha todos os campos!" })
        }

        const emailLimpo = email.trim().toLowerCase()

        if (senha.length < SENHA_MINIMA) {
            return res.status(400).json({ message: `A senha precisa ter no mínimo ${SENHA_MINIMA} caracteres` })
        }

        const jaExiste = await Usuario.findOne({ email: emailLimpo })
        if (jaExiste) {
            return res.status(409).json({ message: "Já existe uma conta com esse E-mail!" })
        }

        const hash = await bcrypt.hash(senha, 10)
        // O role não vem do corpo da requisição: nasce sempre "usuario" (default do schema)
        const novoUsuario = await Usuario.create({ nome, email: emailLimpo, senha: hash })

        // O frontend já deixa a pessoa logada depois do cadastro, então devolvemos o token
        return res.status(201).json({ token: gerarToken(novoUsuario), usuario: dadosPublicos(novoUsuario) })
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error)

        if (error.code === 11000) {
            return res.status(409).json({ message: "Já existe uma conta com esse E-mail!" })
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: "Erro no servidor! Tente novamente mais tarde!" })
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body || {}

        if (typeof email !== "string" || typeof senha !== "string" || !email.trim() || !senha) {
            return res.status(400).json({ message: "Informe e-mail e senha" })
        }

        // A senha tem select:false no model, então precisa ser pedida de propósito
        const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() }).select("+senha")

        const senhaCorreta = await bcrypt.compare(senha, usuario ? usuario.senha : HASH_FALSO)

        // A mesma mensagem nos dois casos: não revela se o e-mail existe
        if (!usuario || !senhaCorreta) {
            return res.status(401).json({ message: "E-mail ou senha incorretos." })
        }

        return res.json({ token: gerarToken(usuario), usuario: dadosPublicos(usuario) })
    } catch (error) {
        console.error("Erro ao fazer login:", error)
        return res.status(500).json({ message: "Erro no servidor! Tente novamente mais tarde!" })
    }
}

// Quem sou eu? O frontend usa para recuperar a sessão a partir do token guardado.
async function me(req, res) {
    try {
        const usuario = await Usuario.findById(req.user.id)
        if (!usuario) {
            return res.status(401).json({ message: "Usuário não encontrado" })
        }
        return res.json({ usuario: dadosPublicos(usuario) })
    } catch (error) {
        console.error("Erro ao buscar o usuário:", error)
        return res.status(500).json({ message: "Erro no servidor! Tente novamente mais tarde!" })
    }
}

module.exports = { createUsuario, login, me }
