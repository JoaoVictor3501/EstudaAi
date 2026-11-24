import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import { useAuth } from "../context/AuthContext";
import { categorias, niveis, statusEdital } from "../data/editais";
import Campo from "../components/Campo";
import Secao from "../components/Secao";
import ListaCampos from "../components/ListaCampos";
import FormProvas from "../components/FormProvas";

// RF02: cadastro e alteração de edital (somente administrador).
// A mesma tela serve para as duas coisas:
//   /admin/editais/novo        -> formulário vazio, cria um edital
//   /admin/editais/:id/editar  -> formulário preenchido, altera o edital
//
// O formulário segue a mesma estrutura dos editais de data/editais.js
// (dados básicos, locais, links, isenção, etapas, cronograma, provas, cargos e disciplinas).
// Cada parte fica numa <Secao>, que o admin pode abrir e fechar para não se perder.

// Lista de opções do <select> com o valor atual incluído, caso ele não esteja na lista
// (ex.: os editais de exemplo usam o nível "Vários níveis").
function opcoesCom(lista, valorAtual) {
  return lista.includes(valorAtual) ? lista : [valorAtual, ...lista];
}

// Texto com um item por linha -> lista. Linhas vazias são ignoradas.
// Devolve undefined quando não sobra nada (assim o dashboard não mostra uma seção vazia).
function linhasParaLista(texto) {
  const lista = texto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
  return lista.length ? lista : undefined;
}

// Número digitado no formulário (vem como texto). Campo vazio vira NaN, que não passa na validação.
function numero(valor) {
  return valor === "" || valor === undefined ? NaN : Number(valor);
}

// Campos de cada lista (ver components/ListaCampos.jsx)
const camposCronograma = [
  { nome: "evento", rotulo: "Evento", placeholder: "Ex.: Prova objetiva" },
  { nome: "data", rotulo: "Data", tipo: "date" },
  { nome: "fim", rotulo: "Até (opcional, para períodos)", tipo: "date" },
];

const camposQuemTem = [
  {
    nome: "titulo",
    rotulo: "Quem tem direito",
    placeholder: "Ex.: Doador de medula óssea",
    largo: true,
  },
  { nome: "comoComprovar", rotulo: "Como comprovar", tipo: "textarea" },
];

// Campo com várias linhas, um item por linha (locais, etapas e áreas)
function CampoLinhas({ id, rotulo, dica, value, onChange }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={onChange}
        aria-describedby={`${id}-dica`}
      />
      <p id={`${id}-dica`} className="texto-sec campo-dica">
        {dica}
      </p>
    </div>
  );
}

export default function NovoEdital() {
  const { editais, adicionarEdital, atualizarEdital } = useEditais();
  const { usuario } = useAuth(); // quem está logado vira o "Criado por" do edital
  const navigate = useNavigate();
  const { id } = useParams(); // só existe na rota de editar
  const editando = id !== undefined;
  const original = editando ? editais.find((e) => e.id === Number(id)) : null;
  const ini = original || {}; // valores iniciais dos campos (vazio quando é edital novo)

  // Dados básicos
  const [titulo, setTitulo] = useState(ini.titulo || "");
  const [orgao, setOrgao] = useState(ini.orgao || "");
  const [banca, setBanca] = useState(ini.banca || "");
  const [categoria, setCategoria] = useState(ini.categoria || categorias[0]);
  const [nivel, setNivel] = useState(ini.nivel || niveis[1]);
  // Começa no ano atual quando é edital novo
  const [ano, setAno] = useState(String(ini.ano || new Date().getFullYear()));
  const [status, setStatus] = useState(ini.status || "Previsto");
  // Datas no formato "AAAA-MM-DD" (é o que o <input type="date"> devolve). Vazio = não informada.
  const [inscricaoInicio, setInscricaoInicio] = useState(ini.inscricaoInicio || "");
  const [inscricaoFim, setInscricaoFim] = useState(ini.inscricaoFim || "");
  const [dataProva, setDataProva] = useState(ini.dataProva || "");

  // Links e locais (listas de texto viram um texto com um item por linha)
  const [linkEdital, setLinkEdital] = useState(ini.linkEdital || "");
  const [siteOficial, setSiteOficial] = useState(ini.siteOficial || "");
  const [locais, setLocais] = useState((ini.locais || []).join("\n"));

  // Seleção: etapas e áreas de atuação
  const [etapas, setEtapas] = useState((ini.etapas || []).join("\n"));
  const [areas, setAreas] = useState((ini.areas || []).join("\n"));

  // Isenção da taxa (opcional: só é salva se a caixa estiver marcada)
  const [temIsencao, setTemIsencao] = useState(!!ini.isencao);
  const [isencao, setIsencao] = useState(
    ini.isencao || { inicio: "", fim: "", resultado: "", ondePedir: "", quemTem: [] }
  );

  const [cronograma, setCronograma] = useState(ini.cronograma || []);

  // Provas: no edital é um objeto { chave: { nome, materias } }; no formulário vira lista.
  // Object.entries transforma o objeto em lista de [chave, prova].
  const [provas, setProvas] = useState(
    Object.entries(ini.provas || {}).map(([chave, p]) => ({ chave, ...p }))
  );
  const [cargos, setCargos] = useState(ini.cargos || []);

  // Disciplinas e tópicos (RF02)
  const [disciplinas, setDisciplinas] = useState(ini.disciplinas || []);
  const [novaDisciplina, setNovaDisciplina] = useState("");
  const [novosTopicos, setNovosTopicos] = useState({}); // texto do campo de cada disciplina
  const [erros, setErros] = useState({});

  // Campos de cada cargo. O campo "prova" mostra as provas cadastradas acima.
  const camposCargo = [
    { nome: "nome", rotulo: "Cargo", placeholder: "Ex.: Motorista" },
    { nome: "nivel", rotulo: "Nível", placeholder: "Ex.: Médio" },
    { nome: "vagas", rotulo: "Vagas (0 = reserva)", tipo: "number" },
    { nome: "salario", rotulo: "Salário (R$)", tipo: "number" },
    { nome: "carga", rotulo: "Carga horária", placeholder: "Ex.: 40h" },
    { nome: "taxa", rotulo: "Taxa de inscrição (R$)", tipo: "number" },
    {
      nome: "prova",
      rotulo: "Prova que faz",
      tipo: "select",
      opcoes: provas.map((p, i) => ({ valor: p.chave, texto: p.nome || `Prova ${i + 1}` })),
    },
    { nome: "observacao", rotulo: "Observação (opcional)", placeholder: "Ex.: + adicional" },
  ];

  // Troca um campo da isenção.
  function mudarIsencao(campo, valor) {
    setIsencao({ ...isencao, [campo]: valor });
  }

  // Adiciona uma disciplina vazia à lista (ignora nome vazio ou repetido).
  function adicionarDisciplina() {
    const nome = novaDisciplina.trim();
    if (!nome) return;
    if (disciplinas.some((d) => d.nome.toLowerCase() === nome.toLowerCase())) return;
    setDisciplinas([...disciplinas, { nome, topicos: [] }]);
    setErros((r) => ({ ...r, disciplinas: undefined }));
    setNovaDisciplina("");
  }

  // Remove a disciplina e todos os tópicos dela.
  function removerDisciplina(nome) {
    setDisciplinas(disciplinas.filter((d) => d.nome !== nome));
  }

  // Adiciona um tópico dentro de uma disciplina.
  function adicionarTopico(nomeDisciplina) {
    const texto = (novosTopicos[nomeDisciplina] || "").trim();
    if (!texto) return;
    setDisciplinas(
      disciplinas.map((d) =>
        d.nome === nomeDisciplina
          ? { ...d, topicos: [...d.topicos, { nome: texto, atualizado: true, materiais: [] }] }
          : d
      )
    );
    setNovosTopicos({ ...novosTopicos, [nomeDisciplina]: "" });
  }

  // Remove um tópico de uma disciplina.
  function removerTopico(nomeDisciplina, nomeTopico) {
    setDisciplinas(
      disciplinas.map((d) =>
        d.nome === nomeDisciplina
          ? { ...d, topicos: d.topicos.filter((t) => t.nome !== nomeTopico) }
          : d
      )
    );
  }

  // Confere todos os campos e devolve um objeto com as mensagens de erro.
  // As datas são texto "AAAA-MM-DD", então dá para comparar com < e >.
  function validar() {
    const e = {};

    // Dados básicos
    if (!titulo.trim()) e.titulo = "Informe o título do edital.";
    if (!orgao.trim()) e.orgao = "Informe o órgão.";
    if (!/^\d{4}$/.test(ano)) e.ano = "Informe o ano com 4 dígitos, como 2026.";
    if (inscricaoInicio && inscricaoFim && inscricaoFim < inscricaoInicio)
      e.inscricaoFim = "O fim da inscrição não pode ser antes do início.";
    if (dataProva && inscricaoFim && dataProva < inscricaoFim)
      e.dataProva = "A prova não pode ser antes do fim das inscrições.";

    // Links
    if (siteOficial.trim() && !/^https?:\/\//.test(siteOficial.trim()))
      e.siteOficial = "O site deve começar com http:// ou https://.";

    // Isenção
    if (temIsencao) {
      if (!isencao.inicio || !isencao.fim)
        e.isencao = "Informe o início e o fim do pedido de isenção.";
      else if (isencao.fim < isencao.inicio)
        e.isencao = "O fim do pedido de isenção não pode ser antes do início.";
      else if (!isencao.ondePedir.trim()) e.isencao = "Informe onde a pessoa pede a isenção.";
      else if (isencao.quemTem.length === 0 || isencao.quemTem.some((q) => !q.titulo.trim()))
        e.isencao = "Adicione quem tem direito à isenção (com o nome preenchido).";
    }

    // Cronograma
    if (cronograma.some((c) => !c.evento.trim() || !c.data))
      e.cronograma = "Preencha o evento e a data de todos os itens do cronograma.";
    else if (cronograma.some((c) => c.fim && c.fim < c.data))
      e.cronograma = 'No cronograma, o "até" não pode ser antes da data.';

    // Provas
    if (provas.some((p) => !p.nome.trim())) e.provas = "Dê um nome para todas as provas.";
    else if (provas.some((p) => p.materias.length === 0))
      e.provas = "Cada prova precisa de pelo menos uma matéria.";
    else if (
      provas.some((p) =>
        p.materias.some((m) => !m.nome.trim() || !(numero(m.questoes) > 0) || !(numero(m.peso) > 0))
      )
    )
      e.provas = "Preencha nome, nº de questões e peso (maiores que zero) de todas as matérias.";

    // Cargos
    if (cargos.some((c) => !c.nome.trim())) e.cargos = "Preencha o nome de todos os cargos.";
    else if (
      cargos.some(
        (c) => !(numero(c.vagas) >= 0) || !(numero(c.salario) > 0) || !(numero(c.taxa) >= 0)
      )
    )
      e.cargos = "Preencha vagas, salário e taxa de todos os cargos com números válidos.";
    else if (provas.length > 0 && cargos.some((c) => !provas.some((p) => p.chave === c.prova)))
      e.cargos = "Escolha qual prova cada cargo faz.";

    // Conteúdo: o edital precisa ter o que estudar (disciplinas ou provas com matérias)
    if (disciplinas.length === 0 && provas.length === 0)
      e.disciplinas = "Adicione pelo menos uma disciplina ou uma prova com matérias.";

    return e;
  }

  // Valida e salva o edital. Se der certo, abre a página do edital.
  function enviarFormulario(ev) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    // Monta o edital no mesmo formato de data/editais.js.
    // Partes vazias ficam "undefined" para o dashboard não mostrar seção vazia.
    const dados = {
      titulo: titulo.trim(),
      orgao: orgao.trim(),
      banca: banca.trim() || "Não informada",
      categoria,
      nivel,
      status,
      ano: Number(ano),
      inscricaoInicio,
      inscricaoFim,
      dataProva,
      locais: linhasParaLista(locais),
      linkEdital: linkEdital.trim() || undefined,
      siteOficial: siteOficial.trim() || undefined,
      isencao: temIsencao
        ? {
            inicio: isencao.inicio,
            fim: isencao.fim,
            resultado: isencao.resultado,
            ondePedir: isencao.ondePedir.trim(),
            quemTem: isencao.quemTem.map((q) => ({
              titulo: q.titulo.trim(),
              comoComprovar: q.comoComprovar.trim(),
            })),
          }
        : undefined,
      etapas: linhasParaLista(etapas),
      areas: linhasParaLista(areas),
      // Cronograma em ordem de data (sort compara as datas como texto, o que funciona em AAAA-MM-DD)
      cronograma: cronograma.length
        ? [...cronograma]
            .sort((a, b) => (a.data < b.data ? -1 : 1))
            .map((c) => ({
              data: c.data,
              ...(c.fim ? { fim: c.fim } : {}), // "fim" só entra quando foi preenchido
              evento: c.evento.trim(),
            }))
        : undefined,
      // Lista de provas -> objeto { chave: { nome, materias } } (o inverso do que fizemos no useState)
      provas: provas.length
        ? Object.fromEntries(
            provas.map((p) => [
              p.chave,
              {
                nome: p.nome.trim(),
                materias: p.materias.map((m) => ({
                  nome: m.nome.trim(),
                  questoes: Number(m.questoes),
                  peso: Number(m.peso),
                })),
              },
            ])
          )
        : undefined,
      cargos: cargos.length
        ? cargos.map((c) => ({
            nome: c.nome.trim(),
            nivel: c.nivel.trim(),
            vagas: Number(c.vagas),
            salario: Number(c.salario),
            carga: c.carga.trim(),
            taxa: Number(c.taxa),
            prova: c.prova,
            ...(c.observacao && c.observacao.trim() ? { observacao: c.observacao.trim() } : {}),
          }))
        : undefined,
      disciplinas,
    };

    if (editando) {
      atualizarEdital(original.id, dados); // "Criado por" continua o mesmo
      navigate(`/editais/${original.id}`);
    } else {
      const novoId = adicionarEdital({ ...dados, criadoPor: usuario.nome });
      navigate(`/editais/${novoId}`);
    }
  }

  // Endereço de editar com um id que não existe (ex.: edital já removido)
  if (editando && !original) {
    return (
      <main className="pagina">
        <h1>Edital não encontrado</h1>
        <p className="texto-sec">Ele pode ter sido removido.</p>
        <Link to="/admin/editais" className="voltar">
          &larr; Voltar para gerenciar editais
        </Link>
      </main>
    );
  }

  return (
    <main className="pagina">
      <Link to="/admin/editais" className="voltar">
        &larr; Voltar para gerenciar editais
      </Link>
      <h1>{editando ? "Alterar edital" : "Novo edital"}</h1>

      <form onSubmit={enviarFormulario} noValidate>
        {/* Cada parte do edital fica num card que abre e fecha (igual ao dashboard).
            Os campos ficam em grade: "grade-2", "grade-3" e "grade-4" dizem quantos
            cabem por linha no computador; no celular fica um embaixo do outro. */}
        <Secao icone="simulados" titulo="Dados do edital">
          <Campo
            id="titulo"
            rotulo="Título do edital"
            placeholder="Ex.: Concurso Prefeitura de Exemplo 2026"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              setErros((r) => ({ ...r, titulo: undefined }));
            }}
            erro={erros.titulo}
          />
          <div className="grade-2">
            <Campo
              id="orgao"
              rotulo="Órgão"
              placeholder="Ex.: Prefeitura Municipal de Exemplo/PR"
              value={orgao}
              onChange={(e) => {
                setOrgao(e.target.value);
                setErros((r) => ({ ...r, orgao: undefined }));
              }}
              erro={erros.orgao}
            />
            <Campo
              id="banca"
              rotulo="Banca (opcional)"
              placeholder="Nome da banca"
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
            />
          </div>

          <div className="grade-4">
            <div className="campo">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {opcoesCom(categorias, categoria).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="nivel">Nível</label>
              <select id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
                {opcoesCom(niveis, nivel).map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <Campo
              id="ano"
              rotulo="Ano"
              type="number"
              min="2000"
              max="2100"
              value={ano}
              onChange={(e) => {
                setAno(e.target.value);
                setErros((r) => ({ ...r, ano: undefined }));
              }}
              erro={erros.ano}
            />
            <div className="campo">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusEdital.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Datas são opcionais: um edital "Previsto" pode ainda não ter datas definidas */}
          <div className="grade-3">
            <Campo
              id="inscricaoInicio"
              rotulo="Início da inscrição (opcional)"
              type="date"
              value={inscricaoInicio}
              onChange={(e) => setInscricaoInicio(e.target.value)}
            />
            <Campo
              id="inscricaoFim"
              rotulo="Fim da inscrição (opcional)"
              type="date"
              value={inscricaoFim}
              onChange={(e) => {
                setInscricaoFim(e.target.value);
                setErros((r) => ({ ...r, inscricaoFim: undefined }));
              }}
              erro={erros.inscricaoFim}
            />
            <Campo
              id="dataProva"
              rotulo="Data da prova (opcional)"
              type="date"
              value={dataProva}
              onChange={(e) => {
                setDataProva(e.target.value);
                setErros((r) => ({ ...r, dataProva: undefined }));
              }}
              erro={erros.dataProva}
            />
          </div>
        </Secao>

        <Secao icone="inicio" titulo="Links e locais de prova">
          <div className="grade-2">
            <Campo
              id="linkEdital"
              rotulo="Link do PDF do edital (opcional)"
              placeholder="Ex.: /pdfs/meu-edital.pdf ou https://..."
              value={linkEdital}
              onChange={(e) => setLinkEdital(e.target.value)}
            />
            <Campo
              id="siteOficial"
              rotulo="Site da banca (opcional)"
              placeholder="https://www.banca.com.br"
              value={siteOficial}
              onChange={(e) => {
                setSiteOficial(e.target.value);
                setErros((r) => ({ ...r, siteOficial: undefined }));
              }}
              erro={erros.siteOficial}
            />
          </div>
          <CampoLinhas
            id="locais"
            rotulo="Cidades onde a prova será aplicada (opcional)"
            dica="Uma cidade por linha. Ex.: Londrina/PR"
            value={locais}
            onChange={(e) => setLocais(e.target.value)}
          />
        </Secao>

        <Secao icone="favoritos" titulo="Isenção da taxa de inscrição">
          <label className="caixa-marcar">
            <input
              type="checkbox"
              checked={temIsencao}
              onChange={(e) => setTemIsencao(e.target.checked)}
            />
            Este edital permite pedir isenção da taxa
          </label>

          {temIsencao && (
            <>
              <div className="grade-3">
                <Campo
                  id="isencaoInicio"
                  rotulo="Início do pedido"
                  type="date"
                  value={isencao.inicio}
                  onChange={(e) => mudarIsencao("inicio", e.target.value)}
                />
                <Campo
                  id="isencaoFim"
                  rotulo="Fim do pedido"
                  type="date"
                  value={isencao.fim}
                  onChange={(e) => mudarIsencao("fim", e.target.value)}
                />
                <Campo
                  id="isencaoResultado"
                  rotulo="Resultado (opcional)"
                  type="date"
                  value={isencao.resultado}
                  onChange={(e) => mudarIsencao("resultado", e.target.value)}
                />
              </div>
              <Campo
                id="isencaoOnde"
                rotulo="Onde pedir"
                placeholder="Ex.: Requerimento no site da banca, com os documentos anexados"
                value={isencao.ondePedir}
                onChange={(e) => mudarIsencao("ondePedir", e.target.value)}
              />
              <p className="dash-subtitulo">Quem tem direito</p>
              <ListaCampos
                id="quemTem"
                itens={isencao.quemTem}
                aoMudar={(lista) => mudarIsencao("quemTem", lista)}
                campos={camposQuemTem}
                novoItem={{ titulo: "", comoComprovar: "" }}
                textoItem="caso de isenção"
              />
            </>
          )}
          {erros.isencao && (
            <p className="campo-erro" role="alert">
              {erros.isencao}
            </p>
          )}
        </Secao>

        <Secao icone="estudos" titulo="Provas e matérias">
          <p className="texto-sec">
            Cadastre cada prova (ex.: nível médio, nível superior) e as matérias com o número de
            questões e o peso. Depois, em &quot;Cargos&quot;, escolha qual prova cada cargo faz.
          </p>
          <FormProvas provas={provas} aoMudar={setProvas} erro={erros.provas} />
        </Secao>

        <Secao icone="foco" titulo="Disciplinas e tópicos">
          <p className="texto-sec">
            Conteúdo para estudar: cada disciplina tem seus tópicos, e cada tópico recebe depois os
            materiais de estudo (RF02 e RF12).
          </p>
          {disciplinas.length === 0 && <p className="texto-sec">Nenhuma disciplina adicionada.</p>}
          {disciplinas.map((d) => (
            <section key={d.nome} className="bloco-prova">
              <div className="disciplina-titulo">
                <strong>{d.nome}</strong>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => removerDisciplina(d.nome)}
                >
                  Remover disciplina
                </button>
              </div>

              {d.topicos.length > 0 && (
                <ul className="topicos-edicao">
                  {d.topicos.map((t) => (
                    <li key={t.nome}>
                      <span>{t.nome}</span>
                      <button
                        type="button"
                        className="btn-link"
                        aria-label={`Remover tópico ${t.nome}`}
                        onClick={() => removerTopico(d.nome, t.nome)}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="adicionar-linha">
                <label htmlFor={`topico-${d.nome}`} className="sr-only">
                  Novo tópico de {d.nome}
                </label>
                <input
                  id={`topico-${d.nome}`}
                  placeholder="Novo tópico"
                  value={novosTopicos[d.nome] || ""}
                  onChange={(e) => setNovosTopicos({ ...novosTopicos, [d.nome]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarTopico(d.nome);
                    }
                  }}
                />
                <button type="button" className="btn-sec" onClick={() => adicionarTopico(d.nome)}>
                  Adicionar tópico
                </button>
              </div>
            </section>
          ))}

          <div>
            <div className="adicionar-linha">
              <label htmlFor="disciplina" className="sr-only">
                Nova disciplina
              </label>
              <input
                id="disciplina"
                placeholder="Nome da disciplina"
                value={novaDisciplina}
                onChange={(e) => setNovaDisciplina(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    adicionarDisciplina();
                  }
                }}
              />
              <button type="button" className="btn-sec" onClick={adicionarDisciplina}>
                Adicionar disciplina
              </button>
            </div>
            {erros.disciplinas && (
              <p className="campo-erro" role="alert">
                {erros.disciplinas}
              </p>
            )}
          </div>
        </Secao>

        <Secao icone="disciplinas" titulo="Cargos, vagas e salários">
          <ListaCampos
            id="cargo"
            itens={cargos}
            aoMudar={setCargos}
            campos={camposCargo}
            novoItem={{
              nome: "",
              nivel: "",
              vagas: "",
              salario: "",
              carga: "",
              taxa: "",
              prova: "",
              observacao: "",
            }}
            textoItem="cargo"
            erro={erros.cargos}
          />
        </Secao>

        <Secao icone="calendario" titulo="Cronograma">
          <p className="texto-sec">
            Não precisa estar em ordem: ao salvar, as datas são ordenadas.
          </p>
          <ListaCampos
            id="cronograma"
            itens={cronograma}
            aoMudar={setCronograma}
            campos={camposCronograma}
            novoItem={{ evento: "", data: "", fim: "" }}
            textoItem="evento"
            erro={erros.cronograma}
          />
        </Secao>

        <Secao icone="progresso" titulo="Como funciona a seleção">
          <CampoLinhas
            id="etapas"
            rotulo="Etapas do concurso (opcional)"
            dica="Uma etapa por linha, na ordem. Ex.: Prova objetiva"
            value={etapas}
            onChange={(e) => setEtapas(e.target.value)}
          />
          <CampoLinhas
            id="areas"
            rotulo="Áreas de atuação (opcional)"
            dica="Uma área por linha. Usado quando o cargo tem várias áreas, como professor."
            value={areas}
            onChange={(e) => setAreas(e.target.value)}
          />
        </Secao>

        {/* Os cards podem estar fechados, então avisamos aqui perto do botão que há erro */}
        {Object.values(erros).some(Boolean) && (
          <p className="alerta-erro" role="alert">
            Há campos com erro. Confira as mensagens em vermelho acima.
          </p>
        )}

        <div className="acoes">
          <button type="submit" className="btn-acao">
            {editando ? "Salvar alterações" : "Salvar edital"}
          </button>
          <button type="button" className="btn-sec" onClick={() => navigate("/admin/editais")}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
