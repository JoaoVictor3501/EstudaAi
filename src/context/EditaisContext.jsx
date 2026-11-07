import { createContext, useContext, useState } from "react";
import { editaisIniciais } from "../data/editais";

const EditaisContext = createContext(null);

// Lista de editais em memória. Depois: GET/POST /api/editais.
export function EditaisProvider({ children }) {
  const [editais, setEditais] = useState(editaisIniciais);

  // Adiciona um edital novo com o próximo id disponível e devolve esse id.
  function adicionarEdital(edital) {
    const id = editais.length ? Math.max(...editais.map((e) => e.id)) + 1 : 1;
    setEditais([...editais, { ...edital, id }]);
    return id;
  }

  return (
    <EditaisContext.Provider value={{ editais, adicionarEdital }}>
      {children}
    </EditaisContext.Provider>
  );
}

export function useEditais() {
  return useContext(EditaisContext);
}
