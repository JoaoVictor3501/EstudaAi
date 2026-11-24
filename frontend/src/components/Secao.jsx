import Icone from "./Icone";

// Card do dashboard que a pessoa pode mostrar ou esconder clicando no título
// (usado em EditalDetalhe.jsx).
//
// Usamos as tags <details> e <summary> do próprio HTML: o navegador já faz o
// abrir/fechar sozinho, sem precisar de useState. Também já funciona com teclado
// (Enter ou espaço) e o leitor de tela avisa se está aberto ou fechado.
// O atributo "open" faz o card começar aberto.
//
// Props:
//   icone    -> nome do ícone que aparece antes do título
//   titulo   -> texto do título
//   children -> o conteúdo do card (o que fica entre <Secao> e </Secao>)

export default function Secao({ icone, titulo, children }) {
  return (
    <details className="card secao" open>
      <summary className="secao-cab">
        <h2 className="dash-titulo">
          <Icone nome={icone} tamanho={28} />
          {titulo}
        </h2>
        {/* Setinha só visual: ela gira quando o card está aberto (ver global.css) */}
        <span className="secao-seta" aria-hidden="true">
          ▼
        </span>
      </summary>
      <div className="secao-conteudo">{children}</div>
    </details>
  );
}
