import { useEffect, useMemo, useState } from 'react'
import './App.css'

const points = [
  {
    id: 1,
    nome: 'EcoPonto Centro',
    endereco: 'Rua das Oficinas, 120 - Centro',
    horario: '08:00 às 18:00',
    categoria: 'celulares e notebooks',
  },
  {
    id: 2,
    nome: 'Cooperativa Verde',
    endereco: 'Av. das Palmeiras, 845 - Bairro Sul',
    horario: '09:00 às 17:00',
    categoria: 'cabos, fontes e periféricos',
  },
  {
    id: 3,
    nome: 'Tech Recicla Escola',
    endereco: 'Av. Técnica, 42 - Campus',
    horario: '07:30 às 12:00',
    categoria: 'pilhas, baterias e placas',
  },
]

const materials = ['Celulares', 'Baterias', 'Cabos', 'Monitores', 'Notebooks', 'Fontes']

const tips = [
  'Apague dados pessoais antes de entregar celulares e notebooks.',
  'Separe pilhas e baterias de outros eletrônicos.',
  'Nunca misture lixo eletrônico com lixo comum.',
  'Se o aparelho ainda funciona, considere doação antes do descarte.',
]

const steps = [
  'Localize o ponto de coleta mais próximo.',
  'Faça seu login ou cadastre-se na plataforma.',
  'Agende a entrega do material eletrônico.',
  'Acompanhe seus pontos e seus agendamentos.',
]

const storageKeys = {
  users: 'ewaste-users',
  schedules: 'ewaste-schedules',
  currentUser: 'ewaste-current-user',
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [users, setUsers] = useState(() => readStorage(storageKeys.users, []))
  const [schedules, setSchedules] = useState(() => readStorage(storageKeys.schedules, []))
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(storageKeys.currentUser, null),
  )
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [selectedPointId, setSelectedPointId] = useState(1)
  const [authMode, setAuthMode] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [material, setMaterial] = useState(materials[0])
  const [quantidade, setQuantidade] = useState(1)
  const [dataHora, setDataHora] = useState('')
  const [observacao, setObservacao] = useState('')
  const [scheduleMessage, setScheduleMessage] = useState('')

  useEffect(() => {
    const now = new Date()
    now.setHours(now.getHours() + 2)
    setDataHora(now.toISOString().slice(0, 16))
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKeys.users, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(storageKeys.schedules, JSON.stringify(schedules))
  }, [schedules])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKeys.currentUser, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(storageKeys.currentUser)
    }
  }, [currentUser])

  const filteredPoints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return points.filter((point) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [point.nome, point.endereco, point.categoria]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesFilter = filter === 'Todos' || point.categoria.includes(filter.toLowerCase())

      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  const selectedPoint =
    filteredPoints.find((point) => point.id === selectedPointId) || filteredPoints[0] || null

  const ranking = useMemo(() => {
    return users
      .map((user) => {
        const userSchedules = schedules.filter((schedule) => schedule.userEmail === user.email)
        const pontos = userSchedules.reduce((sum, schedule) => sum + schedule.pontos, 0)
        return { ...user, pontos, agendamentos: userSchedules.length }
      })
      .sort((a, b) => b.pontos - a.pontos)
  }, [schedules, users])

  const mySchedules = useMemo(() => {
    if (!currentUser) return []
    return schedules.filter((schedule) => schedule.userEmail === currentUser.email).slice().reverse()
  }, [currentUser, schedules])

  const totalRecoveredKg = useMemo(
    () => schedules.reduce((sum, schedule) => sum + schedule.peso, 0),
    [schedules],
  )

  useEffect(() => {
    if (!selectedPoint && filteredPoints.length > 0) {
      setSelectedPointId(filteredPoints[0].id)
    }
  }, [filteredPoints, selectedPoint])

  function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthMessage('')

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !senha) {
      setAuthMessage('Preencha email e senha.')
      return
    }

    if (authMode === 'register') {
      if (!nome.trim()) {
        setAuthMessage('Preencha o nome para registrar.')
        return
      }

      if (users.some((user) => user.email === normalizedEmail)) {
        setAuthMessage('Este email já está cadastrado.')
        return
      }

      const newUser = {
        id: Date.now(),
        nome: nome.trim(),
        email: normalizedEmail,
        senha,
      }

      setUsers((current) => [...current, newUser])
      setCurrentUser({ id: newUser.id, nome: newUser.nome, email: newUser.email, pontos: 0 })
      setAuthMessage('Conta criada com sucesso.')
      setNome('')
      setSenha('')
      return
    }

    const foundUser = users.find(
      (user) => user.email === normalizedEmail && user.senha === senha,
    )

    if (!foundUser) {
      setAuthMessage('Credenciais inválidas.')
      return
    }

    const userPoints = schedules
      .filter((schedule) => schedule.userEmail === foundUser.email)
      .reduce((sum, schedule) => sum + schedule.pontos, 0)

    setCurrentUser({
      id: foundUser.id,
      nome: foundUser.nome,
      email: foundUser.email,
      pontos: userPoints,
    })
    setAuthMessage('Login realizado com sucesso.')
    setSenha('')
  }

  function handleScheduleSubmit(event) {
    event.preventDefault()
    setScheduleMessage('')

    if (!currentUser) {
      setScheduleMessage('Faça login para criar um agendamento.')
      return
    }

    const selected = points.find((point) => point.id === selectedPointId) || points[0]
    const amount = Math.max(1, Number(quantidade) || 1)
    const earnedPoints = amount * 10

    const newSchedule = {
      id: Date.now(),
      pointId: selected.id,
      pointName: selected.nome,
      userEmail: currentUser.email,
      userName: currentUser.nome,
      material,
      quantidade: amount,
      dataHora,
      observacao,
      peso: amount * 0.4,
      pontos: earnedPoints,
      status: 'AGENDADO',
    }

    setSchedules((current) => [...current, newSchedule])
    setCurrentUser((user) => (user ? { ...user, pontos: (user.pontos || 0) + earnedPoints } : user))
    setScheduleMessage('Agendamento criado com sucesso.')
    setObservacao('')
    setQuantidade(1)
  }

  function handleLogout() {
    setCurrentUser(null)
    setAuthMessage('')
    setScheduleMessage('')
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Sustentabilidade com tecnologia</span>
          <h1>Plataforma funcional para descarte correto de lixo eletrônico.</h1>
          <p>
            Um site em React + Vite para localizar pontos de coleta, agendar entregas,
            registrar participação dos usuários e acompanhar o impacto ambiental do projeto.
          </p>

          <div className="hero-actions">
            <a href="#agendar" className="primary-link">
              Agendar coleta
            </a>
            <a href="#pontos" className="secondary-link">
              Ver pontos
            </a>
          </div>

          <div className="hero-stats">
            <article>
              <strong>{filteredPoints.length}</strong>
              <span>pontos visíveis</span>
            </article>
            <article>
              <strong>{schedules.length}</strong>
              <span>agendamentos</span>
            </article>
            <article>
              <strong>{totalRecoveredKg.toFixed(1)} kg</strong>
              <span>estimados em recuperação</span>
            </article>
          </div>
        </div>

        <aside className="hero-card">
          <h2>Pilhas, cabos, celulares e notebooks</h2>
          <p>
            Esta interface resolve o problema principal do projeto: transformar lixo eletrônico
            em um fluxo organizado, rastreável e fácil de usar.
          </p>
          <ul className="material-list">
            {materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </header>

      <main className="content-grid">
        <section className="content-card" id="como-funciona">
          <div className="section-head">
            <span className="section-label">Como funciona</span>
            <h2>Fluxo simples para uso escolar, comunitário ou do TCC</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step}>
                <span className="step-index">0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-grid">
          <article className="content-card" id="pontos">
            <div className="section-head">
              <span className="section-label">Pontos de coleta</span>
              <h2>Locais disponíveis na plataforma</h2>
            </div>

            <div className="toolbar">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por ponto, bairro ou material"
              />
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option>Todos</option>
                <option>celulares</option>
                <option>cabos</option>
                <option>baterias</option>
              </select>
            </div>

            <div className="point-list">
              {filteredPoints.map((point) => (
                <button
                  type="button"
                  key={point.id}
                  className={`point-card ${selectedPointId === point.id ? 'active' : ''}`}
                  onClick={() => setSelectedPointId(point.id)}
                >
                  <strong>{point.nome}</strong>
                  <span>{point.endereco}</span>
                  <small>
                    {point.horario} · {point.categoria}
                  </small>
                </button>
              ))}
              {filteredPoints.length === 0 && <p className="empty-state">Nenhum ponto encontrado.</p>}
            </div>

            {selectedPoint && (
              <div className="detail-box">
                <h3>Ponto selecionado</h3>
                <p>{selectedPoint.nome}</p>
                <span>{selectedPoint.endereco}</span>
              </div>
            )}
          </article>

          <article className="content-card" id="agendar">
            <div className="section-head">
              <span className="section-label">Agendamento</span>
              <h2>Criar uma entrega programada</h2>
            </div>

            <form className="form-stack" onSubmit={handleScheduleSubmit}>
              <label>
                Ponto de coleta
                <select
                  value={selectedPointId}
                  onChange={(event) => setSelectedPointId(Number(event.target.value))}
                >
                  {points.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Material principal
                <select value={material} onChange={(event) => setMaterial(event.target.value)}>
                  {materials.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Quantidade
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(event) => setQuantidade(event.target.value)}
                />
              </label>

              <label>
                Data e hora
                <input
                  type="datetime-local"
                  value={dataHora}
                  onChange={(event) => setDataHora(event.target.value)}
                />
              </label>

              <label>
                Observação
                <textarea
                  rows="4"
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  placeholder="Ex.: notebook com carregador, 2 cabos e 1 bateria"
                />
              </label>

              <button type="submit" className="primary-button">
                Criar agendamento
              </button>

              {scheduleMessage && <p className="notice">{scheduleMessage}</p>}
            </form>
          </article>
        </section>

        <section className="split-grid">
          <article className="content-card">
            <div className="section-head">
              <span className="section-label">Ranking</span>
              <h2>Usuários com mais pontos ambientais</h2>
            </div>

            <div className="ranking-list">
              {ranking.length > 0 ? (
                ranking.map((user, index) => (
                  <article className="ranking-card" key={user.email}>
                    <span>#{index + 1}</span>
                    <strong>{user.nome}</strong>
                    <small>
                      {user.pontos} pontos · {user.agendamentos} agendamentos
                    </small>
                  </article>
                ))
              ) : (
                <p className="empty-state">O ranking será preenchido após os agendamentos.</p>
              )}
            </div>
          </article>

          <article className="content-card">
            <div className="section-head">
              <span className="section-label">Acesso</span>
              <h2>Entrar ou registrar</h2>
            </div>

            {!currentUser ? (
              <form className="form-stack" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <label>
                    Nome
                    <input
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      placeholder="Seu nome"
                    />
                  </label>
                )}

                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@escola.com"
                  />
                </label>

                <label>
                  Senha
                  <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Sua senha"
                  />
                </label>

                <button type="submit" className="primary-button">
                  {authMode === 'login' ? 'Entrar' : 'Registrar'}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                >
                  {authMode === 'login' ? 'Criar conta' : 'Já tenho conta'}
                </button>

                {authMessage && <p className="notice">{authMessage}</p>}
              </form>
            ) : (
              <div className="user-panel">
                <p>
                  <strong>{currentUser.nome}</strong> está conectado.
                </p>
                <p>Email: {currentUser.email}</p>
                <p>Pontos acumulados: {currentUser.pontos || 0}</p>
                <button type="button" className="secondary-button" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}

            <div className="detail-box">
              <h3>Meus agendamentos</h3>
              {currentUser ? (
                mySchedules.length > 0 ? (
                  <div className="schedule-list">
                    {mySchedules.map((schedule) => (
                      <article className="schedule-card" key={schedule.id}>
                        <strong>{schedule.pointName}</strong>
                        <span>{schedule.dataHora}</span>
                        <small>
                          {schedule.material} · {schedule.quantidade} unidade(s) · {schedule.status}
                        </small>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">Nenhum agendamento realizado ainda.</p>
                )
              ) : (
                <p className="empty-state">Faça login para ver seus agendamentos.</p>
              )}
            </div>
          </article>
        </section>

        <section className="content-card tips-card">
          <div className="section-head">
            <span className="section-label">Boas práticas</span>
            <h2>Antes de descartar, faça isso</h2>
          </div>

          <ul className="tips-list">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
