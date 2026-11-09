import { useState } from "react";
import { Link } from "react-router-dom";
import { useEditais } from "../context/EditaisContext";
import { tipoChipStatus } from "../data/editais";
import Chip from "../components/Chip";

// RF02: tela do administrador para gerenciar os editais (adicionar, alterar e remover).
// Adicionar e alterar abrem o formulário (NovoEdital.jsx); remover é feito aqui mesmo.
export default function GerenciarEditais() {
  const { editais, removerEdital } = useEditais();
  const [mensagem, setMensagem] = useState(""); // aviso depois de remover

  // Pede confirmação antes de remover (heurística: prevenção de erros),
  // porque a remoção não pode ser desfeita.
  function aoRemover(edital) {
    const confirmou = window.confirm(
      `Remover o edital "${edital.titulo}"?\nEssa ação não pode ser desfeita.`
    );
    if (!confirmou) return;
    removerEdital(edital.id);
    setMensagem(`Edital "${edital.titulo}" removido.`);
  }

  return (
    <main className="pagina">
      <div className="gerenciar-topo">
        <h1>Gerenciar editais</h1>
        <Link to="/admin/editais/novo" className="btn-acao">
          + Novo edital
        </Link>
      </div>

      {/* role="status" faz o leitor de tela anunciar a mensagem */}
      <p role="status" className={mensagem ? "aviso-sucesso" : "sr-only"}>
        {mensagem}
      </p>

      {editais.length === 0 ? (
        <div className="card vazio">
          <p>Nenhum edital cadastrado.</p>
        </div>
      ) : (
        <div className="card">
          <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Lista de editais">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Edital</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Ano</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {editais.map((e) => (
                  <tr key={e.id}>
                    <th scope="row">
                      <Link to={`/editais/${e.id}`}>{e.titulo}</Link>
                      <span className="tabela-obs">{e.orgao}</span>
                    </th>
                    <td>{e.categoria}</td>
                    <td>{e.ano}</td>
                    <td>
                      <Chip tipo={tipoChipStatus(e.status)}>{e.status}</Chip>
                    </td>
                    <td>
                      <div className="tabela-acoes">
                        {/* aria-label diz qual edital o botão altera (o texto "Editar" se repete) */}
                        <Link
                          to={`/admin/editais/${e.id}/editar`}
                          className="btn-sec"
                          aria-label={`Editar ${e.titulo}`}
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="btn-perigo"
                          aria-label={`Remover ${e.titulo}`}
                          onClick={() => aoRemover(e)}
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
