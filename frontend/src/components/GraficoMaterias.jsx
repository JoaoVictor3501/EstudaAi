// Gráfico de barras com o peso de cada matéria na prova (usado em EditalDetalhe.jsx).
//
// Por que pontos e não só número de questões? Porque as questões podem ter pesos
// diferentes. Ex.: 10 questões de peso 6 valem 60 pontos, mais que 5 questões de peso 2.
// Assim fica claro onde a pessoa deve gastar mais tempo estudando.
//
// O gráfico é feito só com CSS: cada barra é uma div com a largura em porcentagem.
//
// Props:
//   provas -> objeto com as provas do edital, ex.: { medio: { nome, materias: [...] } }
//   cargos -> lista de cargos; cada cargo diz qual prova faz no campo "prova"
//   cargo  -> cargo escolhido no topo da página (null = todos os cargos)

// Desenha o gráfico de UMA prova.
function GraficoProva({ prova }) {
  // Pontos de cada matéria = número de questões x peso de cada questão.
  // Depois ordena da que vale mais para a que vale menos (b - a = ordem decrescente).
  const materias = prova.materias
    .map((m) => ({ ...m, pontos: m.questoes * m.peso }))
    .sort((a, b) => b.pontos - a.pontos);

  // Totais da prova, somando todas as matérias com reduce.
  const totalPontos = materias.reduce((soma, m) => soma + m.pontos, 0);
  const totalQuestoes = materias.reduce((soma, m) => soma + m.questoes, 0);

  return (
    <>
      <p className="texto-sec">
        {totalQuestoes} questões, {totalPontos} pontos no total.
      </p>

      <ul className="grafico">
        {materias.map((m, i) => {
          // Porcentagem da nota que essa matéria representa (arredondada).
          const porcento = Math.round((m.pontos / totalPontos) * 100);
          return (
            <li key={m.nome}>
              <div className="grafico-linha">
                <span className="grafico-nome">
                  {m.nome}
                  {/* Como a lista foi ordenada, a primeira matéria é a que mais vale */}
                  {i === 0 && <span className="etapa-selo selo-proxima">Mais importante</span>}
                </span>
                <strong>{porcento}% da nota</strong>
              </div>
              {/* A barra é só visual (aria-hidden): a porcentagem já está escrita acima */}
              <div className="grafico-fundo" aria-hidden="true">
                <div className="grafico-barra" style={{ width: `${porcento}%` }} />
              </div>
              <span className="texto-sec grafico-detalhe">
                {m.questoes} questões · {m.pontos} pontos
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function GraficoMaterias({ provas, cargos, cargo }) {
  // Com um cargo escolhido: mostra só a prova que esse cargo faz.
  if (cargo) {
    const prova = provas[cargo.prova];
    return (
      <div>
        <h3 className="dash-subtitulo">Prova de {cargo.nome}</h3>
        <GraficoProva prova={prova} />
      </div>
    );
  }

  // Sem cargo escolhido: mostra todas as provas, uma embaixo da outra, dizendo
  // quais cargos fazem cada uma. Object.entries transforma o objeto em lista de [chave, prova].
  return (
    <div className="grafico-provas">
      {Object.entries(provas).map(([chave, prova]) => {
        // Nomes dos cargos que fazem esta prova, separados por vírgula.
        const quemFaz = cargos
          .filter((c) => c.prova === chave)
          .map((c) => c.nome)
          .join(", ");
        return (
          <div key={chave}>
            <h3 className="dash-subtitulo">{prova.nome}</h3>
            <p className="texto-sec grafico-cargos">Cargos: {quemFaz}</p>
            <GraficoProva prova={prova} />
          </div>
        );
      })}
    </div>
  );
}
