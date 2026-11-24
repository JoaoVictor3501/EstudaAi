import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Campo from "../components/Campo";
import Icone from "../components/Icone";
import LayoutAuth from "../components/LayoutAuth";

// RF01: cadastro de conta
export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  // Confere os campos e devolve um objeto com as mensagens de erro (vazio se estiver tudo certo).
  function validar() {
    const e = {};
    if (!nome.trim()) e.nome = "Informe seu nome.";
    if (!email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Digite um e-mail válido, como nome@email.com.";
    if (!senha) e.senha = "Crie uma senha.";
    else if (senha.length < 6) e.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (confirmacao !== senha) e.confirmacao = "As senhas não são iguais.";
    return e;
  }

  // Roda quando o usuário clica em "Criar conta".
  function enviarFormulario(ev) {
    ev.preventDefault(); // impede a página de recarregar
    const e = validar();
    setErros(e);
    setErroGeral("");
    if (Object.keys(e).length > 0) return;

    // Cria a conta; se o e-mail já existir, mostra o erro geral.
    const resultado = cadastrar(nome.trim(), email.trim(), senha);
    if (!resultado.ok) {
      setErroGeral(resultado.erro);
      return;
    }
    navigate("/editais");
  }

  return (
    // Frase de quem está começando agora: o primeiro passo é começar.
    <LayoutAuth
      frase="O segredo para progredir é começar."
      autor="Mark Twain"
      titulo="Crie sua conta"
      subtitulo="Comece a estudar pelo edital do seu concurso"
      idTitulo="titulo-cadastro"
    >
      <form className="card" onSubmit={enviarFormulario} noValidate>
        <Campo
          id="nome"
          rotulo="Nome"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            setErros((r) => ({ ...r, nome: undefined }));
          }}
          erro={erros.nome}
        />
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
          placeholder="Mínimo de 6 caracteres"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setErros((r) => ({ ...r, senha: undefined }));
          }}
          erro={erros.senha}
        />
        <Campo
          id="confirmacao"
          rotulo="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmacao}
          onChange={(e) => {
            setConfirmacao(e.target.value);
            setErros((r) => ({ ...r, confirmacao: undefined }));
          }}
          erro={erros.confirmacao}
        />
        {erroGeral && (
          <p className="alerta-erro" role="alert">
            <Icone nome="erro" tamanho={22} />
            {erroGeral}
          </p>
        )}
        <button type="submit" className="btn-acao btn-bloco">
          Criar conta
        </button>
      </form>

      <p className="texto-sec centro">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </LayoutAuth>
  );
}
