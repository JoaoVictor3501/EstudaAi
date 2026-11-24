const express = require("express")
const {
    criarEdital,
    listarEditais,
    atualizarEdital,
    removerEdital,
} = require("../controllers/editalController")
const { autenticar, apenasAdmin } = require("../middlewares/authMiddleware")

const router = express.Router()

// Qualquer usuário logado pode ver; só o admin cria, altera e remove
router.get("/", autenticar, listarEditais)
router.post("/", autenticar, apenasAdmin, criarEdital)
router.put("/:id", autenticar, apenasAdmin, atualizarEdital)
router.delete("/:id", autenticar, apenasAdmin, removerEdital)

module.exports = router
