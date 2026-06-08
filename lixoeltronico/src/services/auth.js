import api from './api';

const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export async function loginRequest(email, senha) {
  if (useMock) {
    // return a fake token and user
    return { token: 'mock-token-' + Date.now(), user: { id: 1, nome: 'Usuário Mock', email, role: 'CIDADAO', pontos: 0 } };
  }
  const resp = await api.post('/auth/login', { email, senha });
  return resp.data;
}

export async function registerRequest(nome, email, senha) {
  if (useMock) {
    return { id: Date.now(), nome, email, role: 'CIDADAO' };
  }
  const resp = await api.post('/auth/register', { nome, email, senha });
  return resp.data;
}
