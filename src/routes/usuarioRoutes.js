const express = require("express")
const { createUsuario, login, me } = require("../controllers/authController")
const { autenticar } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/register", createUsuario)
router.post("/login", login)
router.get("/me", autenticar, me)

module.exports = router
