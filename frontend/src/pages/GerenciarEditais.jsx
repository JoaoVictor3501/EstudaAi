import { useState } from "react";
import { Link } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import { tipoChipStatus } from "../data/editais";
import Chip from "../components/Chip";

// Filtros da lista do administrador. "" = sem filtro.
// Fica fora do componente para ser reaproveitado no botão "Limpar filtros".
const filtrosVazios = { categoria: "", status: "", ano: "", banca: "" };

// Pega os valores diferentes de um campo, sem repetir, em ordem alfabética.
// Ex.: valoresUnicos(editais, "categoria") -> ["Federal", "Municipal"]
function valoresUnicos(editais, campo) {
  const valores = editais.map((e) => e[campo]).filter((v) => v !== undefined && v !== "");
  // new Set(...) remove os repetidos; localeCompare respeita os acentos do português.
  return [...new Set(valores)].sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

// RF02: tela do administrador para gerenciar os editais (adicionar, alterar e remover).
// Adicionar e alterar abrem o formulário (NovoEdital.jsx); remover é feito aqui mesmo.
// A busca e os filtros ajudam a achar um edital quando a lista fica grande.
export default function GerenciarEditais() {
  const { editais, removerEdital } = useEditais();
  const [mensagem, setMensagem] = useState(""); // aviso depois de remover
  const [termo, setTermo] = useState(""); // texto digitado na busca
  const [filtros, setFiltros] = useState(filtrosVazios);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // painel aberto ou fechado

  // Muda um filtro só, mantendo os outros como estavam.
  function alterarFiltro(nome, valor) {
    setFiltros({ ...filtros, [nome]: valor });
  }

  // Quantos filtros estão em uso (aparece no botão, ex.: "Filtros (2)").
  const filtrosAtivos = Object.values(filtros).filter((v) => v !== "").length;

  // Lista filtrada: o texto digitado precisa aparecer no título ou no órgão,
  // e o edital precisa bater com cada filtro escolhido (filtro vazio deixa passar tudo).
  const t = termo.trim().toLowerCase();
  const resultados = editais.filter(
    (e) =>
      `${e.titulo} ${e.orgao}`.toLowerCase().includes(t) &&
      (!filtros.categoria || e.categoria === filtros.categoria) &&
      (!filtros.status || e.status === filtros.status) &&
      (!filtros.ano || String(e.ano) === filtros.ano) &&
      (!filtros.banca || e.banca === filtros.banca)
  );

  // Opções de cada filtro, montadas a partir dos editais cadastrados.
  // Os anos são números: ficam do mais novo para o mais antigo.
  const opcoes = {
    categoria: valoresUnicos(editais, "categoria"),
    status: valoresUnicos(editais, "status"),
    ano: valoresUnicos(editais, "ano").sort((a, b) => b - a),
    banca: valoresUnicos(editais, "banca"),
  };

  // Nome que aparece em cima de cada lista de filtro.
  const rotulos = { categoria: "Categoria", status: "Status", ano: "Ano", banca: "Banca" };

  // Pede confirmação antes de remover (heurística: prevenção de erros),
  // porque a remoção não pode ser desfeita.
  function aoRemover(edital) {
    const confirmou = window.confirm(
      `Remover o edital "${edital.titulo}"?\nEssa ação não pode ser desfeita.`
    );
    if (!confirmou) return;
    removerEdital(edital.id);
    setMensagem(`Edital "${edital.titulo}" removido.`);
  }

  return (
    <main className="pagina">
      <div className="gerenciar-topo">
        <h1>Gerenciar editais</h1>
        <Link to="/admin/editais/novo" className="btn-acao">
          + Novo edital
        </Link>
      </div>

      {/* role="status" faz o leitor de tela anunciar a mensagem */}
      <p role="status" className={mensagem ? "aviso-sucesso" : "sr-only"}>
        {mensagem}
      </p>

      {/* Busca por texto e, ao lado, o botão que abre os filtros (mesmo visual da página Editais) */}
      <div className="busca-linha">
        <div className="campo campo-busca">
          <label htmlFor="busca-admin" className="sr-only">
            Buscar edital
          </label>
          <input
            id="busca-admin"
            type="search"
            placeholder="Buscar por título ou órgão"
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
          aria-controls="painel-filtros-admin"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          Filtros{filtrosAtivos > 0 && ` (${filtrosAtivos})`}
          <span aria-hidden="true">{mostrarFiltros ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Painel de filtros: uma lista (select) para cada campo de "rotulos" */}
      {mostrarFiltros && (
        <div id="painel-filtros-admin" className="painel-filtros card">
          <div className="filtros-grade">
            {Object.keys(rotulos).map((campo) => (
              <div className="campo" key={campo}>
                <label htmlFor={`f-admin-${campo}`}>{rotulos[campo]}</label>
                <select
                  id={`f-admin-${campo}`}
                  value={filtros[campo]}
                  onChange={(e) => alterarFiltro(campo, e.target.value)}
                >
                  <option value="">Todos</option>
                  {opcoes[campo].map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="filtros-acoes">
            <button type="button" className="btn-link" onClick={() => setFiltros(filtrosVazios)}>
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {/* role="status" faz o leitor de tela avisar quando o número de resultados muda */}
      <p className="texto-sec" role="status">
        {resultados.length} {resultados.length === 1 ? "edital" : "editais"} na lista
      </p>

      {editais.length === 0 ? (
        <div className="card vazio">
          <p>Nenhum edital cadastrado.</p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="card vazio">
          <p>Nenhum edital encontrado.</p>
          <p className="texto-sec">Tente outro termo ou mude os filtros.</p>
        </div>
      ) : (
        <div className="card">
          <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Lista de editais">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Edital</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Ano</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((e) => (
                  <tr key={e.id}>
                    <th scope="row">
                      <Link to={`/editais/${e.id}`}>{e.titulo}</Link>
                      <span className="tabela-obs">{e.orgao}</span>
                    </th>
                    <td>{e.categoria}</td>
                    <td>{e.ano}</td>
                    <td>
                      <Chip tipo={tipoChipStatus(e.status)}>{e.status}</Chip>
                    </td>
                    <td>
                      <div className="tabela-acoes">
                        {/* aria-label diz qual edital o botão altera (o texto "Editar" se repete) */}
                        <Link
                          to={`/admin/editais/${e.id}/editar`}
                          className="btn-sec"
                          aria-label={`Editar ${e.titulo}`}
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="btn-perigo"
                          aria-label={`Remover ${e.titulo}`}
                          onClick={() => aoRemover(e)}
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
