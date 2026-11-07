import { useState } from "react";

// Gráfico de barras com o peso de cada matéria na prova (usado em EditalDetalhe.jsx).
// A pessoa escolhe o cargo e o gráfico mostra quanto cada matéria vale na nota.
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

export default function GraficoMaterias({ provas, cargos }) {
  // Começa mostrando o primeiro cargo da lista. Guardamos a posição (índice) do cargo.
  const [cargoEscolhido, setCargoEscolhido] = useState(0);

  const cargo = cargos[cargoEscolhido];
  const prova = provas[cargo.prova];

  // Pontos de cada matéria = número de questões x peso de cada questão.
  // Depois ordena da que vale mais para a que vale menos (b - a = ordem decrescente).
  const materias = prova.materias
    .map((m) => ({ ...m, pontos: m.questoes * m.peso }))
    .sort((a, b) => b.pontos - a.pontos);

  // Totais da prova, somando todas as matérias com reduce.
  const totalPontos = materias.reduce((soma, m) => soma + m.pontos, 0);
  const totalQuestoes = materias.reduce((soma, m) => soma + m.questoes, 0);

  return (
    <div>
      {/* Só mostra a escolha de cargo se o edital tiver mais de um cargo */}
      {cargos.length > 1 && (
        <div className="campo grafico-escolha">
          <label htmlFor="cargo-grafico">Ver a prova do cargo</label>
          <select
            id="cargo-grafico"
            value={cargoEscolhido}
            onChange={(e) => setCargoEscolhido(Number(e.target.value))}
          >
            {cargos.map((c, i) => (
              <option key={c.nome} value={i}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="texto-sec">
        {prova.nome}: {totalQuestoes} questões, {totalPontos} pontos no total.
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
    </div>
  );
}
