const Edital = require("../models/Edital")

// Transforma os erros do Mongoose numa lista de frases simples para o frontend mostrar.
function listarErros(error) {
    return Object.values(error.errors).map((e) => e.message)
}

// Regras que o schema não consegue conferir sozinho, porque comparam um campo com outro.
// Recebe o documento já validado pelo schema (datas já são Date) e devolve a lista de problemas.
function regrasCruzadas(doc) {
    const erros = []

    if (doc.inscricaoInicio && doc.inscricaoFim && doc.inscricaoFim < doc.inscricaoInicio) {
        erros.push("O fim das inscrições não pode ser antes do início")
    }
    if (doc.inscricaoFim && doc.dataProva && doc.dataProva < doc.inscricaoFim) {
        erros.push("A data da prova não pode ser antes do fim das inscrições")
    }

    for (const item of doc.cronograma || []) {
        if (item.fim && item.fim < item.data) {
            erros.push(`Cronograma "${item.evento}": a data final não pode ser antes da inicial`)
        }
    }

    if (doc.isencao && doc.isencao.fim < doc.isencao.inicio) {
        erros.push("Isenção: a data final não pode ser antes da inicial")
    }

    // Todo cargo que aponta para uma prova precisa apontar para uma que exista em "provas"
    for (const cargo of doc.cargos || []) {
        if (cargo.prova && !(doc.provas && doc.provas.has(cargo.prova))) {
            erros.push(`O cargo "${cargo.nome}" usa a prova "${cargo.prova}", que não foi cadastrada`)
        }
    }

    const temProva = doc.provas && doc.provas.size > 0
    const temDisciplina = doc.disciplinas && doc.disciplinas.length > 0
    if (!temProva && !temDisciplina) {
        erros.push("Cadastre pelo menos uma prova ou uma disciplina")
    }

    return erros
}

// POST /api/editais  (só admin)
async function criarEdital(req, res) {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ message: "Envie os dados do edital" })
        }

        // Campos que nunca vêm do cliente: o dono é quem está logado, o resto o Mongo gera
        const { criadoPor, _id, id, createdAt, updatedAt, __v, ...dados } = req.body

        const edital = new Edital({ ...dados, criadoPor: req.user.id })

        await edital.validate()

        const erros = regrasCruzadas(edital)
        if (erros.length > 0) {
            return res.status(400).json({ message: "Há problemas no edital", erros })
        }

        await edital.save()

        // Respondemos com o documento (não com .lean()) para o schema formatar as datas "AAAA-MM-DD"
        return res.status(201).json(edital)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Há problemas no edital", erros: listarErros(error) })
        }
        console.error("Erro ao criar edital:", error)
        return res.status(500).json({ message: "Erro no servidor! Tente novamente mais tarde!" })
    }
}

// Escapa caracteres especiais para a busca por texto não virar uma expressão regular do usuário
function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// GET /api/editais?status=&categoria=&nivel=&q=&pagina=1&limite=20  (qualquer usuário logado)
async function listarEditais(req, res) {
    try {
        const { status, categoria, nivel, q } = req.query
        const filtro = {}

        // typeof string: ?status[$ne]=x chegaria como objeto e viraria um operador do Mongo
        if (typeof status === "string" && status) filtro.status = status
        if (typeof categoria === "string" && categoria) filtro.categoria = categoria
        if (typeof nivel === "string" && nivel) filtro.nivel = nivel
        if (typeof q === "string" && q.trim()) {
            const busca = new RegExp(escaparRegex(q.trim()), "i")
            filtro.$or = [{ titulo: busca }, { orgao: busca }, { banca: busca }]
        }

        const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1)
        const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 20, 1), 100)

        const [editais, total] = await Promise.all([
            Edital.find(filtro)
                .sort({ createdAt: -1 })
                .skip((pagina - 1) * limite)
                .limit(limite),
            Edital.countDocuments(filtro),
        ])

        return res.json({ total, pagina, limite, editais })
    } catch (error) {
        console.error("Erro ao listar editais:", error)
        return res.status(500).json({ message: "Erro no servidor! Tente novamente mais tarde!" })
    }
}

module.exports = { criarEdital, listarEditais }
