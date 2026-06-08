# Deploy rápido (frontend + backend)

Este repositório contém duas pastas principais:
- `lixoeltronico/` (frontend - React + Vite)
- `backend/` (Node + Express, armazenamento em arquivos JSON em `backend/data`)

Resumo rápido:

- Frontend: pode ser implantado no Vercel diretamente (build: `npm run build`).
- Backend: pode ser implantado no Render (Web Service) ou Railway (start: `npm start`).

Variáveis de ambiente necessárias:

- Para o backend (defina em Render/Railway):
  - `PORT` (opcional, default 4000)
  - `JWT_SECRET` (obrigatório em produção)

- Para o frontend (defina no Vercel > Environment Variables):
  - `VITE_API_BASE` — URL pública do backend (ex: `https://minha-api.onrender.com`)
  - `VITE_USE_MOCK_AUTH` — `true` ou `false`. Pode deixar `true` se quiser usar mock sem backend.

Passos mínimos (local):

1. Backend
   - cd backend
   - npm install
   - cp .env.example .env && edite `JWT_SECRET`
   - npm run dev

2. Frontend
   - cd lixoeltronico
   - npm install
   - (opcional) edite `.env` ou configure `VITE_API_BASE` no Vercel
   - npm run dev

Caveats e recomendações:

- O backend grava e lê arquivos em `backend/data/*.json`. Em plataformas com múltiplas instâncias (scale), isso não é persistente entre instâncias.
- Para produção, prefira migrar para um banco (SQLite/Postgres) ou usar um armazenamento central (S3) / montar um volume persistente.
- Configure um `JWT_SECRET` forte em produção.
