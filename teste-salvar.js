// Teste temporário: salva um edital completo no MongoDB local.
// Rode na pasta do backend:  node teste-salvar.js
// Para apagar o que o teste criou:  node teste-salvar.js limpar
require("dotenv").config()
const mongoose = require("mongoose")
const Edital = require("./src/models/Edital")

const TITULO = "TESTE - apagar depois"

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("Conectado ao banco:", mongoose.connection.name)

  // Sempre começa apagando testes anteriores, para não acumular duplicados
  const apagados = await Edital.deleteMany({ titulo: TITULO })
  console.log("Testes antigos apagados:", apagados.deletedCount)

  if (process.argv[2] === "limpar") return

  const edital = await Edital.create({
    titulo: TITULO,
    orgao: "Prefeitura Municipal de Exemplo/PR",
    categoria: "Municipal",
    nivel: "Nível médio",
    ano: 2026,
    status: "Aberto",
    inscricaoInicio: "2026-10-21",
    inscricaoFim: "2026-11-10",
    dataProva: "2026-11-29",
    linkEdital: "/pdfs/exemplo.pdf",
    siteOficial: "https://www.banca.com.br",
    locais: ["Londrina/PR", "Cambé/PR"],
    etapas: ["Prova objetiva", "Avaliação de títulos"],
    areas: ["Matemática", "Português"],
    isencao: {
      inicio: "2026-10-21",
      fim: "2026-10-23",
      resultado: "2026-11-03",
      ondePedir: "Requerimento no site da banca",
      quemTem: [
        { titulo: "Doador de medula óssea", comoComprovar: "Documento de órgão oficial." },
        { titulo: "Doador regular de sangue", comoComprovar: "3 doações por ano." },
      ],
    },
    cronograma: [
      { data: "2026-10-14", evento: "Publicação do edital" },
      { data: "2026-10-21", fim: "2026-11-10", evento: "Inscrições" },
      { data: "2026-11-29", evento: "Prova objetiva" },
    ],
    // O Mongoose só confere se é um ObjectId válido, não se o usuário existe
    criadoPor: new mongoose.Types.ObjectId(),
  })

  console.log("Salvo! _id:", edital._id.toString())
  console.log(JSON.stringify(edital.toObject(), null, 2))
}

main()
  .catch((erro) => {
    console.error("Erro:", erro.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())