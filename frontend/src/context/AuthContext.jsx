import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Autenticação simulada (sem back-end ainda).
// Depois: trocar por POST /api/auth/login e POST /api/auth/register (JWT).
// Regra provisória: e-mail que começa com "admin" entra como administrador.
export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState([
    { nome: "Administrador", email: "admin@estudaai.com", senha: "123456", admin: true },
    { nome: "Concurseiro Exemplo", email: "aluno@estudaai.com", senha: "123456", admin: false },
  ]);
  // Guarda o usuário logado no navegador para não deslogar ao atualizar a página.
  // Depois: guardar o token JWT no lugar.
  const [usuario, setUsuarioState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("estudaai_usuario"));
    } catch {
      return null;
    }
  });

  function setUsuario(u) {
    setUsuarioState(u);
    try {
      if (u) localStorage.setItem("estudaai_usuario", JSON.stringify(u));
      else localStorage.removeItem("estudaai_usuario");
    } catch {
      // sem localStorage: segue só em memória
    }
  }

  // Procura um usuário com o mesmo e-mail e senha.
  function login(email, senha) {
    const encontrado = usuarios.find((u) => u.email === email && u.senha === senha);
    if (!encontrado) return { ok: false, erro: "E-mail ou senha incorretos." };
    setUsuario(encontrado);
    return { ok: true };
  }

  // Cria um usuário novo (e-mail não pode se repetir) e já deixa logado.
  function cadastrar(nome, email, senha) {
    if (usuarios.some((u) => u.email === email)) {
      return { ok: false, erro: "Já existe uma conta com esse e-mail." };
    }
    const novo = { nome, email, senha, admin: email.startsWith("admin") };
    setUsuarios([...usuarios, novo]);
    setUsuario(novo);
    return { ok: true };
  }

  // Faz o logout.
  function sair() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
