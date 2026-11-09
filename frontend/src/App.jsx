import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MenuLateral from "./components/MenuLateral";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Busca from "./pages/Busca";
import EditalDetalhe from "./pages/EditalDetalhe";
import NovoEdital from "./pages/NovoEdital";
import GerenciarEditais from "./pages/GerenciarEditais";

// "Protegida" é uma tela que exige login (e admin, quando somenteAdmin for verdadeiro).
// Sem permissão, o usuário é redirecionado.
function Protegida({ children, somenteAdmin }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (somenteAdmin && !usuario.admin) return <Navigate to="/editais" replace />;
  return children;
}

export default function App() {
  const { usuario } = useAuth();

  // Com usuário logado, a tela fica dividida em duas colunas: menu à esquerda e conteúdo à direita.
  // Sem login (telas de entrar e criar conta) não há menu: só o conteúdo, sobre o plano de fundo.
  return (
    <div className={usuario ? "layout" : "fundo-auth"}>
      {usuario && <MenuLateral />}
      <div className="layout-conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/editais" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/editais"
            element={
              <Protegida>
                <Busca />
              </Protegida>
            }
          />
          <Route
            path="/editais/:id"
            element={
              <Protegida>
                <EditalDetalhe />
              </Protegida>
            }
          />
          <Route
            path="/admin/editais"
            element={
              <Protegida somenteAdmin>
                <GerenciarEditais />
              </Protegida>
            }
          />
          <Route
            path="/admin/editais/novo"
            element={
              <Protegida somenteAdmin>
                <NovoEdital />
              </Protegida>
            }
          />
          {/* A mesma tela do "Novo edital", mas já preenchida com o edital escolhido */}
          <Route
            path="/admin/editais/:id/editar"
            element={
              <Protegida somenteAdmin>
                <NovoEdital />
              </Protegida>
            }
          />
          <Route path="*" element={<Navigate to="/editais" replace />} />
        </Routes>
      </div>
    </div>
  );
}
