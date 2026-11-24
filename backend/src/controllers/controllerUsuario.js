const bcrypt =  require("bcryptjs")
const Usuario = require("../models/User")

async function createUsuario(req, res) {
   try{
    const {nome, email, senha} = req.body 
    const emailLimpo = email.trim().toLowerCase()
    if (!nome || !email || !senha){
        return res.status(400).json({message: "Preencha todos os campos!"})
    }
    const jaExiste = await Usuario.findOne({emailLimpo})
    if (jaExiste){
        return res.status(409).json({message: "Já existe uma conta com esse E-mail!"})
    }
    
    if (senha.length < 10 ){
        return res.status(400).json({message: "A senha precisa ter no mínimo 10 caracteres"})
        
    }
    const hash = await bcrypt.hash(senha, 10)
    const criarUsuario = await Usuario.create({nome, emailLimpo, senha:hash})
    return res.status(201).json({id:criarUsuario._id, nome: criarUsuario.nome})
    
    } catch (error){
        return res.status(500).json({message: "Erro no servidor! tente novamente mais tarde!"})
    }
}


module.exports = {createUsuario}