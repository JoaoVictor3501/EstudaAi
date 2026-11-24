// Comunicação com o back-end (API em Node.js + Express hospedada no Render).
//
// O endereço da API vem da variável de ambiente VITE_API_URL:
//   - na Vercel: Settings > Environment Variables;
//   - no computador: arquivo frontend/.env.local com a linha VITE_API_URL=https://...
// O Vite só deixa o front ler variáveis que começam com "VITE_".
//
// Sem essa variável o site funciona com os dados de exemplo (data/editais.js) e com
// o login simulado, o que ajuda a programar o front sem depender do servidor.
export const API_URL = import.meta.env.VITE_API_URL;

// true quando existe um endereço de API configurado.
export const usandoApi = Boolean(API_URL);

// Faz uma requisição para a API e devolve a resposta já convertida de JSON.
// Se a API responder com erro, lança um Error com a mensagem que o back-end mandou,
// para a tela mostrar ao usuário.
//
//   caminho -> parte do endereço depois do domínio, ex.: "/api/editais"
//   metodo  -> "GET", "POST", "PUT" ou "DELETE"
//   corpo   -> objeto enviado como JSON (no POST e no PUT)
//   token   -> crachá do login (JWT), vai no cabeçalho Authorization
export async function chamarApi(caminho, { metodo = "GET", corpo, token } = {}) {
  const cabecalhos = {};
  if (corpo !== undefined) cabecalhos["Content-Type"] = "application/json";
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    // fetch só falha assim quando não consegue nem falar com o servidor (sem internet, fora do ar).
    throw new Error(
      "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo."
    );
  }

  // Algumas respostas não têm corpo (ex.: DELETE). Por isso o JSON é lido com cuidado.
  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    // O back-end manda { message } e, nos erros de validação, também { erros: [...] }.
    const mensagem = (dados && dados.message) || `Erro ${resposta.status} no servidor.`;
    const detalhes = dados && Array.isArray(dados.erros) ? `: ${dados.erros.join("; ")}` : "";
    const erro = new Error(mensagem + detalhes);
    erro.status = resposta.status; // ex.: 401 = login vencido, 404 = rota ou edital não existe
    throw erro;
  }

  return dados;
}
