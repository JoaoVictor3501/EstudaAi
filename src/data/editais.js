// Dados de exemplo.
// Datas ficam no formato "AAAA-MM-DD" (o mesmo do <input type="date">). Assim dá para
// comparar datas como texto: "2026-11-01" < "2026-12-05" funciona na ordem certa. Quando o back-end do João Victor estiver pronto,
// estes dados serão substituídos por chamadas à API (ex.: GET /api/editais).

export const editaisIniciais = [
  {
    id: 1,
    titulo: "Analista Administrativo",
    orgao: "Órgão Exemplo",
    banca: "Banca Exemplo",
    categoria: "Federal",
    nivel: "Nível superior",
    status: "Aberto",
    ano: 2026,
    inscricaoInicio: "2026-10-20",
    inscricaoFim: "2026-11-25",
    dataProva: "2027-01-17",
    criadoPor: "Administrador",
    disciplinas: [
      {
        nome: "Direito Constitucional",
        topicos: [
          {
            nome: "Princípios fundamentais",
            atualizado: true,
            materiais: [
              { titulo: "Resumo: princípios fundamentais", tipo: "Resumo" },
              { titulo: "Lista de questões comentadas", tipo: "Questões" },
            ],
          },
          {
            nome: "Direitos e garantias",
            atualizado: true,
            materiais: [{ titulo: "Mapa mental: direitos e garantias", tipo: "Resumo" }],
          },
          {
            nome: "Administração pública",
            atualizado: false,
            materiais: [{ titulo: "Apostila de administração pública", tipo: "Apostila" }],
          },
        ],
      },
      {
        nome: "Língua Portuguesa",
        topicos: [
          {
            nome: "Interpretação de textos",
            atualizado: true,
            materiais: [{ titulo: "Guia de interpretação de textos", tipo: "Apostila" }],
          },
          {
            nome: "Concordância verbal e nominal",
            atualizado: true,
            materiais: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    titulo: "Técnico Judiciário",
    orgao: "Tribunal Exemplo",
    banca: "Banca Exemplo",
    categoria: "Estadual",
    nivel: "Nível médio",
    status: "Aberto",
    ano: 2026,
    inscricaoInicio: "2026-11-01",
    inscricaoFim: "2026-12-05",
    dataProva: "2027-02-07",
    criadoPor: "Equipe EstudaAí",
    disciplinas: [
      {
        nome: "Noções de Informática",
        topicos: [
          {
            nome: "Segurança da informação",
            atualizado: true,
            materiais: [{ titulo: "Resumo: segurança da informação", tipo: "Resumo" }],
          },
          { nome: "Editores de texto", atualizado: false, materiais: [] },
        ],
      },
    ],
  },
  {
    id: 3,
    titulo: "Agente Administrativo",
    orgao: "Prefeitura Exemplo",
    banca: "Banca Exemplo",
    categoria: "Municipal",
    nivel: "Nível médio",
    status: "Encerrado",
    ano: 2025,
    inscricaoInicio: "2025-03-10",
    inscricaoFim: "2025-04-10",
    dataProva: "2025-06-01",
    criadoPor: "Equipe EstudaAí",
    disciplinas: [
      {
        nome: "Matemática",
        topicos: [{ nome: "Porcentagem", atualizado: true, materiais: [] }],
      },
    ],
  },
  {
    id: 4,
    titulo: "Auditor Fiscal",
    orgao: "Secretaria da Fazenda Exemplo",
    banca: "Banca Modelo",
    categoria: "Estadual",
    nivel: "Nível superior",
    status: "Previsto",
    ano: 2027,
    inscricaoInicio: "2027-02-01",
    inscricaoFim: "2027-03-01",
    dataProva: "2027-04-18",
    criadoPor: "Administrador",
    disciplinas: [
      {
        nome: "Contabilidade Geral",
        topicos: [{ nome: "Balanço patrimonial", atualizado: true, materiais: [] }],
      },
    ],
  },
];

export const categorias = ["Federal", "Estadual", "Municipal"];
export const niveis = ["Nível fundamental", "Nível médio", "Nível superior"];

// Situações possíveis de um edital (substituem o antigo "vigente: true/false").
export const statusEdital = ["Previsto", "Aberto", "Encerrado"];

// Cor do selo (Chip) de cada situação: aberto = verde, previsto = amarelo, encerrado = neutro.
export function tipoChipStatus(status) {
  if (status === "Aberto") return "ok";
  if (status === "Previsto") return "previsto";
  return "neutro";
}

// Transforma "2026-11-25" em "25/11/2026" para mostrar na tela. Sem data, mostra um traço.
// (Não usamos new Date() aqui para evitar erro de fuso horário, que pode voltar um dia.)
export function formatarData(data) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
