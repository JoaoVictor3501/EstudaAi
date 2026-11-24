import { createContext, useContext, useEffect, useState } from "react";
import { chamarApi, usandoApi } from "../services/api";

const AuthContext = createContext(null);

// Lê um valor salvo no navegador (localStorage). Se não der para ler, devolve null.
function lerSalvo(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave));
  } catch {
    return null;
  }
}

// Salva (ou apaga, quando o valor é null) um valor no navegador.
function salvar(chave, valor) {
  try {
    if (valor) localStorage.setItem(chave, JSON.stringify(valor));
    else localStorage.removeItem(chave);
  } catch {
    // sem localStorage (ex.: aba anônima bloqueada): segue só em memória
  }
}

// Contas do modo de exemplo (sem API configurada).
const contasExemplo = [
  { nome: "Administrador", email: "admin@estudaai.com", senha: "123456", admin: true },
  { nome: "Concurseiro Exemplo", email: "aluno@estudaai.com", senha: "123456", admin: false },
];

// RF01: login e cadastro.
// Com a API: POST /api/auth/login e POST /api/auth/register devolvem { token, usuario }.
// O token (JWT) é o "crachá" do usuário: vai em toda requisição que precisa de login.
// Usuário e token ficam salvos no navegador para não deslogar ao atualizar a página.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => lerSalvo("estudaai_usuario"));
  const [token, setToken] = useState(() => lerSalvo("estudaai_token"));
  const [usuariosExemplo, setUsuariosExemplo] = useState(contasExemplo);

  // Guarda a sessão (usuário + token) na tela e no navegador.
  function iniciarSessao(novoUsuario, novoToken) {
    setUsuario(novoUsuario);
    setToken(novoToken);
    salvar("estudaai_usuario", novoUsuario);
    salvar("estudaai_token", novoToken);
  }

  // Faz o logout: apaga a sessão da tela e do navegador.
  function sair() {
    iniciarSessao(null, null);
  }

  // Ao abrir o site com uma sessão salva, pergunta à API quem é o dono do token (GET /api/auth/me).
  // Se o token venceu (ele vale 1 dia) ou é inválido, a API responde erro e a pessoa é deslogada.
  // O [] no final faz isso rodar uma vez só, quando o site abre.
  useEffect(() => {
    const tokenSalvo = lerSalvo("estudaai_token");
    if (!usandoApi || !tokenSalvo) return;
    chamarApi("/api/auth/me", { token: tokenSalvo })
      .then((dados) => iniciarSessao(dados.usuario, tokenSalvo))
      .catch((erro) => {
        if (erro.status === 401) iniciarSessao(null, null);
      });
  }, []);

  // Entra com e-mail e senha. Devolve { ok: true } ou { ok: false, erro: "mensagem" }.
  async function login(email, senha) {
    if (!usandoApi) {
      const encontrado = usuariosExemplo.find((u) => u.email === email && u.senha === senha);
      if (!encontrado) return { ok: false, erro: "E-mail ou senha incorretos." };
      iniciarSessao(encontrado, null);
      return { ok: true };
    }

    try {
      const dados = await chamarApi("/api/auth/login", { metodo: "POST", corpo: { email, senha } });
      iniciarSessao(dados.usuario, dados.token);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  // Cria a conta e já deixa a pessoa logada. Devolve { ok: true } ou { ok: false, erro }.
  // Toda conta nova é de concurseiro; administrador só é criado direto no banco.
  async function cadastrar(nome, email, senha) {
    if (!usandoApi) {
      if (usuariosExemplo.some((u) => u.email === email)) {
        return { ok: false, erro: "Já existe uma conta com esse e-mail." };
      }
      const novo = { nome, email, senha, admin: false };
      setUsuariosExemplo([...usuariosExemplo, novo]);
      iniciarSessao(novo, null);
      return { ok: true };
    }

    try {
      const dados = await chamarApi("/api/auth/register", {
        metodo: "POST",
        corpo: { nome, email, senha },
      });
      iniciarSessao(dados.usuario, dados.token);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
