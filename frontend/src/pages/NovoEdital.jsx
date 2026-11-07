import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import { useAuth } from "../context/AuthContext";
import { categorias, niveis, statusEdital } from "../data/editais";
import Campo from "../components/Campo";

// RF02: cadastro de edital por disciplina e tópico (somente administrador)
export default function NovoEdital() {
  const { adicionarEdital } = useEditais();
  const { usuario } = useAuth(); // quem está logado vira o "Criado por" do edital
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [orgao, setOrgao] = useState("");
  const [banca, setBanca] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [nivel, setNivel] = useState(niveis[1]);
  const [ano, setAno] = useState(String(new Date().getFullYear())); // começa no ano atual
  const [status, setStatus] = useState("Previsto");
  // Datas no formato "AAAA-MM-DD" (é o que o <input type="date"> devolve). Vazio = não informada.
  const [inscricaoInicio, setInscricaoInicio] = useState("");
  const [inscricaoFim, setInscricaoFim] = useState("");
  const [dataProva, setDataProva] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [novaDisciplina, setNovaDisciplina] = useState("");
  const [novosTopicos, setNovosTopicos] = useState({}); // texto do campo de cada disciplina
  const [erros, setErros] = useState({});

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

  // Valida e salva o edital. Se der certo, abre a página do edital criado.
  function enviarFormulario(ev) {
    ev.preventDefault();
    const e = {};
    if (!titulo.trim()) e.titulo = "Informe o título do edital.";
    if (!orgao.trim()) e.orgao = "Informe o órgão.";
    if (!/^\d{4}$/.test(ano)) e.ano = "Informe o ano com 4 dígitos, como 2026.";
    // As datas são texto "AAAA-MM-DD", então dá para comparar com < e >.
    if (inscricaoInicio && inscricaoFim && inscricaoFim < inscricaoInicio)
      e.inscricaoFim = "O fim da inscrição não pode ser antes do início.";
    if (dataProva && inscricaoFim && dataProva < inscricaoFim)
      e.dataProva = "A prova não pode ser antes do fim das inscrições.";
    if (disciplinas.length === 0) e.disciplinas = "Adicione pelo menos uma disciplina.";
    setErros(e);
    if (Object.keys(e).length > 0) return;

    const id = adicionarEdital({
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
      criadoPor: usuario.nome,
      disciplinas,
    });
    navigate(`/editais/${id}`);
  }

  return (
    <main className="pagina">
      <h1>Novo edital</h1>

      <form onSubmit={enviarFormulario} noValidate>
        {/* Em telas largas o formulário fica em duas colunas (dados | disciplinas),
            para não sobrar espaço vazio. Em telas menores, uma coluna embaixo da outra. */}
        <div className="novo-edital-grade">
          {/* Coluna da esquerda: dados gerais do edital */}
          <section aria-labelledby="titulo-dados">
            <h2 id="titulo-dados">Dados do edital</h2>
            <div className="card">
              <Campo
                id="titulo"
                rotulo="Título do edital"
                placeholder="Ex.: Analista Administrativo"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  setErros((r) => ({ ...r, titulo: undefined }));
                }}
                erro={erros.titulo}
              />
              <Campo
                id="orgao"
                rotulo="Órgão"
                placeholder="Ex.: Órgão Exemplo"
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
              <div className="linha-dupla">
                <div className="campo">
                  <label htmlFor="categoria">Categoria</label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {categorias.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="nivel">Nível</label>
                  <select id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
                    {niveis.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="linha-dupla">
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
              <div className="linha-dupla">
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
              </div>
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
          </section>

          {/* Coluna da direita: disciplinas e tópicos */}
          <section aria-labelledby="titulo-disciplinas">
            <h2 id="titulo-disciplinas">Disciplinas e tópicos</h2>

            {disciplinas.map((d) => (
              <section key={d.nome} className="card bloco-disciplina">
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

            <div className="card">
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
          </section>
        </div>

        <div className="acoes">
          <button type="submit" className="btn-acao">
            Salvar edital
          </button>
          <button type="button" className="btn-sec" onClick={() => navigate("/editais")}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
