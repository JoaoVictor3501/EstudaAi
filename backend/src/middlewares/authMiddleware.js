const jwt = require("jsonwebtoken")

// Primeiro porteiro: confere o crachá (token) e anota quem é a pessoa em req.user.
// O app manda o token no cabeçalho:  Authorization: Bearer <token>
function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization || ""
    const [tipo, token] = cabecalho.split(" ")

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ message: "Faça login para continuar" })
    }

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] })
        req.user = { id: dados.id, role: dados.role }
        next()
    } catch (error) {
        return res.status(401).json({ message: "Sessão inválida ou expirada. Faça login novamente" })
    }
}

// Segundo porteiro: só deixa passar quem tem o crachá de administrador.
// Sempre usado DEPOIS do autenticar, porque depende do req.user.
function apenasAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Acesso restrito a administradores" })
    }
    next()
}

module.exports = { autenticar, apenasAdmin }
