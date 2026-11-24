# EstudaAí - Front-end

Front-end do EstudaAí (React + Vite + React Router), com as telas dos requisitos essenciais da Atividade 3.1: RF01, RF02, RF09 e RF12.

O login e os editais vêm do back-end (pasta `backend`, publicado no Render), pelo arquivo `src/services/api.js`.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

## Ligação com a API

O endereço da API fica na variável de ambiente `VITE_API_URL`:

- **Vercel:** Settings > Environment Variables > `VITE_API_URL` = endereço do Render (sem a opção "Sensitive"). Depois de mudar, faça um Redeploy.
- **No computador:** crie o arquivo `frontend/.env.local` com a linha `VITE_API_URL=https://estudaai-m20s.onrender.com` e rode `npm run dev` de novo. Esse arquivo não vai para o GitHub.

O servidor gratuito do Render entra em repouso quando fica parado; a primeira requisição depois disso pode levar até 1 minuto.

Contas novas são sempre de concurseiro. A conta de administrador é criada direto no banco com o script `backend/src/scripts/criarAdmin.js`.

Para colocar no banco os editais de exemplo (`src/data/editais.js`), use o script `scripts/enviarEditais.js` (as instruções estão no começo do arquivo).

## Modo de exemplo (sem API)

Sem `VITE_API_URL`, o site usa os editais de `src/data/editais.js` e um login simulado, com estas contas:

| Perfil        | E-mail             | Senha  |
| ------------- | ------------------ | ------ |
| Concurseiro   | aluno@estudaai.com | 123456 |
| Administrador | admin@estudaai.com | 123456 |

## Telas

| Rota                        | Tela                                                                                                                                        | Requisito   | Incremento |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| `/login`                    | Login                                                                                                                                       | RF01        | 1          |
| `/cadastro`                 | Criar conta                                                                                                                                 | RF01        | 1          |
| `/admin/editais`            | Gerenciar editais: lista com Editar e Remover (só admin)                                                                                    | RF02        | 2          |
| `/admin/editais/novo`       | Cadastro de edital completo: dados, links, locais, isenção, provas e matérias, cargos, cronograma, etapas, disciplinas e tópicos (só admin) | RF02        | 2          |
| `/admin/editais/:id/editar` | Alteração de edital (mesma tela do cadastro, já preenchida; só admin)                                                                       | RF02        | 2          |
| `/editais`                  | Busca com termo, categoria e filtros avançados                                                                                              | RF09        | 3          |
| `/editais/:id`              | Edital com disciplinas, tópicos e materiais                                                                                                 | RF02 e RF12 | 2 e 4      |

## Estrutura

```
src/
  main.jsx            entrada e provedores
  App.jsx             rotas e proteção de telas
  assets/             logo do EstudaAí e ícones (assets/icones)
  components/         MenuLateral (navegação e sair), ListaCampos (lista editável do formulário de edital), FormProvas (provas e matérias), LayoutAuth (molde de login/cadastro), PainelFiltros (filtros da busca), Icone, Campo (formulário com erro), Chip
  context/            AuthContext (login, cadastro e sessão com token JWT), EditaisContext (lista de editais da API)
  services/api.js     função chamarApi: única parte do front que conversa com o back-end
  data/editais.js     editais de exemplo e funções de formatação (datas, dinheiro, taxa)
  pages/              Login, Cadastro, Busca, EditalDetalhe, NovoEdital (criar e alterar), GerenciarEditais
  styles/             tokens.css (paleta C) e global.css
scripts/
  enviarEditais.js    envia os editais de exemplo para o banco, pela API
```

## Rotas da API usadas pelo front

| Ação               | Rota                      | Quem pode |
| ------------------ | ------------------------- | --------- |
| Entrar             | `POST /api/auth/login`    | todos     |
| Criar conta        | `POST /api/auth/register` | todos     |
| Recuperar a sessão | `GET /api/auth/me`        | logado    |
| Listar editais     | `GET /api/editais`        | logado    |
| Criar edital       | `POST /api/editais`       | admin     |
| Alterar edital     | `PUT /api/editais/:id`    | admin     |
| Remover edital     | `DELETE /api/editais/:id` | admin     |

## Qualidade de código e hospedagem

- `npm run lint`: confere o código com o ESLint.
- `npm run format`: padroniza o formato com o Prettier.
- `vercel.json`: faz as rotas do React Router funcionarem ao abrir um endereço direto na Vercel (sem erro 404).

## Acessibilidade e usabilidade (RNF01 e RNF03)

- Contraste mínimo de 4,5:1 em todos os textos (paleta C).
- Campos com rótulo, mensagem de erro específica e `aria-invalid`.
- Foco visível no teclado e botões com texto, sem depender só de cor.
- Layout responsivo até telas de celular.
