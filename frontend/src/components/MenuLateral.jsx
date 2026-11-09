import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import Icone from "./Icone";

// Itens do menu. Para criar uma tela nova no menu, basta acrescentar um objeto aqui.
// "somenteAdmin: true" esconde o item de quem não é administrador.
// "exato: true" só marca o item como ativo na rota exata (senão "Gerenciar editais"
// também ficaria ativo dentro de /admin/editais/novo).
const itens = [
  { rota: "/editais", texto: "Editais", icone: "disciplinas" },
  {
    rota: "/admin/editais",
    texto: "Gerenciar editais",
    icone: "configuracoes",
    somenteAdmin: true,
    exato: true,
  },
  { rota: "/admin/editais/novo", texto: "Novo edital", icone: "simulados", somenteAdmin: true },
];

// Menu lateral: aparece só com usuário logado (quem decide isso é o App.jsx).
// No computador fica fixo à esquerda; no celular vira uma barra no topo com o botão "Menu".
export default function MenuLateral() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false); // usado só no celular

  // Desloga o usuário e volta para a tela de login.
  function aoClicarEmSair() {
    sair();
    navigate("/login");
  }

  // Mostra só os itens que o usuário pode ver.
  const itensVisiveis = itens.filter((item) => !item.somenteAdmin || usuario.admin);

  return (
    <aside className={`menu-lateral ${aberto ? "aberto" : ""}`}>
      <div className="menu-topo">
        <NavLink to="/editais" className="menu-logo" onClick={() => setAberto(false)}>
          <img src={logo} alt="EstudaAí" />
        </NavLink>

        {/* Botão que abre e fecha o menu. O CSS só mostra ele em telas pequenas. */}
        <button
          className="menu-botao"
          aria-expanded={aberto}
          aria-controls="menu-conteudo"
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? "Fechar" : "Menu"}
        </button>
      </div>

      <div id="menu-conteudo" className="menu-conteudo">
        {/* Quem está logado */}
        <div className="menu-usuario">
          <Icone nome="perfil" tamanho={40} />
          <div>
            <strong>{usuario.nome}</strong>
            <span className="texto-sec">{usuario.admin ? "Administrador" : "Concurseiro"}</span>
          </div>
        </div>

        {/* Links para as telas. O NavLink coloca a classe "active" no link da tela atual
            (e também em subpáginas, como /editais/1) e o atributo aria-current="page",
            que o leitor de tela anuncia. */}
        <nav aria-label="Principal">
          <ul className="menu-lista">
            {itensVisiveis.map((item) => (
              <li key={item.rota}>
                <NavLink
                  to={item.rota}
                  end={item.exato}
                  className="menu-item"
                  onClick={() => setAberto(false)}
                >
                  <Icone nome={item.icone} tamanho={28} />
                  {item.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sair fica separado no fim do menu */}
        <button className="menu-sair" onClick={aoClicarEmSair}>
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
