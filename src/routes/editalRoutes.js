const express = require("express")
const { criarEdital, listarEditais } = require("../controllers/editalController")
const { autenticar, apenasAdmin } = require("../middlewares/authMiddleware")

const router = express.Router()

router.get("/", autenticar, listarEditais)
router.post("/", autenticar, apenasAdmin, criarEdital)

module.exports = router
