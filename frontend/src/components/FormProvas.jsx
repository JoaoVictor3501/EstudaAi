import ListaCampos from "./ListaCampos";

// Parte do formulário de edital onde o admin cadastra as provas e as matérias de cada uma
// (usada em NovoEdital.jsx).
//
// No edital, "provas" é um objeto: { medio: { nome, materias }, superior: { ... } }.
// Aqui no formulário é mais fácil trabalhar com uma lista:
//   [{ chave: "medio", nome: "Nível médio", materias: [{ nome, questoes, peso }] }]
// A "chave" liga a prova aos cargos (campo "prova" de cada cargo). Ela é criada sozinha
// e o admin não precisa digitar.
//
// Props:
//   provas  -> lista de provas no formato acima
//   aoMudar -> função chamada com a lista nova
//   erro    -> mensagem de erro (opcional)

const camposMateria = [
  { nome: "nome", rotulo: "Matéria", placeholder: "Ex.: Língua Portuguesa" },
  { nome: "questoes", rotulo: "Nº de questões", tipo: "number" },
  { nome: "peso", rotulo: "Peso (pontos por questão)", tipo: "number" },
];

export default function FormProvas({ provas, aoMudar, erro }) {
  // Troca um campo de uma prova.
  function mudar(indice, campo, valor) {
    aoMudar(provas.map((p, i) => (i === indice ? { ...p, [campo]: valor } : p)));
  }

  function adicionarProva() {
    // Date.now() devolve um número diferente a cada momento, então a chave não se repete.
    aoMudar([...provas, { chave: `prova${Date.now()}`, nome: "", materias: [] }]);
  }

  function removerProva(indice) {
    aoMudar(provas.filter((_, i) => i !== indice));
  }

  return (
    <div>
      {provas.length === 0 && <p className="texto-sec">Nenhuma prova adicionada.</p>}

      {provas.map((p, i) => (
        <section key={p.chave} className="bloco-prova" aria-label={`Prova ${i + 1}`}>
          <div className="disciplina-titulo">
            <strong>Prova {i + 1}</strong>
            <button type="button" className="btn-link" onClick={() => removerProva(i)}>
              Remover prova
            </button>
          </div>
          <div className="campo">
            <label htmlFor={`prova-${i}-nome`}>Nome da prova</label>
            <input
              id={`prova-${i}-nome`}
              placeholder="Ex.: Nível médio e técnico"
              value={p.nome}
              onChange={(e) => mudar(i, "nome", e.target.value)}
            />
          </div>
          <p className="dash-subtitulo">Matérias</p>
          <ListaCampos
            id={`prova-${i}-materia`}
            itens={p.materias}
            aoMudar={(materias) => mudar(i, "materias", materias)}
            campos={camposMateria}
            novoItem={{ nome: "", questoes: "", peso: "" }}
            textoItem="matéria"
          />
        </section>
      ))}

      <button type="button" className="btn-sec" onClick={adicionarProva}>
        + Adicionar prova
      </button>

      {erro && (
        <p className="campo-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
