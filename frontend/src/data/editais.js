// Dados dos editais mostrados no EstudaAí.
// Os 3 editais abaixo foram resumidos a partir dos PDFs oficiais (os PDFs ficam em public/pdfs).
//
// Datas ficam no formato "AAAA-MM-DD" (o mesmo do <input type="date">). Assim dá para
// comparar datas como texto: "2026-11-01" < "2026-12-05" funciona na ordem certa.
// Quando o back-end do João Victor estiver pronto, estes dados serão substituídos por
// chamadas à API (ex.: GET /api/editais).
//
// Campos de cada edital:
//   titulo, orgao, banca, categoria, nivel, status, ano  -> dados básicos (usados na busca e nos filtros)
//   inscricaoInicio, inscricaoFim, dataProva             -> datas principais
//   locais        -> cidades onde a prova será aplicada
//   linkEdital    -> PDF completo do edital (pasta public/pdfs)
//   siteOficial   -> site da banca, onde a pessoa se inscreve
//   etapas        -> fases do concurso (prova objetiva, títulos...)
//   cronograma    -> datas mais importantes, para a linha do tempo
//   provas        -> como cada prova é dividida em matérias (questoes = nº de questões, peso = pontos por questão)
//   cargos        -> cargos com vagas, salário, taxa e qual prova o cargo faz (campo "prova")
//   isencao       -> quem pode pedir para não pagar a taxa de inscrição:
//                    { inicio, fim, resultado, ondePedir, quemTem: [{ titulo, comoComprovar }] }
//   disciplinas   -> lista usada pelos editais cadastrados na tela "Novo edital"

export const editaisIniciais = [
  {
    id: 1,
    titulo: "Concurso Prefeitura de Florestópolis 2026",
    orgao: "Prefeitura Municipal de Florestópolis/PR",
    banca: "GAMA Consultoria",
    categoria: "Municipal",
    nivel: "Vários níveis",
    status: "Aberto",
    ano: 2026,
    inscricaoInicio: "2026-10-21",
    inscricaoFim: "2026-11-10",
    dataProva: "2026-11-29",
    criadoPor: "Equipe EstudaAí",
    locais: ["Florestópolis/PR"],
    linkEdital: "/pdfs/florestopolis-2026.pdf",
    siteOficial: "https://www.gamaconsult.com.br",
    // Isenção da taxa (item 4.10 do edital, Lei Municipal nº 1.478/2018)
    isencao: {
      inicio: "2026-10-21",
      fim: "2026-10-23",
      resultado: "2026-11-03",
      ondePedir: "Requerimento no site da GAMA, com os documentos anexados",
      quemTem: [
        {
          titulo: "Mesário ou ajudante da Justiça Eleitoral",
          comoComprovar:
            "Ter trabalhado em pelo menos 2 eleições na 65ª Zona Eleitoral (Porecatu/PR). Declaração ou diploma da Justiça Eleitoral.",
        },
        {
          titulo: "Doador de medula óssea",
          comoComprovar: "Documento de órgão oficial que comprove a doação.",
        },
        {
          titulo: "Doador regular de sangue",
          comoComprovar: "Pelo menos 3 doações por ano, comprovadas por órgão oficial.",
        },
      ],
    },
    etapas: [
      "Prova objetiva",
      "Avaliação de títulos (nível superior)",
      "Curso introdutório (Agente de Endemias)",
    ],
    cronograma: [
      { data: "2026-10-14", evento: "Publicação do edital" },
      { data: "2026-10-21", fim: "2026-11-10", evento: "Inscrições" },
      { data: "2026-10-21", fim: "2026-10-23", evento: "Pedido de isenção da taxa" },
      { data: "2026-11-11", evento: "Último dia para pagar a taxa" },
      { data: "2026-11-23", evento: "Divulgação dos locais de prova" },
      { data: "2026-11-29", evento: "Prova objetiva" },
      { data: "2026-11-30", evento: "Gabarito preliminar" },
      { data: "2026-12-11", evento: "Resultado da prova objetiva" },
      { data: "2027-01-08", evento: "Resultado final e homologação" },
    ],
    provas: {
      medio: {
        nome: "Nível médio e técnico",
        materias: [
          { nome: "Conhecimentos Específicos", questoes: 10, peso: 6 },
          { nome: "Língua Portuguesa", questoes: 5, peso: 2 },
          { nome: "Matemática e Raciocínio Lógico", questoes: 5, peso: 2 },
          { nome: "Conhecimentos de Informática", questoes: 5, peso: 2 },
          { nome: "Conhecimentos Gerais e Atualidades", questoes: 5, peso: 2 },
        ],
      },
      superior: {
        nome: "Nível superior",
        materias: [
          { nome: "Conhecimentos Específicos", questoes: 20, peso: 3.5 },
          { nome: "Língua Portuguesa", questoes: 5, peso: 2 },
          { nome: "Matemática e Raciocínio Lógico", questoes: 5, peso: 2 },
          { nome: "Conhecimentos Gerais e Atualidades", questoes: 5, peso: 2 },
        ],
      },
    },
    // vagas: 0 quer dizer "só cadastro reserva" (CR)
    cargos: [
      {
        nome: "Agente de Endemias",
        nivel: "Médio",
        vagas: 1,
        salario: 3242.0,
        carga: "40h",
        taxa: 100,
        prova: "medio",
      },
      {
        nome: "Assistente Administrativo",
        nivel: "Médio",
        vagas: 0,
        salario: 2918.31,
        carga: "40h",
        taxa: 100,
        prova: "medio",
      },
      {
        nome: "Motorista",
        nivel: "Médio",
        vagas: 5,
        salario: 2117.0,
        carga: "40h",
        taxa: 80,
        prova: "medio",
      },
      {
        nome: "Auxiliar de Enfermagem",
        nivel: "Técnico",
        vagas: 4,
        salario: 2887.5,
        carga: "40h",
        taxa: 100,
        prova: "medio",
      },
      {
        nome: "Técnico de Informática",
        nivel: "Técnico",
        vagas: 1,
        salario: 2577.82,
        carga: "40h",
        taxa: 80,
        prova: "medio",
      },
      {
        nome: "Assistente Social",
        nivel: "Superior",
        vagas: 1,
        salario: 3891.08,
        carga: "40h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Contador",
        nivel: "Superior",
        vagas: 0,
        salario: 15389.87,
        carga: "40h",
        taxa: 200,
        prova: "superior",
      },
      {
        nome: "Enfermeiro",
        nivel: "Superior",
        vagas: 1,
        salario: 5774.99,
        carga: "40h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Farmacêutico",
        nivel: "Superior",
        vagas: 1,
        salario: 2918.31,
        carga: "40h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Odontólogo",
        nivel: "Superior",
        vagas: 2,
        salario: 5836.64,
        carga: "40h",
        taxa: 150,
        prova: "superior",
      },
      {
        nome: "Professor (20 horas)",
        nivel: "Superior",
        vagas: 17,
        salario: 2565.32,
        carga: "20h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Professor (40 horas)",
        nivel: "Superior",
        vagas: 5,
        salario: 5130.63,
        carga: "40h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Professor de Artes",
        nivel: "Superior",
        vagas: 2,
        salario: 2565.32,
        carga: "20h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Professor de Educação Física",
        nivel: "Superior",
        vagas: 1,
        salario: 2565.32,
        carga: "20h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Professor de Inglês",
        nivel: "Superior",
        vagas: 4,
        salario: 2565.32,
        carga: "20h",
        taxa: 100,
        prova: "superior",
      },
      {
        nome: "Psicólogo",
        nivel: "Superior",
        vagas: 1,
        salario: 2918.31,
        carga: "40h",
        taxa: 100,
        prova: "superior",
      },
    ],
    disciplinas: [],
  },
  {
    id: 2,
    titulo: "Concurso Câmara de Pires do Rio 2026",
    orgao: "Câmara Municipal de Pires do Rio/GO",
    banca: "Instituto Verbena/UFG",
    categoria: "Municipal",
    nivel: "Vários níveis",
    status: "Aberto",
    ano: 2026,
    inscricaoInicio: "2026-10-19",
    inscricaoFim: "2026-11-18",
    dataProva: "2027-01-17",
    criadoPor: "Equipe EstudaAí",
    locais: ["Pires do Rio/GO"],
    linkEdital: "/pdfs/pires-do-rio-2026.pdf",
    siteOficial: "https://www.institutoverbena.ufg.br",
    // Isenção da taxa (item 2.2 do edital, Lei Federal nº 13.656/2018)
    isencao: {
      inicio: "2026-10-19",
      fim: "2026-10-21",
      resultado: "2026-11-04",
      ondePedir: "Portal do candidato no site do Instituto Verbena/UFG",
      quemTem: [
        {
          titulo: "Família no CadÚnico (baixa renda)",
          comoComprovar: "Renda por pessoa de até meio salário mínimo. Informar o NIS no pedido.",
        },
        {
          titulo: "Doador de medula óssea",
          comoComprovar:
            "Enviar documento da unidade coletora com a data da doação e a inscrição no REDOME. Só o cadastro no REDOME não vale.",
        },
      ],
    },
    etapas: [
      "Prova objetiva",
      "Prova discursiva (nível superior)",
      "Prova de títulos (nível superior)",
    ],
    cronograma: [
      { data: "2026-09-02", evento: "Publicação do edital" },
      { data: "2026-10-19", fim: "2026-11-18", evento: "Inscrições" },
      { data: "2026-10-19", fim: "2026-10-21", evento: "Pedido de isenção da taxa" },
      { data: "2026-12-07", evento: "Inscrições homologadas" },
      { data: "2027-01-12", evento: "Divulgação dos locais de prova" },
      { data: "2027-01-17", evento: "Provas objetiva e discursiva" },
      { data: "2027-01-18", evento: "Gabarito preliminar" },
      { data: "2027-02-12", evento: "Resultado da prova objetiva" },
      { data: "2027-05-11", evento: "Resultado final" },
    ],
    provas: {
      fundamental: {
        nome: "Ensino fundamental",
        materias: [
          { nome: "Língua Portuguesa", questoes: 10, peso: 4 },
          { nome: "Raciocínio Lógico-Matemático", questoes: 10, peso: 3 },
          { nome: "Realidade de Goiás e de Pires do Rio", questoes: 10, peso: 3 },
        ],
      },
      medio: {
        nome: "Ensino médio/técnico",
        materias: [
          { nome: "Conhecimentos Específicos", questoes: 25, peso: 3 },
          { nome: "Língua Portuguesa", questoes: 10, peso: 2 },
          { nome: "Raciocínio Lógico-Matemático", questoes: 3, peso: 1 },
          { nome: "Realidade de Goiás e de Pires do Rio", questoes: 2, peso: 1 },
        ],
      },
      superior: {
        nome: "Ensino superior",
        materias: [
          { nome: "Conhecimentos Específicos", questoes: 30, peso: 2 },
          { nome: "Língua Portuguesa", questoes: 10, peso: 3 },
          { nome: "Raciocínio Lógico-Matemático", questoes: 5, peso: 1 },
          { nome: "Realidade de Goiás e de Pires do Rio", questoes: 5, peso: 1 },
        ],
      },
    },
    cargos: [
      {
        nome: "Auxiliar de Serviços Gerais",
        nivel: "Fundamental",
        vagas: 2,
        salario: 2000.0,
        carga: "40h",
        taxa: 115,
        prova: "fundamental",
      },
      {
        nome: "Assistente Administrativo",
        nivel: "Médio",
        vagas: 6,
        salario: 3500.0,
        carga: "40h",
        taxa: 130,
        prova: "medio",
      },
      {
        nome: "Assistente de Controle Interno",
        nivel: "Médio/Técnico",
        vagas: 1,
        salario: 3500.0,
        carga: "40h",
        taxa: 130,
        prova: "medio",
      },
      {
        nome: "Analista Legislativo",
        nivel: "Superior",
        vagas: 1,
        salario: 6523.44,
        carga: "40h",
        taxa: 145,
        prova: "superior",
      },
      {
        nome: "Analista de Comunicação Social",
        nivel: "Superior",
        vagas: 1,
        salario: 6523.44,
        carga: "40h",
        taxa: 145,
        prova: "superior",
      },
      {
        nome: "Analista de Sistemas",
        nivel: "Superior",
        vagas: 1,
        salario: 3261.72,
        carga: "20h",
        taxa: 145,
        prova: "superior",
      },
    ],
    disciplinas: [],
  },
  {
    id: 3,
    titulo: "Concurso IFSP 2024 (Professor)",
    orgao: "Instituto Federal de São Paulo (IFSP)",
    banca: "Comissão do próprio IFSP",
    categoria: "Federal",
    nivel: "Nível superior",
    status: "Encerrado",
    ano: 2024,
    inscricaoInicio: "2024-07-18",
    inscricaoFim: "2024-09-02",
    dataProva: "2024-10-13",
    criadoPor: "Equipe EstudaAí",
    locais: ["São Paulo/SP (e cidades vizinhas, se precisar)"],
    linkEdital: "/pdfs/ifsp-2024.pdf",
    siteOficial: "https://concursopublico.ifsp.edu.br",
    // Isenção da taxa (item 10 do edital, Lei Federal nº 13.656/2018)
    isencao: {
      inicio: "2024-07-18",
      fim: "2024-07-25",
      resultado: "2024-08-05",
      ondePedir: "No próprio formulário de inscrição, no site do concurso",
      quemTem: [
        {
          titulo: "Família no CadÚnico (baixa renda)",
          comoComprovar:
            "Renda por pessoa de até meio salário mínimo. Informar o NIS no formulário.",
        },
        {
          titulo: "Doador de medula óssea",
          comoComprovar: "Anexar o comprovante de inscrição no REDOME.",
        },
      ],
    },
    etapas: ["Prova objetiva", "Prova de desempenho didático (aula)", "Prova de títulos"],
    cronograma: [
      { data: "2024-07-10", evento: "Publicação do edital" },
      { data: "2024-07-18", fim: "2024-09-02", evento: "Inscrições" },
      { data: "2024-07-18", fim: "2024-07-25", evento: "Pedido de isenção da taxa" },
      { data: "2024-09-04", evento: "Último dia para pagar a taxa" },
      { data: "2024-09-30", evento: "Divulgação dos locais de prova" },
      { data: "2024-10-13", evento: "Prova objetiva" },
      { data: "2024-11-05", evento: "Resultado da prova objetiva" },
      { data: "2024-11-23", fim: "2024-12-01", evento: "Prova de desempenho didático e títulos" },
      { data: "2025-01-08", evento: "Resultado final" },
    ],
    provas: {
      professor: {
        nome: "Professor EBTT",
        materias: [
          { nome: "Conhecimentos da área de atuação", questoes: 25, peso: 2.5 },
          { nome: "Legislação e conhecimentos pedagógicos", questoes: 15, peso: 2.5 },
        ],
      },
    },
    // Um cargo só (professor), dividido em áreas. O salário é o vencimento básico;
    // com mestrado ou doutorado a pessoa ganha um adicional (ver "observacao").
    cargos: [
      {
        nome: "Professor EBTT (17 áreas)",
        nivel: "Superior",
        vagas: 41,
        salario: 4875.18,
        carga: "40h (DE)",
        taxa: 190,
        prova: "professor",
        observacao: "Até R$ 10.481,64 com doutorado",
      },
    ],
    // Áreas de atuação do cargo de professor (cada área tem suas vagas nos campi do IFSP).
    areas: [
      "Arquitetura",
      "Artes",
      "Biotecnologia",
      "Construção Civil",
      "Controle e Automação",
      "Elétrica",
      "Eletrônica",
      "Engenharia de Produção",
      "Gastronomia",
      "Informática",
      "Mecânica",
      "Português/Inglês",
      "Português/Libras",
      "Manutenção de Aeronaves",
      "Química",
      "Química Industrial",
      "Turismo e Hospitalidade",
    ],
    disciplinas: [],
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

// Transforma um número em dinheiro brasileiro. Ex.: 2918.31 -> "R$ 2.918,31"
export function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Data de hoje no mesmo formato dos dados ("AAAA-MM-DD"), para comparar com as datas do edital.
// padStart(2, "0") coloca o zero na frente: 7 vira "07".
export function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Quantos dias faltam de hoje até a data (negativo = a data já passou).
// new Date(ano, mes - 1, dia) cria a data no horário local, sem problema de fuso.
export function diasAte(data) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const alvo = new Date(ano, mes - 1, dia);
  const [a, m, d] = hoje().split("-").map(Number);
  const agora = new Date(a, m - 1, d);
  const umDia = 1000 * 60 * 60 * 24; // um dia em milissegundos
  return Math.round((alvo - agora) / umDia);
}

// Taxa de inscrição em texto. Se os cargos têm taxas diferentes, mostra a menor e a maior.
// Ex.: "R$ 80,00 a R$ 200,00" ou "R$ 190,00".
export function textoTaxa(edital) {
  if (!edital.cargos || edital.cargos.length === 0) return "Não informada";
  const taxas = edital.cargos.map((c) => c.taxa);
  const menor = Math.min(...taxas);
  const maior = Math.max(...taxas);
  if (menor === maior) return formatarDinheiro(menor);
  return `${formatarDinheiro(menor)} a ${formatarDinheiro(maior)}`;
}

// Soma as vagas de todos os cargos do edital.
export function totalVagas(edital) {
  if (!edital.cargos) return 0;
  return edital.cargos.reduce((soma, c) => soma + c.vagas, 0);
}
