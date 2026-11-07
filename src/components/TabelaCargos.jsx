import { formatarDinheiro } from "../data/editais";

// Tabela com todos os cargos do edital (usada em EditalDetalhe.jsx).
// Mostra nível, vagas, salário, carga horária e taxa de cada cargo.
//
// Props:
//   cargos -> lista de { nome, nivel, vagas, salario, carga, taxa, observacao (opcional) }

export default function TabelaCargos({ cargos }) {
  return (
    // A div deixa a tabela rolar para o lado no celular, em vez de quebrar a tela.
    // tabIndex={0} deixa quem usa teclado focar a área e rolar com as setas.
    <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Tabela de cargos">
      <table className="tabela">
        <thead>
          <tr>
            {/* scope="col" diz ao leitor de tela que é o título da coluna */}
            <th scope="col">Cargo</th>
            <th scope="col">Nível</th>
            <th scope="col">Vagas</th>
            <th scope="col">Salário</th>
            <th scope="col">Carga</th>
            <th scope="col">Taxa</th>
          </tr>
        </thead>
        <tbody>
          {cargos.map((c) => (
            <tr key={c.nome}>
              <th scope="row">{c.nome}</th>
              <td>{c.nivel}</td>
              {/* vagas = 0 quer dizer que o cargo não tem vaga imediata, só cadastro reserva
                  (lista de aprovados chamados se abrir vaga depois) */}
              <td>{c.vagas > 0 ? c.vagas : "Cadastro reserva"}</td>
              <td>
                {formatarDinheiro(c.salario)}
                {c.observacao && <span className="tabela-obs">{c.observacao}</span>}
              </td>
              <td>{c.carga}</td>
              <td>{formatarDinheiro(c.taxa)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
