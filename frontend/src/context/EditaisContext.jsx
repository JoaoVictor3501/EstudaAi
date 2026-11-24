import { createContext, useContext, useState } from "react";
import { editaisIniciais } from "../data/editais";

const EditaisContext = createContext(null);

// Lista de editais em memória.
// Depois: GET /api/editais, POST /api/editais, PUT /api/editais/:id e DELETE /api/editais/:id.
export function EditaisProvider({ children }) {
  const [editais, setEditais] = useState(editaisIniciais);

  // Adiciona um edital novo com o próximo id disponível e devolve esse id.
  function adicionarEdital(edital) {
    const id = editais.length ? Math.max(...editais.map((e) => e.id)) + 1 : 1;
    setEditais([...editais, { ...edital, id }]);
    return id;
  }

  // Altera um edital que já existe.
  // Só troca os campos enviados: o resto (cargos, cronograma, PDF...) continua igual.
  function atualizarEdital(id, dados) {
    setEditais(editais.map((e) => (e.id === id ? { ...e, ...dados, id } : e)));
  }

  // Remove o edital da lista.
  function removerEdital(id) {
    setEditais(editais.filter((e) => e.id !== id));
  }

  return (
    <EditaisContext.Provider value={{ editais, adicionarEdital, atualizarEdital, removerEdital }}>
      {children}
    </EditaisContext.Provider>
  );
}

export function useEditais() {
  return useContext(EditaisContext);
}
