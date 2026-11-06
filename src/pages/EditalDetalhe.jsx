import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import Chip from "../components/Chip";
import Icone from "../components/Icone";
import { tipoChipStatus, formatarData } from "../data/editais";

// RF02 (navegação por disciplina e tópico) e RF12 (materiais vinculados ao edital)
export default function EditalDetalhe() {
  const { id } = useParams();
  const { editais } = useEditais();
  const edital = editais.find((e) => e.id === Number(id));
  const [abertas, setAbertas] = useState({}); // disciplinas abertas
  const [topicoAberto, setTopicoAberto] = useState(null); // "disciplina/topico"

  // Se o id da URL não existir, avisa e oferece voltar.
  if (!edital) {
    return (
      <main className="pagina">
        <div className="card vazio">
          <Icone nome="erro" tamanho={72} className="icone-vazio" />
          <p>Edital não encontrado.</p>
        </div>
        <Link to="/editais">Voltar para a busca</Link>
      </main>
    );
  }

  // Abre ou fecha a lista de tópicos de uma disciplina.
  function alternarDisciplina(nome) {
    setAbertas({ ...abertas, [nome]: !abertas[nome] });
  }

  return (
    <main className="pagina">
      <Link to="/editais" className="voltar">
        &larr; Voltar para editais
      </Link>

      <h1>{edital.titulo}</h1>
      <p className="texto-sec">
        {edital.orgao} · {edital.banca} · {edital.nivel}
      </p>
      <p>
        <Chip tipo={tipoChipStatus(edital.status)}>{edital.status}</Chip>
      </p>

      {/* Informações do edital. <dl> é a lista de "termo: valor" do HTML
          (dt = nome da informação, dd = valor). */}
      <dl className="card edital-dados">
        <div>
          <dt>Ano</dt>
          <dd>{edital.ano}</dd>
        </div>
        <div>
          <dt>Inscrição</dt>
          <dd>
            {formatarData(edital.inscricaoInicio)} a {formatarData(edital.inscricaoFim)}
          </dd>
        </div>
        <div>
          <dt>Data da prova</dt>
          <dd>{formatarData(edital.dataProva)}</dd>
        </div>
        <div>
          <dt>Criado por</dt>
          <dd>{edital.criadoPor}</dd>
        </div>
      </dl>

      {edital.disciplinas.length === 0 && (
        <div className="card vazio">
          <Icone nome="disciplinas" tamanho={72} className="icone-vazio" />
          <p>Este edital ainda não tem disciplinas cadastradas.</p>
        </div>
      )}

      {edital.disciplinas.map((d) => {
        const aberta = abertas[d.nome];
        return (
          <section key={d.nome} className="disciplina">
            <button
              className="disciplina-cab"
              aria-expanded={!!aberta}
              onClick={() => alternarDisciplina(d.nome)}
            >
              <span className="disciplina-nome">
                <Icone nome="estudos" tamanho={28} />
                {d.nome}
              </span>
              <span className="texto-sec">
                {d.topicos.length} {d.topicos.length === 1 ? "tópico" : "tópicos"}{" "}
                {aberta ? "▲" : "▼"}
              </span>
            </button>

            {aberta && (
              <ul className="topicos">
                {d.topicos.map((t) => {
                  const chave = `${d.nome}/${t.nome}`;
                  const aberto = topicoAberto === chave;
                  return (
                    <li key={t.nome}>
                      <div className="topico-linha">
                        <span>{t.nome}</span>
                        <div className="topico-acoes">
                          <Chip tipo={t.atualizado ? "ok" : "erro"}>
                            {t.atualizado ? "Atualizado" : "Revisar material"}
                          </Chip>
                          <button
                            className="btn-sec"
                            aria-expanded={aberto}
                            onClick={() => setTopicoAberto(aberto ? null : chave)}
                          >
                            {aberto ? "Fechar" : "Ver materiais"}
                          </button>
                        </div>
                      </div>

                      {/* Materiais do tópico, mostrados ao clicar em "Ver materiais" */}
                      {aberto && (
                        <div className="materiais">
                          {t.materiais.length === 0 ? (
                            <p className="texto-sec">
                              Nenhum material cadastrado para este tópico.
                            </p>
                          ) : (
                            <ul>
                              {t.materiais.map((m) => (
                                <li key={m.titulo}>
                                  <span>{m.titulo}</span>
                                  <Chip>{m.tipo}</Chip>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
