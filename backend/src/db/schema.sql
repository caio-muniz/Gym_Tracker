-- Tabelas usadas pelo Gym Tracker

-- Usuarios do sistema (login/cadastro)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Treinos
CREATE TABLE IF NOT EXISTS treinos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(20),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Exercicios
CREATE TABLE IF NOT EXISTS exercicios (
    id SERIAL PRIMARY KEY,
    treino_id INTEGER NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    series INTEGER NOT NULL,
    repeticoes INTEGER NOT NULL,
    carga_kg DOUBLE PRECISION NOT NULL
);

-- Historico de treinos concluidos
CREATE TABLE IF NOT EXISTS historico_treinos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    treino_id INTEGER REFERENCES treinos(id) ON DELETE SET NULL,
    nome_treino VARCHAR(255) NOT NULL,
    cor_treino VARCHAR(20),
    data_execucao TIMESTAMP NOT NULL DEFAULT NOW(),
    duracao_segundos INTEGER,
    volume_total_kg DOUBLE PRECISION
);

-- Historico de series executadas no treino
CREATE TABLE IF NOT EXISTS historico_series (
    id SERIAL PRIMARY KEY,
    historico_treino_id INTEGER NOT NULL REFERENCES historico_treinos(id) ON DELETE CASCADE,
    exercicio_nome VARCHAR(255) NOT NULL,
    numero_serie INTEGER NOT NULL,
    repeticoes INTEGER NOT NULL,
    carga_kg DOUBLE PRECISION NOT NULL
);

-- Conquistas
CREATE TABLE IF NOT EXISTS conquistas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    icone VARCHAR(10)
);

-- Conquistas desbloqueadas pelo usuario
CREATE TABLE IF NOT EXISTS usuario_conquistas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    conquista_id INTEGER NOT NULL REFERENCES conquistas(id) ON DELETE CASCADE,
    data_conquista TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (usuario_id, conquista_id)
);

-- Medidas corporais
CREATE TABLE IF NOT EXISTS registros_corpo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    peso_kg DOUBLE PRECISION
);