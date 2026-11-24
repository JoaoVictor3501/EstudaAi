# EstudaAí

Plataforma que deixa os editais de concursos públicos mais fáceis de entender: em vez de ler
um PDF enorme, a pessoa vê um resumo visual com datas, vagas, salários, taxa, local da prova
e as matérias que mais valem na nota.

**Site no ar:** https://estudaai-ifpr.vercel.app

## Organização do repositório

Tudo fica na branch `main`, com o front-end e o back-end em pastas separadas:

```
frontend/   site em React + Vite (publicado na Vercel)
backend/    API em Node.js + Express + MongoDB (publicada no Render)
```

Cada pasta tem o seu próprio `package.json`, então os comandos são rodados dentro dela.

## Front-end (pasta `frontend`)

```bash
cd frontend
npm install
npm run dev
```

Abre em http://localhost:5173. Mais detalhes em [frontend/README.md](frontend/README.md).

**Vercel:** o projeto usa `frontend` como **Root Directory** (Settings > Build and Deployment).
O arquivo `frontend/vercel.json` já configura o Vite e as rotas.

## Back-end (pasta `backend`)

```bash
cd backend
npm install
npm run dev
```

Precisa de um arquivo `backend/.env` com as variáveis do banco e a porta (ele não vai para o
GitHub, está no `.gitignore`).

**Render:** o serviço usa `backend` como **Root Directory**, `npm install` como Build Command e
`node server.js` como Start Command. As variáveis do `.env` são cadastradas no painel do Render.

## Como trabalhar em grupo

- Todo mundo trabalha na branch `main`.
- Antes de começar, baixe as novidades: `git pull`.
- Mexa só na sua pasta (`frontend` ou `backend`) para evitar conflitos.
- A cada `git push` na `main`, a Vercel e o Render atualizam sozinhos.
