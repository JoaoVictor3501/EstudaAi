import { formatarData, hoje } from "../data/editais";

// Linha do tempo com as datas mais importantes do edital (usada em EditalDetalhe.jsx).
//
// Cada etapa ganha uma situação, comparando a data dela com a data de hoje:
//   "feito"  -> a etapa já passou
//   "agora"  -> estamos dentro do período da etapa (ex.: inscrições abertas)
//   "futuro" -> ainda vai acontecer
// A primeira etapa que ainda vai acontecer ganha o selo "Próxima".
//
// Props:
//   cronograma -> lista de { data, fim (opcional), evento }

function situacao(etapa, dataHoje) {
  const fim = etapa.fim || etapa.data; // etapa de um dia só: começa e termina na mesma data
  if (fim < dataHoje) return "feito";
  if (etapa.data <= dataHoje) return "agora";
  return "futuro";
}

export default function LinhaDoTempo({ cronograma }) {
  const dataHoje = hoje();

  // Posição da próxima etapa (a primeira que ainda é "futuro"). -1 se todas já passaram.
  const proxima = cronograma.findIndex((e) => situacao(e, dataHoje) === "futuro");

  return (
    // <ol> é uma lista em ordem: o leitor de tela fala "item 1 de 8", "item 2 de 8"...
    <ol className="linha-tempo">
      {cronograma.map((etapa, i) => {
        const estado = situacao(etapa, dataHoje);
        return (
          <li key={etapa.evento} className={`etapa etapa-${estado}`}>
            {/* A bolinha é só enfeite; o texto da situação vem logo abaixo */}
            <span className="etapa-bolinha" aria-hidden="true">
              {estado === "feito" ? "✓" : ""}
            </span>
            <span className="etapa-data">
              {formatarData(etapa.data)}
              {etapa.fim && ` a ${formatarData(etapa.fim)}`}
            </span>
            <span className="etapa-evento">{etapa.evento}</span>
            {/* Texto escrito (e não só cor) para dizer a situação: ajuda quem não enxerga cores */}
            {estado === "agora" && <span className="etapa-selo selo-agora">Acontecendo agora</span>}
            {i === proxima && <span className="etapa-selo selo-proxima">Próxima</span>}
            {estado === "feito" && <span className="sr-only">(já aconteceu)</span>}
          </li>
        );
      })}
    </ol>
  );
}
