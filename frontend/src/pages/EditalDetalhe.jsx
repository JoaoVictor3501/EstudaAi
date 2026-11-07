import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import Chip from "../components/Chip";
import Icone from "../components/Icone";
import LinhaDoTempo from "../components/LinhaDoTempo";
import TabelaCargos from "../components/TabelaCargos";
import GraficoMaterias from "../components/GraficoMaterias";
import Secao from "../components/Secao";
import Isencao from "../components/Isencao";
import SeletorCargo from "../components/SeletorCargo";
import {
  tipoChipStatus,
  formatarData,
  formatarDinheiro,
  textoTaxa,
  totalVagas,
  hoje,
  diasAte,
} from "../data/editais";

// Frase de prazo que aparece em destaque no topo do dashboard.
// Ela muda sozinha conforme a data de hoje: antes, durante e depois das inscrições.
function textoPrazo(edital) {
  const dataHoje = hoje();

  // Escreve "hoje", "amanhã" ou "em X dias".
  function emDias(data) {
    const dias = diasAte(data);
    if (dias === 0) return "hoje";
    if (dias === 1) return "amanhã";
    return `em ${dias} dias`;
  }

  if (dataHoje < edital.inscricaoInicio) {
    return `As inscrições começam ${emDias(edital.inscricaoInicio)}.`;
  }
  if (dataHoje <= edital.inscricaoFim) {
    return `Inscrições abertas! Elas terminam ${emDias(edital.inscricaoFim)}.`;
  }
  if (edital.dataProva && dataHoje <= edital.dataProva) {
    return `Inscrições encerradas. A prova é ${emDias(edital.dataProva)}.`;
  }
  return "Este concurso já teve a prova aplicada.";
}

// Card pequeno do resumo (ícone, nome da informação e valor em destaque).
// Fica dentro de um <dl>: o <dt> é o nome da informação e o <dd> é o valor.
function CardResumo({ icone, rotulo, valor, detalhe }) {
  return (
    <div className="card resumo-card">
      <dt>
        <Icone nome={icone} tamanho={32} />
        {rotulo}
      </dt>
      <dd>
        {valor}
        {detalhe && <span className="resumo-detalhe">{detalhe}</span>}
      </dd>
    </div>
  );
}

// Dashboard do edital: junta as informações mais importantes em cards, tabela de cargos,
// isenção, gráfico de matérias e linha do tempo, para a pessoa entender o edital sem ler
// o PDF todo. A pessoa pode escolher um cargo no topo e a página mostra só os dados dele.
// Também continua mostrando as disciplinas e materiais (RF02 e RF12) dos editais
// cadastrados na tela "Novo edital".
export default function EditalDetalhe() {
  const { id } = useParams();
  const { editais } = useEditais();
  const edital = editais.find((e) => e.id === Number(id));
  const [abertas, setAbertas] = useState({}); // disciplinas abertas
  const [topicoAberto, setTopicoAberto] = useState(null); // "disciplina/topico"
  // Nome do cargo escolhido no topo da página ("" = todos os cargos).
  // Fica aqui (e não no SeletorCargo) porque o resumo, a tabela e o gráfico usam essa escolha.
  const [cargoEscolhido, setCargoEscolhido] = useState("");

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

  // Editais cadastrados pela tela "Novo edital" não têm cargos, cronograma etc.
  // Por isso cada parte do dashboard só aparece se o edital tiver aquela informação.
  const cargos = edital.cargos || [];
  const temCargos = cargos.length > 0;
  const disciplinas = edital.disciplinas || [];

  // Maior salário entre os cargos (Math.max precisa dos números "espalhados" com ...).
  const maiorSalario = temCargos ? Math.max(...cargos.map((c) => c.salario)) : null;
  const vagas = totalVagas(edital);

  // Cargo que a página está mostrando agora:
  //   - edital com um cargo só (IFSP): é sempre ele, nem precisa escolher;
  //   - senão: o cargo escolhido na lista, ou null quando está em "Todos os cargos".
  // find devolve undefined se não achar; "|| null" troca por null para ficar mais claro.
  const cargo =
    cargos.length === 1 ? cargos[0] : cargos.find((c) => c.nome === cargoEscolhido) || null;

  return (
    <main className="pagina">
      <Link to="/editais" className="voltar">
        &larr; Voltar para editais
      </Link>

      {/* Topo: nome do concurso e o botão para o edital completo, bem à vista */}
      <header className="dash-topo">
        <div>
          <h1>{edital.titulo}</h1>
          <p className="texto-sec">
            {edital.orgao} · Banca: {edital.banca}
          </p>
          <p className="dash-chips">
            <Chip tipo={tipoChipStatus(edital.status)}>{edital.status}</Chip>
            <Chip>{edital.categoria}</Chip>
            <Chip>{edital.nivel}</Chip>
          </p>
        </div>

        {/* target="_blank" abre o PDF em outra aba; rel="noopener" é por segurança */}
        {edital.linkEdital && (
          <a
            className="btn-acao btn-edital"
            href={edital.linkEdital}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver edital completo (PDF)
          </a>
        )}
      </header>

      {/* Aviso de prazo. role="status" faz o leitor de tela ler a frase. */}
      <p className="aviso-prazo" role="status">
        <Icone nome="tempo" tamanho={28} />
        {textoPrazo(edital)}
      </p>

      {/* 1ª pergunta da pessoa: "qual cargo é pra mim?". Só aparece com mais de um cargo. */}
      {cargos.length > 1 && (
        <SeletorCargo cargos={cargos} valor={cargoEscolhido} aoMudar={setCargoEscolhido} />
      )}

      {/* Resumo em cards: o que a pessoa mais quer saber, em poucos segundos.
          Os 3 primeiros cards mudam conforme o cargo escolhido. */}
      <h2 className="sr-only">Resumo do edital</h2>
      <dl className="resumo">
        {/* Com cargo escolhido: dados só dele. Sem cargo: totais do edital. */}
        {cargo && (
          <>
            <CardResumo
              icone="perfil"
              rotulo="Vagas"
              valor={cargo.vagas > 0 ? cargo.vagas : "Cadastro reserva"}
              detalhe={`${cargo.nivel} · ${cargo.carga}`}
            />
            <CardResumo
              icone="conquistas"
              rotulo="Salário"
              valor={formatarDinheiro(cargo.salario)}
              detalhe={cargo.observacao}
            />
            <CardResumo
              icone="favoritos"
              rotulo="Taxa de inscrição"
              valor={formatarDinheiro(cargo.taxa)}
              detalhe={edital.isencao && "Tem isenção para alguns casos"}
            />
          </>
        )}
        {!cargo && temCargos && (
          <>
            <CardResumo
              icone="perfil"
              rotulo="Vagas"
              valor={vagas}
              detalhe={`em ${cargos.length} cargos`}
            />
            <CardResumo
              icone="conquistas"
              rotulo="Maior salário"
              valor={formatarDinheiro(maiorSalario)}
            />
          </>
        )}
        {/* Se o edital tem isenção, o card da taxa avisa (o quadro completo fica mais abaixo) */}
        {!cargo && (
          <CardResumo
            icone="favoritos"
            rotulo="Taxa de inscrição"
            valor={textoTaxa(edital)}
            detalhe={edital.isencao && "Tem isenção para alguns casos"}
          />
        )}
        <CardResumo
          icone="calendario"
          rotulo="Inscrições"
          valor={`${formatarData(edital.inscricaoInicio)} a ${formatarData(edital.inscricaoFim)}`}
        />
        <CardResumo
          icone="simulados"
          rotulo="Data da prova"
          valor={formatarData(edital.dataProva)}
        />
        <CardResumo
          icone="inicio"
          rotulo="Local da prova"
          valor={edital.locais ? edital.locais.join(", ") : "Não informado"}
        />
      </dl>

      {/* As seções seguem a ordem das perguntas de quem vai prestar o concurso:
            1. Quais cargos, quantas vagas e quanto paga?
            2. Quanto custa a inscrição e dá para não pagar? (isenção)
            3. O que estudar?
            4. Quais são as datas?
            5. Como funciona a seleção?
          Cada uma é uma <Secao>: clicando no título, a pessoa mostra ou esconde o card. */}

      {temCargos && (
        <Secao icone="disciplinas" titulo="Cargos, vagas e salários">
          <TabelaCargos cargos={cargos} escolhido={cargo ? cargo.nome : ""} />
        </Secao>
      )}

      {/* Isenção da taxa: logo depois da tabela, que é onde a pessoa vê o valor da taxa */}
      {edital.isencao && (
        <Secao icone="favoritos" titulo="Isenção da taxa de inscrição">
          <Isencao isencao={edital.isencao} />
        </Secao>
      )}

      {temCargos && edital.provas && (
        <Secao icone="estudos" titulo="O que mais cai na prova">
          <GraficoMaterias provas={edital.provas} cargos={cargos} cargo={cargo} />
        </Secao>
      )}

      {edital.cronograma && (
        <Secao icone="calendario" titulo="Linha do tempo">
          <LinhaDoTempo cronograma={edital.cronograma} />
        </Secao>
      )}

      {/* Etapas do concurso e, se houver, as áreas de atuação (caso do IFSP) */}
      {(edital.etapas || edital.areas) && (
        <Secao icone="progresso" titulo="Como funciona a seleção">
          {edital.etapas && (
            // Lista em ordem (<ol>), mostrada como passos lado a lado.
            // O número vem de "i + 1" porque o map começa a contar do 0.
            <ol className="etapas-lista">
              {edital.etapas.map((etapa, i) => (
                <li key={etapa} className="etapa-passo">
                  <span className="etapa-numero" aria-hidden="true">
                    {i + 1}
                  </span>
                  {etapa}
                </li>
              ))}
            </ol>
          )}
          {edital.areas && (
            <>
              <h3 className="dash-subtitulo">Áreas de atuação</h3>
              <ul className="chips-lista">
                {edital.areas.map((area) => (
                  <li key={area}>
                    <Chip>{area}</Chip>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Secao>
      )}

      {/* Chamada final: de novo o botão do edital, para quem chegou até o fim da página */}
      {edital.linkEdital && (
        <section className="card dash-final">
          <div>
            <h2 className="dash-titulo">Quer ver todos os detalhes?</h2>
            <p className="texto-sec">
              Este resumo não substitui o edital. Confira requisitos, conteúdo programático e regras
              no documento oficial.
            </p>
          </div>
          <div className="dash-final-botoes">
            <a
              className="btn-acao"
              href={edital.linkEdital}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver edital completo (PDF)
            </a>
            {edital.siteOficial && (
              <a
                className="btn-sec"
                href={edital.siteOficial}
                target="_blank"
                rel="noopener noreferrer"
              >
                Site da banca
              </a>
            )}
          </div>
        </section>
      )}

      {/* Disciplinas e materiais (RF02 e RF12): aparecem nos editais cadastrados pelo admin */}
      {disciplinas.length > 0 && <h2 className="dash-titulo">Disciplinas e materiais</h2>}

      {disciplinas.map((d) => {
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
