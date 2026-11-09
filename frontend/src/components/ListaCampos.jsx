// Lista de itens que o administrador pode adicionar, alterar e remover
// (usada no formulário de edital para cargos, matérias, cronograma e isenção).
//
// Cada item vira um bloco com um campo para cada informação e um botão "Remover".
// Em vez de escrever um formulário para cada lista, descrevemos os campos em "campos"
// e este componente desenha tudo.
//
// Props:
//   id        -> prefixo para os ids dos campos (precisa ser único na página)
//   itens     -> lista de objetos (ex.: [{ nome: "Motorista", vagas: 5 }])
//   aoMudar   -> função chamada com a lista nova sempre que algo muda
//   campos    -> lista de { nome, rotulo, tipo, opcoes, placeholder }
//                tipo: "text" (padrão), "number", "date", "textarea" ou "select"
//                largo: true faz o campo ocupar a linha inteira
//                opcoes (só no select): lista de textos ou de { valor, texto }
//   novoItem  -> objeto com os valores iniciais de um item novo
//   textoItem -> nome de um item, usado nos botões (ex.: "cargo")
//   erro      -> mensagem de erro da lista (opcional)

// "cargo" -> "Cargo" (para o título de cada item)
function primeiraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Aceita opções como texto ("Médio") ou como { valor, texto }.
function normalizar(opcao) {
  return typeof opcao === "string" ? { valor: opcao, texto: opcao } : opcao;
}

export default function ListaCampos({ id, itens, aoMudar, campos, novoItem, textoItem, erro }) {
  // Troca o valor de um campo de um item (os outros itens continuam iguais).
  function mudarCampo(indice, nomeCampo, valor) {
    aoMudar(itens.map((item, i) => (i === indice ? { ...item, [nomeCampo]: valor } : item)));
  }

  function adicionar() {
    aoMudar([...itens, { ...novoItem }]);
  }

  function remover(indice) {
    aoMudar(itens.filter((_, i) => i !== indice));
  }

  // Desenha o campo certo para cada tipo.
  function desenharCampo(item, indice, campo) {
    const idCampo = `${id}-${indice}-${campo.nome}`;
    const valor = item[campo.nome] ?? "";
    const aoDigitar = (e) => mudarCampo(indice, campo.nome, e.target.value);

    let controle;
    if (campo.tipo === "textarea") {
      controle = <textarea id={idCampo} rows={2} value={valor} onChange={aoDigitar} />;
    } else if (campo.tipo === "select") {
      const opcoes = campo.opcoes.map(normalizar);
      controle = (
        <select id={idCampo} value={valor} onChange={aoDigitar}>
          <option value="">Escolha...</option>
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      );
    } else {
      controle = (
        <input
          id={idCampo}
          type={campo.tipo || "text"}
          step={campo.tipo === "number" ? "any" : undefined}
          min={campo.tipo === "number" ? "0" : undefined}
          placeholder={campo.placeholder}
          value={valor}
          onChange={aoDigitar}
        />
      );
    }

    return (
      <div
        key={campo.nome}
        className={`campo ${campo.tipo === "textarea" || campo.largo ? "campo-largo" : ""}`}
      >
        <label htmlFor={idCampo}>{campo.rotulo}</label>
        {controle}
      </div>
    );
  }

  return (
    <div>
      {itens.length === 0 && <p className="texto-sec">Nenhum {textoItem} adicionado.</p>}

      <ol className="lista-campos">
        {itens.map((item, indice) => (
          <li key={indice} className="lista-campos-item">
            {/* Título do item (ex.: "Cargo 1") com o botão de remover ao lado */}
            <div className="disciplina-titulo">
              <strong>
                {primeiraMaiuscula(textoItem)} {indice + 1}
              </strong>
              <button
                type="button"
                className="btn-link"
                aria-label={`Remover ${textoItem} ${indice + 1}`}
                onClick={() => remover(indice)}
              >
                Remover
              </button>
            </div>
            <div className="lista-campos-grade">
              {campos.map((campo) => desenharCampo(item, indice, campo))}
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="btn-sec" onClick={adicionar}>
        + Adicionar {textoItem}
      </button>

      {erro && (
        <p className="campo-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
