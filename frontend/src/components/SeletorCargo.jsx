// Caixa "Qual cargo te interessa?" no topo do dashboard (usada em EditalDetalhe.jsx).
// Quando a pessoa escolhe um cargo, o resto da página (resumo, tabela e matérias)
// passa a mostrar as informações daquele cargo. "Todos os cargos" volta para a visão geral.
//
// Este componente só mostra a lista. Quem guarda o cargo escolhido (useState) é a
// página EditalDetalhe, porque várias partes da página precisam saber qual é.
//
// Props:
//   cargos  -> lista de cargos do edital
//   valor   -> nome do cargo escolhido ("" = todos os cargos)
//   aoMudar -> função chamada com o nome do cargo novo

export default function SeletorCargo({ cargos, valor, aoMudar }) {
  return (
    <div className="card seletor-cargo">
      <div className="campo">
        <label htmlFor="cargo-escolhido">Qual cargo te interessa?</label>
        <select id="cargo-escolhido" value={valor} onChange={(e) => aoMudar(e.target.value)}>
          <option value="">Todos os cargos</option>
          {cargos.map((c) => (
            <option key={c.nome} value={c.nome}>
              {c.nome} ({c.nivel})
            </option>
          ))}
        </select>
      </div>
      <p className="texto-sec">
        {valor
          ? "Mostrando vagas, salário, taxa e prova só deste cargo."
          : "Escolha um cargo para ver vagas, salário, taxa e prova só dele."}
      </p>
    </div>
  );
}
