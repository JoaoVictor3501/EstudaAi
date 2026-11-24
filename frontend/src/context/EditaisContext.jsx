import { createContext, useContext, useEffect, useState } from "react";
import { editaisIniciais } from "../data/editais";
import { chamarApi, usandoApi } from "../services/api";
import { useAuth } from "./AuthContext";

const EditaisContext = createContext(null);

// Deixa o edital que vem da API no formato que as telas usam:
//   - o MongoDB chama o identificador de "_id" (um texto, ex.: "6743ab..."); as telas usam "id";
//   - "criadoPor" vem como { _id, nome } de quem criou; as telas mostram só o nome.
function normalizar(edital) {
  const criadoPor = edital.criadoPor && edital.criadoPor.nome;
  return { ...edital, id: edital._id, criadoPor: criadoPor || "Não informado" };
}

// Lista de editais usada por todas as telas.
// Com a API, os editais vêm do banco (MongoDB) pelas rotas:
//   GET    /api/editais      -> lista (precisa estar logado)
//   POST   /api/editais      -> cria (só admin)
//   PUT    /api/editais/:id  -> altera (só admin)
//   DELETE /api/editais/:id  -> remove (só admin)
// Sem API configurada, usa os editais de exemplo de data/editais.js, só em memória.
export function EditaisProvider({ children }) {
  const { token } = useAuth();
  const [editais, setEditais] = useState(usandoApi ? [] : editaisIniciais);
  const [erroCarregar, setErroCarregar] = useState(""); // mensagem se a lista não carregar
  // Token com o qual a lista já foi buscada (a resposta chegou, com sucesso ou erro).
  const [tokenCarregado, setTokenCarregado] = useState(null);

  // Busca a lista no banco sempre que o token muda (ao entrar ou trocar de conta).
  // Sem token (ninguém logado) não busca, porque a rota exige login.
  useEffect(() => {
    if (!usandoApi || !token) return;
    chamarApi("/api/editais?limite=100", { token })
      .then((dados) => {
        setEditais(dados.editais.map(normalizar));
        setErroCarregar("");
      })
      .catch((erro) => setErroCarregar(erro.message))
      .finally(() => setTokenCarregado(token));
  }, [token]);

  // Está carregando quando há API e login, mas a lista deste token ainda não chegou.
  const carregando = usandoApi && Boolean(token) && tokenCarregado !== token;

  // Cria um edital e devolve o id dele (para a tela abrir o edital criado).
  // Se a API recusar (ex.: campo inválido), o erro sobe para a tela mostrar.
  async function adicionarEdital(edital) {
    if (!usandoApi) {
      const id = editais.length ? Math.max(...editais.map((e) => e.id)) + 1 : 1;
      setEditais([...editais, { ...edital, id }]);
      return id;
    }
    const criado = normalizar(
      await chamarApi("/api/editais", { metodo: "POST", corpo: edital, token })
    );
    setEditais([criado, ...editais]);
    return criado.id;
  }

  // Altera um edital que já existe.
  // Só troca os campos enviados: o resto (cargos, cronograma, PDF...) continua igual.
  async function atualizarEdital(id, dados) {
    if (!usandoApi) {
      setEditais(editais.map((e) => (e.id === id ? { ...e, ...dados, id } : e)));
      return;
    }
    const alterado = normalizar(
      await chamarApi(`/api/editais/${id}`, { metodo: "PUT", corpo: dados, token })
    );
    setEditais(editais.map((e) => (e.id === id ? alterado : e)));
  }

  // Remove o edital do banco e da lista.
  async function removerEdital(id) {
    if (usandoApi) {
      await chamarApi(`/api/editais/${id}`, { metodo: "DELETE", token });
    }
    setEditais(editais.filter((e) => e.id !== id));
  }

  return (
    <EditaisContext.Provider
      value={{
        editais,
        carregando,
        erroCarregar,
        adicionarEdital,
        atualizarEdital,
        removerEdital,
      }}
    >
      {children}
    </EditaisContext.Provider>
  );
}

export function useEditais() {
  return useContext(EditaisContext);
}
