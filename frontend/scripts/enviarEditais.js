// Envia os editais de exemplo (src/data/editais.js) para o banco, pela API.
// Editais com o mesmo título de um que já está no banco são pulados.
// Serve para preencher o banco uma vez, sem cadastrar edital por edital na tela.
//
// Como usar (no PowerShell, dentro da pasta frontend):
//   $env:API_URL = "https://estudaai-m20s.onrender.com"
//   $env:ADMIN_EMAIL = "email-do-admin"
//   $env:ADMIN_SENHA = "senha-do-admin"
//   node scripts/enviarEditais.js
//
// Precisa de uma conta de administrador no banco (criada com backend/src/scripts/criarAdmin.js).
// Este arquivo roda no Node (não no navegador). A linha abaixo avisa o ESLint
// que "process" existe aqui (é onde o Node guarda as variáveis de ambiente).
/* global process */
import { editaisIniciais } from "../src/data/editais.js";

const { API_URL, ADMIN_EMAIL, ADMIN_SENHA } = process.env;

// Faz uma requisição para a API e devolve { ok, status, dados }.
async function chamar(caminho, metodo, corpo, token) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(corpo),
  });
  const dados = await resposta.json().catch(() => null);
  return { ok: resposta.ok, status: resposta.status, dados };
}

async function main() {
  if (!API_URL || !ADMIN_EMAIL || !ADMIN_SENHA) {
    console.log(
      "Defina API_URL, ADMIN_EMAIL e ADMIN_SENHA antes de rodar (veja o topo do arquivo)."
    );
    process.exitCode = 1;
    return;
  }

  // 1) Entra como administrador para pegar o token (o "crachá" do login).
  console.log("Entrando como administrador... (o servidor pode levar até 1 minuto para acordar)");
  const login = await chamar("/api/auth/login", "POST", { email: ADMIN_EMAIL, senha: ADMIN_SENHA });
  if (!login.ok) {
    console.log("Não foi possível entrar:", login.dados?.message || login.status);
    process.exitCode = 1;
    return;
  }
  if (!login.dados.usuario.admin) {
    console.log("Essa conta não é de administrador.");
    process.exitCode = 1;
    return;
  }

  // 2) Busca os títulos que já estão no banco, para não cadastrar o mesmo edital duas vezes.
  const lista = await chamar("/api/editais?limite=100", "GET", undefined, login.dados.token);
  const titulosNoBanco = lista.ok ? lista.dados.editais.map((e) => e.titulo) : [];

  // 3) Envia um edital por vez. O "id" e o "criadoPor" ficam de fora:
  //    o banco cria o próprio id e marca o admin logado como quem criou.
  for (const edital of editaisIniciais) {
    if (titulosNoBanco.includes(edital.titulo)) {
      console.log(`JÁ ESTÁ NO BANCO  ${edital.titulo}`);
      continue;
    }
    const dados = { ...edital }; // cópia, para não mexer no original
    delete dados.id;
    delete dados.criadoPor;
    const resultado = await chamar("/api/editais", "POST", dados, login.dados.token);
    if (resultado.ok) {
      console.log(`OK    ${edital.titulo}`);
    } else {
      const motivo = resultado.dados?.erros?.join("; ") || resultado.dados?.message;
      console.log(`ERRO  ${edital.titulo}: ${motivo}`);
    }
  }
}

main();
