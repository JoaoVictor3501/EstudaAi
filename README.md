# EstudaAí - Front-end

Front-end do EstudaAí (React + Vite + React Router), com as telas dos requisitos essenciais da Atividade 3.1: RF01, RF02, RF09 e RF12.

Por enquanto os dados são de exemplo (sem back-end). As trocas para a API estão marcadas com comentários `Depois:` nos arquivos de `src/context`.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

## Contas de teste

| Perfil        | E-mail             | Senha  |
| ------------- | ------------------ | ------ |
| Concurseiro   | aluno@estudaai.com | 123456 |
| Administrador | admin@estudaai.com | 123456 |

Ao criar uma conta nova, e-mails que começam com `admin` entram como administrador (regra provisória até o back-end existir).

## Telas

| Rota                  | Tela                                                  | Requisito   | Incremento |
| --------------------- | ----------------------------------------------------- | ----------- | ---------- |
| `/login`              | Login                                                 | RF01        | 1          |
| `/cadastro`           | Criar conta                                           | RF01        | 1          |
| `/admin/editais/novo` | Cadastro de edital por disciplina e tópico (só admin) | RF02        | 2          |
| `/editais`            | Busca com termo, categoria e filtros avançados        | RF09        | 3          |
| `/editais/:id`        | Edital com disciplinas, tópicos e materiais           | RF02 e RF12 | 2 e 4      |

## Estrutura

```
src/
  main.jsx            entrada e provedores
  App.jsx             rotas e proteção de telas
  assets/             logo do EstudaAí e ícones (assets/icones)
  components/         MenuLateral (navegação e sair), LayoutAuth (molde de login/cadastro), PainelFiltros (filtros da busca), Icone, Campo (formulário com erro), Chip
  context/            AuthContext (login simulado), EditaisContext (lista em memória)
  data/editais.js     dados de exemplo
  pages/              Login, Cadastro, Busca, EditalDetalhe, NovoEdital
  styles/             tokens.css (paleta C) e global.css
```

## O que trocar quando o back-end estiver pronto

1. `AuthContext.jsx`: `login` e `cadastrar` passam a chamar `POST /api/auth/login` e `POST /api/auth/register` e guardar o token JWT.
2. `EditaisContext.jsx`: carregar os editais com `GET /api/editais` e salvar com `POST /api/editais`.
3. `data/editais.js`: pode ser removido (restam só as listas de categorias e níveis).

## Qualidade de código e hospedagem

- `npm run lint`: confere o código com o ESLint.
- `npm run format`: padroniza o formato com o Prettier.
- `vercel.json`: faz as rotas do React Router funcionarem ao abrir um endereço direto na Vercel (sem erro 404).

## Acessibilidade e usabilidade (RNF01 e RNF03)

- Contraste mínimo de 4,5:1 em todos os textos (paleta C).
- Campos com rótulo, mensagem de erro específica e `aria-invalid`.
- Foco visível no teclado e botões com texto, sem depender só de cor.
- Layout responsivo até telas de celular.
