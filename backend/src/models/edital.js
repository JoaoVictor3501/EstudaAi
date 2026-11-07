const mongoose = require("mongoose")

const editalSchema = new mongoose.Schema(
    {
        titulo:{
            type: String,
            required:[true, "Digite um título por favor!"],
            trim:true,
        },
        orgao:{
            type: String,
            required:[true, "Digite o nome do orgão responsável"],
            trim:true,
        },
        banca:{
            type: String,
            required: false,
        },
        ano:{
            type: Date,
            required: [true, "Informe a data por favor!"],           
        },
        status:{
            type: String,
            enum:["previsto","aberto","encerrado"],
            default:"aberto",
        },
        inscricaoinicio:{
            type: Date,
            required:false,
        },
        inscricaofim:{
            type: Date,
            required:false,
        },
        dataprova:{
            type: Number,
            required:[true, "Informe o ano da prova"],
            min:[2025,"Ano inválido"],
            max:[2050,"Ano inválido"],
        },
        linkoficial:{
            type:String,
            trim:true,
        },
        descricao:{
            type: String, 
            required:[true, "Descreva a prova"],
        },
        disciplinas:{
            type:[String],
            default:[]
            
        },
        criadopor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required:true
        },
        
    },
    { timestamps: true }
    
)

module.exports = mongoose.model("Edital", editalSchema)