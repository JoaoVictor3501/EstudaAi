import { useState } from "react";
import { Link } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import { tipoChipStatus, formatarData, textoTaxa } from "../data/editais";
import Chip from "../components/Chip";
import Icone from "../components/Icone";
import PainelFiltros from "../components/PainelFiltros";

// Todos os filtros começam vazios ("" = sem filtro). Fica fora do componente
// para ser reaproveitado no botão "Limpar filtros".
const filtrosVazios = {
  nivel: "",
  orgao: "",
  ano: "",
  banca: "",
  status: "",
  criadoPor: "",
  inscricaoInicio: "", // inscrição começa a partir desta data
  inscricaoFim: "", // inscrição termina até esta data
  provaDe: "", // prova a partir desta data
  provaAte: "", // prova até esta data
};

// Confere se um edital passa em TODOS os filtros avançados.
// Cada linha devolve "true" quando o filtro está vazio (não foi usado) ou quando o edital bate com ele.
// As datas são texto "AAAA-MM-DD", por isso podem ser comparadas direto com >= e <=.
// Se o filtro de data foi usado e o edital não tem aquela data, ele fica de fora.
function passaNosFiltros(edital, f) {
  return (
    (!f.nivel || edital.nivel === f.nivel) &&
    (!f.orgao || edital.orgao === f.orgao) &&
    (!f.ano || String(edital.ano) === String(f.ano)) &&
    (!f.banca || edital.banca === f.banca) &&
    (!f.status || edital.status === f.status) &&
    (!f.criadoPor || edital.criadoPor === f.criadoPor) &&
    (!f.inscricaoInicio ||
      (edital.inscricaoInicio && edital.inscricaoInicio >= f.inscricaoInicio)) &&
    (!f.inscricaoFim || (edital.inscricaoFim && edital.inscricaoFim <= f.inscricaoFim)) &&
    (!f.provaDe || (edital.dataProva && edital.dataProva >= f.provaDe)) &&
    (!f.provaAte || (edital.dataProva && edital.dataProva <= f.provaAte))
  );
}

// RF09: busca e consulta de editais (termo e filtros avançados)
export default function Busca() {
  const { editais } = useEditais();
  const [termo, setTermo] = useState("");
  const [filtros, setFiltros] = useState(filtrosVazios);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // painel aberto ou fechado

  // Muda um filtro só, mantendo os outros como estavam.
  function alterarFiltro(nome, valor) {
    setFiltros({ ...filtros, [nome]: valor });
  }

  // Quantos filtros avançados estão em uso (aparece no botão, ex.: "Filtros (2)").
  const filtrosAtivos = Object.values(filtros).filter((v) => v !== "").length;

  // Filtra a lista: o edital precisa conter o texto digitado no título,
  // órgão, banca ou no nome de algum cargo, e passar nos filtros avançados.
  const t = termo.trim().toLowerCase();
  const resultados = editais.filter((e) => {
    // Junta os nomes dos cargos num texto só (editais sem cargos ficam com texto vazio).
    const cargos = (e.cargos || []).map((c) => c.nome).join(" ");
    const texto = `${e.titulo} ${e.orgao} ${e.banca} ${cargos}`.toLowerCase();
    return texto.includes(t) && passaNosFiltros(e, filtros);
  });

  return (
    <main className="pagina">
      <h1 className="titulo-icone">
        <Icone nome="disciplinas" tamanho={40} />
        Editais
      </h1>

      {/* Busca por texto e, ao lado, o botão que abre os filtros */}
      <div className="busca-linha">
        <div className="campo campo-busca">
          <label htmlFor="busca" className="sr-only">
            Buscar edital
          </label>
          <input
            id="busca"
            type="search"
            placeholder="Buscar por cargo, órgão ou banca"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {/* aria-expanded diz ao leitor de tela se o painel está aberto;
            aria-controls liga o botão ao painel que ele abre. */}
        <button
          type="button"
          className={`btn-filtros ${mostrarFiltros ? "aberto" : ""}`}
          aria-expanded={mostrarFiltros}
          aria-controls="painel-filtros"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          Filtros{filtrosAtivos > 0 && ` (${filtrosAtivos})`}
          <span aria-hidden="true">{mostrarFiltros ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* O painel só é desenhado quando está aberto */}
      {mostrarFiltros && (
        <PainelFiltros
          id="painel-filtros"
          editais={editais}
          filtros={filtros}
          alterar={alterarFiltro}
          limpar={() => setFiltros(filtrosVazios)}
        />
      )}

      {/* role="status" faz o leitor de tela avisar quando o número de resultados muda */}
      <p className="texto-sec" role="status">
        {resultados.length} {resultados.length === 1 ? "edital encontrado" : "editais encontrados"}
      </p>

      {resultados.length === 0 ? (
        <div className="card vazio">
          <Icone nome="busca" tamanho={72} className="icone-vazio" />
          <p>Nenhum edital encontrado.</p>
          <p className="texto-sec">Tente outro termo ou mude os filtros.</p>
        </div>
      ) : (
        <ul className="lista">
          {resultados.map((e) => (
            <li key={e.id}>
              <Link to={`/editais/${e.id}`} className="card card-link edital-item">
                <Icone nome="simulados" tamanho={40} />
                <div className="edital-info">
                  <strong>{e.titulo}</strong>
                  <span className="texto-sec">
                    {e.orgao} · {e.nivel} · {e.ano}
                  </span>

                  {/* Resumo rápido antes de abrir o edital: inscrição, taxa e local da prova.
                      <dl> é a lista de "nome: valor" do HTML (dt = nome, dd = valor). */}
                  <dl className="card-resumo">
                    <div>
                      <dt>Inscrição</dt>
                      <dd>
                        {formatarData(e.inscricaoInicio)} a {formatarData(e.inscricaoFim)}
                      </dd>
                    </div>
                    <div>
                      <dt>Taxa</dt>
                      <dd>{textoTaxa(e)}</dd>
                    </div>
                    <div>
                      <dt>Local da prova</dt>
                      {/* join junta as cidades em um texto só, separadas por vírgula */}
                      <dd>{e.locais ? e.locais.join(", ") : "Não informado"}</dd>
                    </div>
                  </dl>
                </div>
                <Chip tipo={tipoChipStatus(e.status)}>{e.status}</Chip>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
