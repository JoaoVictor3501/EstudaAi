// Painel de filtros avançados da busca de editais (usado em Busca.jsx).
//
// As opções de cada lista NÃO são fixas no código: elas são montadas a partir dos
// editais cadastrados. Se um edital de um órgão novo for cadastrado, esse órgão
// aparece aqui na mesma hora, sem precisar mudar nada.
//
// Props:
//   editais    -> todos os editais (de onde saem as opções)
//   filtros    -> objeto com o valor atual de cada filtro (texto vazio = sem filtro)
//   alterar    -> função alterar(nomeDoFiltro, novoValor)
//   limpar     -> função que zera todos os filtros
//   id         -> id do painel (o botão "Filtros" aponta para ele com aria-controls)

// Pega os valores diferentes de um campo, sem repetir, em ordem alfabética.
// Ex.: valoresUnicos(editais, "banca") -> ["Banca Exemplo", "Banca Modelo"]
function valoresUnicos(editais, campo) {
  const valores = editais.map((e) => e[campo]).filter((v) => v !== undefined && v !== "");
  // new Set(...) remove os repetidos; o sort com localeCompare respeita acentos do português.
  return [...new Set(valores)].sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

// Campo de lista (select) reaproveitado para todos os filtros de opção.
function FiltroLista({ id, rotulo, valor, opcoes, aoMudar }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value)}>
        <option value="">Todos</option>
        {opcoes.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}

// Campo de data reaproveitado para os filtros de inscrição e prova.
function FiltroData({ id, rotulo, valor, aoMudar }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input id={id} type="date" value={valor} onChange={(e) => aoMudar(e.target.value)} />
    </div>
  );
}

export default function PainelFiltros({ editais, filtros, alterar, limpar, id }) {
  // Os anos são números; ordenamos do mais novo para o mais antigo.
  const anos = valoresUnicos(editais, "ano").sort((a, b) => b - a);

  return (
    <div id={id} className="painel-filtros card">
      {/* Filtros de opção: as listas vêm dos editais cadastrados */}
      <div className="filtros-grade">
        <FiltroLista
          id="f-nivel"
          rotulo="Nível de escolaridade"
          valor={filtros.nivel}
          opcoes={valoresUnicos(editais, "nivel")}
          aoMudar={(v) => alterar("nivel", v)}
        />
        <FiltroLista
          id="f-orgao"
          rotulo="Órgão"
          valor={filtros.orgao}
          opcoes={valoresUnicos(editais, "orgao")}
          aoMudar={(v) => alterar("orgao", v)}
        />
        <FiltroLista
          id="f-ano"
          rotulo="Ano"
          valor={filtros.ano}
          opcoes={anos}
          aoMudar={(v) => alterar("ano", v)}
        />
        <FiltroLista
          id="f-banca"
          rotulo="Banca"
          valor={filtros.banca}
          opcoes={valoresUnicos(editais, "banca")}
          aoMudar={(v) => alterar("banca", v)}
        />
        <FiltroLista
          id="f-status"
          rotulo="Status"
          valor={filtros.status}
          opcoes={valoresUnicos(editais, "status")}
          aoMudar={(v) => alterar("status", v)}
        />
        <FiltroLista
          id="f-criado"
          rotulo="Criado por"
          valor={filtros.criadoPor}
          opcoes={valoresUnicos(editais, "criadoPor")}
          aoMudar={(v) => alterar("criadoPor", v)}
        />
      </div>

      {/* Filtros de data. <fieldset> + <legend> agrupam campos relacionados
          e o leitor de tela anuncia o nome do grupo (ex.: "Inscrição"). */}
      <div className="filtros-grade">
        <fieldset className="filtro-grupo">
          <legend>Inscrição</legend>
          <FiltroData
            id="f-insc-inicio"
            rotulo="Começa a partir de"
            valor={filtros.inscricaoInicio}
            aoMudar={(v) => alterar("inscricaoInicio", v)}
          />
          <FiltroData
            id="f-insc-fim"
            rotulo="Termina até"
            valor={filtros.inscricaoFim}
            aoMudar={(v) => alterar("inscricaoFim", v)}
          />
        </fieldset>

        <fieldset className="filtro-grupo">
          <legend>Data da prova</legend>
          <FiltroData
            id="f-prova-de"
            rotulo="De"
            valor={filtros.provaDe}
            aoMudar={(v) => alterar("provaDe", v)}
          />
          <FiltroData
            id="f-prova-ate"
            rotulo="Até"
            valor={filtros.provaAte}
            aoMudar={(v) => alterar("provaAte", v)}
          />
        </fieldset>
      </div>

      <div className="filtros-acoes">
        <button type="button" className="btn-sec" onClick={limpar}>
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
