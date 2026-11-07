import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Campo from "../components/Campo";
import Icone from "../components/Icone";
import LayoutAuth from "../components/LayoutAuth";

// RF01: login
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  // Confere os campos e devolve um objeto com as mensagens de erro (vazio se estiver tudo certo).
  function validar() {
    const e = {};
    if (!email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Digite um e-mail válido, como nome@email.com.";
    if (!senha) e.senha = "Informe sua senha.";
    return e;
  }

  // Roda quando o usuário clica em "Entrar".
  function enviarFormulario(ev) {
    ev.preventDefault(); // impede a página de recarregar
    const e = validar();
    setErros(e);
    setErroGeral("");
    if (Object.keys(e).length > 0) return;

    // Tenta entrar; se os dados não baterem, mostra o erro geral.
    const resultado = login(email.trim(), senha);
    if (!resultado.ok) {
      setErroGeral(resultado.erro);
      return;
    }
    navigate("/editais");
  }

  return (
    // Frase de quem está voltando: o importante é retomar, mesmo que devagar.
    <LayoutAuth
      frase="Não importa o quão devagar você vá, desde que você não pare."
      autor="Confúcio"
      titulo="Bem-vindo de volta"
      subtitulo="Entre para continuar seus estudos"
      idTitulo="titulo-login"
    >
      <form className="card" onSubmit={enviarFormulario} noValidate>
        <Campo
          id="email"
          rotulo="E-mail"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErros((r) => ({ ...r, email: undefined }));
          }}
          erro={erros.email}
        />
        <Campo
          id="senha"
          rotulo="Senha"
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setErros((r) => ({ ...r, senha: undefined }));
          }}
          erro={erros.senha}
        />
        {erroGeral && (
          <p className="alerta-erro" role="alert">
            <Icone nome="erro" tamanho={22} />
            {erroGeral}
          </p>
        )}
        <button type="submit" className="btn-acao btn-bloco">
          Entrar
        </button>
      </form>

      <p className="texto-sec centro">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </LayoutAuth>
  );
}
