import Chip from "./Chip";
import { formatarData, hoje } from "../data/editais";

// Quadro de isenção da taxa de inscrição (usado em EditalDetalhe.jsx).
// Mostra se o prazo para pedir isenção está aberto, quem tem direito e como comprovar.
//
// Props:
//   isencao -> { inicio, fim, resultado, ondePedir, quemTem: [{ titulo, comoComprovar }] }

// Diz em que momento está o prazo de isenção, comparando com a data de hoje.
// Devolve o texto do selo, a cor dele (tipo do Chip) e uma frase explicando.
function situacaoPrazo(isencao) {
  const dataHoje = hoje();
  const periodo = `${formatarData(isencao.inicio)} a ${formatarData(isencao.fim)}`;

  if (dataHoje < isencao.inicio) {
    return { selo: "Em breve", tipo: "previsto", frase: `Os pedidos vão de ${periodo}.` };
  }
  if (dataHoje <= isencao.fim) {
    return { selo: "Prazo aberto", tipo: "ok", frase: `Peça até ${formatarData(isencao.fim)}.` };
  }
  return { selo: "Prazo encerrado", tipo: "neutro", frase: `Os pedidos foram de ${periodo}.` };
}

export default function Isencao({ isencao }) {
  const prazo = situacaoPrazo(isencao);

  return (
    <div>
      {/* Situação do prazo: selo colorido + frase escrita (não depende só da cor) */}
      <p className="isencao-prazo">
        <Chip tipo={prazo.tipo}>{prazo.selo}</Chip>
        <span>{prazo.frase}</span>
      </p>

      <h3 className="dash-subtitulo">Quem pode pedir</h3>
      {/* Um cartão para cada situação que dá direito à isenção */}
      <ul className="isencao-lista">
        {isencao.quemTem.map((item) => (
          <li key={item.titulo} className="isencao-item">
            <strong>{item.titulo}</strong>
            <span className="texto-sec">{item.comoComprovar}</span>
          </li>
        ))}
      </ul>

      {/* Informações práticas em lista de "nome: valor", as três lado a lado */}
      <dl className="isencao-info">
        <div>
          <dt>Onde pedir</dt>
          <dd>{isencao.ondePedir}</dd>
        </div>
        <div>
          <dt>Resultado final</dt>
          <dd>{formatarData(isencao.resultado)}</dd>
        </div>
        <div>
          <dt>Se o pedido for negado</dt>
          <dd>Dá para pagar a taxa normalmente, dentro do prazo de inscrição.</dd>
        </div>
      </dl>
    </div>
  );
}
