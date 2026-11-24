const mongoose = require("mongoose")

const cronogramaSchema =  new mongoose.Schema({
    evento:{
        type: String,
        required: [true, "Informe o evento do cronograma"],
        trim:true
    },
    data:{
        type: Date,
        required:[true, "Informe a data do evento"],

    },
    fim:{
        type:Date,
        required: false,
    },
}, 
{_id:false}
)

const quemTemSchema = new mongoose.Schema(
    {
        titulo:{
            type: String,
            required:[true, "Informe quem tem direito à isenção"],
            trim:true,
        },
        comoComprovar:{
            type: String,
            trim:true,
        },
    },
    { _id: false }
)

const isencaoSchema = new mongoose.Schema(
    {
        inicio:{
            type: Date,
            required:[true, "Informe o início do pedido de isenção"],
        },
        fim:{
            type: Date,
            required:[true, "Informe o fim do pedido de isenção"],
        },
        resultado:{
            type: Date,
            required:false,
        },
        ondePedir:{
            type: String,
            required:[true, "Informe onde pedir a isenção"],
            trim:true,
        },
        quemTem:{
            type: [quemTemSchema],
            validate:{
                validator: (lista) => lista.length > 0,
                message: "Adicione pelo menos um caso de isenção",
            },
        },
    },
    { _id: false }
)

const cargoSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required:[true, "Informe o nome do cargo"],
            trim:true,
        },
        nivel:{
            type: String,
            trim:true,
        },
        vagas:{
            type: Number,
            required:[true, "Informe o número de vagas"],
            min:[0, "Vagas não pode ser negativo"],
        },
        salario:{
            type: Number,
            required:[true, "Informe o salário"],
            min:[0.01, "O salário precisa ser maior que zero"],
        },
        carga:{
            type: String,
            trim:true,
        },
        taxa:{
            type: Number,
            required:[true, "Informe a taxa de inscrição"],
            min:[0, "A taxa não pode ser negativa"],
        },
        prova:{
            type: String,
            trim:true,
        },
        observacao:{
            type: String,
            trim:true,
        },
    },
    { _id: false }
)
const materiaSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required:[true, "Informe o nome da matéria"],
            trim:true,
        },
        questoes:{
            type: Number,
            required:[true, "Informe o número de questões"],
            min:[1, "A matéria precisa ter pelo menos 1 questão"],
        },
        peso:{
            type: Number,
            required:[true, "Informe o peso da matéria"],
            min:[0.01, "O peso precisa ser maior que zero"],
        },
    },
    { _id: false }
)

const provaSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required:[true, "Dê um nome para a prova"],
            trim:true,
        },
        materias:{
            type: [materiaSchema],
            validate:{
                validator: (lista) => lista.length > 0,
                message: "Cada prova precisa de pelo menos uma matéria",
            },
        },
    },
    { _id: false }
)

const topicoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required:[true, "Informe o nome do tópico"],
        trim:true,
    },
    atualizado:{
        type: Boolean,
        default: true,
    },
    materiais:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Material",
        default: [],
    },
})

const disciplinaSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required:[true, "Informe o nome da disciplina"],
            trim:true,
        },
        topicos:{
            type: [topicoSchema],
        },
    },
    { _id: false }
)

function dataParaTexto(valor) {
    if (valor instanceof Date) return valor.toISOString().slice(0, 10)
    if (Array.isArray(valor)) return valor.map(dataParaTexto)
    if (valor && valor.constructor === Object) {
        const novo = {}
        for (const chave of Object.keys(valor)) novo[chave] = dataParaTexto(valor[chave])
        return novo
    }
    return valor
}

function formatarParaApi(doc, ret) {
    const { createdAt, updatedAt } = ret
    const saida = dataParaTexto(ret)
    if (createdAt) saida.createdAt = createdAt
    if (updatedAt) saida.updatedAt = updatedAt
    for (const campo of ["locais", "etapas", "areas", "cronograma"]) {
        if (Array.isArray(saida[campo]) && saida[campo].length === 0) delete saida[campo]
    }
    if (saida.provas && Object.keys(saida.provas).length === 0) delete saida.provas
    return saida
}


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
            trim:true,
            default:"Não informada",
        },
        categoria:{
            type:String,
            enum:["Federal", "Municipal", "Estadual"],
            default:"Federal"

        },
        // "Vários níveis" é para editais com cargos de escolaridades diferentes
        // (ex.: um concurso com vagas de nível médio e de nível superior)
        nivel:{
            type: String,
            enum:["Nível fundamental", "Nível médio", "Nível superior", "Vários níveis"],
            default:"Nível médio"
        },
        ano:{
            type: Number ,
            required: [true, "Informe o ano"],
            min:[2000, "Ano inválido"],
            max:[2100, "Ano inválido"],           
        },
        status:{
            type: String,
            enum:["Previsto","Aberto","Encerrado"],
            default:"Previsto",
        },
        inscricaoInicio:{
            type: Date,
            required:false,
        },
        inscricaoFim:{
            type: Date,
            required:false,
        },
        dataProva:{
            type: Date,

        },
        siteOficial:{
            type: String,
            trim: true,
        },
        linkEdital:{
            type:String,
            trim:true,
        },
        locais:{
            type:[String]
        },
        etapas:{
            type: [String]
        },
        areas:{
            type: [String]
        },
        locais:{
            type:[String]
        },
        etapas:{
            type: [String]
        },
        areas:{
            type: [String]
        },
        cronograma:{
            type:[cronogramaSchema]
        },
        cargos:{
            type: [cargoSchema]
        },
        provas:{
            type: Map,
            of: provaSchema,
            default: undefined,
        },
        disciplinas:{
            type: [disciplinaSchema]
        },
        isencao:{
            type: isencaoSchema
        },      
        criadoPor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required:true
        },

        
    },
    { timestamps: true, toJSON: { flattenMaps: true, transform: formatarParaApi}}
    
)

module.exports = mongoose.model("Edital", editalSchema)