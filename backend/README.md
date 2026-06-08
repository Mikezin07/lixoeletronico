# backend

Node + Express backend com armazenamento em arquivos JSON (data/).

Instalação:

1. cd backend
2. npm install
3. cp .env.example .env (ajuste JWT_SECRET se desejar)
4. npm run dev

Observações:
- Endpoints principais: /auth, /pontos, /agendamentos
- Dados simulados em /data/*.json. O servidor lê e grava nesses arquivos.
