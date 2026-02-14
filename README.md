 Versão em Português
 List-To-Do - Sistema de Gerenciamento de Tarefas

Uma aplicação moderna e completa para gerenciamento de tarefas com interface bonita e intuitiva. Construída com Node.js, PostgreSQL e JavaScript puro.
 Funcionalidades
Gerenciamento de Usuários

    Registro e autenticação de usuários

    Hash seguro de senhas com bcrypt

    Autenticação baseada em JWT

    Gerenciamento de sessão

Gerenciamento de Listas

    Criar múltiplas listas de tarefas

    Cores personalizáveis (6 opções)

    Descrições para listas

    Acompanhamento visual de progresso

    Editar e excluir listas

Gerenciamento de Tarefas

    Criar tarefas dentro das listas

    Prioridades (Baixa, Média, Alta)

    Datas de entrega

    Descrições detalhadas

    Marcar como concluída/não concluída

    Indicadores visuais de prioridade

    Ordenação automática (pendentes primeiro, por prioridade e data)

Recursos de UI/UX

    Design moderno com gradientes

    Layout responsivo (desktop e mobile)
    -animações e transições suaves

    Modais interativos para formulários

    Botão de ação flutuante

    Barras de progresso

    Listas codificadas por cores

    Notificações toast para feedback

    Estados vazios com mensagens úteis

Pilha Tecnológica
Backend

    Node.js - Ambiente de execução

    Express - Framework web

    PostgreSQL - Banco de dados

    JWT - Autenticação

    Bcrypt - Hash de senhas

    CORS - Compartilhamento de recursos

Frontend

    HTML5 - Estrutura

    CSS3 - Estilização moderna

    JavaScript puro - Sem frameworks

    Font Awesome - Ícones
     Versão em Português
 List-To-Do - Sistema de Gerenciamento de Tarefas

Uma aplicação moderna e completa para gerenciamento de tarefas com interface bonita e intuitiva. Construída com Node.js, PostgreSQL e JavaScript puro.
 Funcionalidades
Gerenciamento de Usuários

    Registro e autenticação de usuários

    Hash seguro de senhas com bcrypt

    Autenticação baseada em JWT

    Gerenciamento de sessão

Gerenciamento de Listas

    Criar múltiplas listas de tarefas

    Cores personalizáveis (6 opções)

    Descrições para listas

    Acompanhamento visual de progresso

    Editar e excluir listas

Gerenciamento de Tarefas

    Criar tarefas dentro das listas

    Prioridades (Baixa, Média, Alta)

    Datas de entrega

    Descrições detalhadas

    Marcar como concluída/não concluída

    Indicadores visuais de prioridade

    Ordenação automática (pendentes primeiro, por prioridade e data)

Recursos de UI/UX

    Design moderno com gradientes

    Layout responsivo (desktop e mobile)
    -animações e transições suaves

    Modais interativos para formulários

    Botão de ação flutuante

    Barras de progresso

    Listas codificadas por cores

    Notificações toast para feedback

    Estados vazios com mensagens úteis

 Pilha Tecnológica
Backend

    Node.js - Ambiente de execução

    Express - Framework web

    PostgreSQL - Banco de dados

    JWT - Autenticação

    Bcrypt - Hash de senhas

    CORS - Compartilhamento de recursos

Frontend

    HTML5 - Estrutura

    CSS3 - Estilização moderna

    JavaScript puro - Sem frameworks

    Font Awesome - Ícones
     Versão em Português
 List-To-Do - Sistema de Gerenciamento de Tarefas

Uma aplicação moderna e completa para gerenciamento de tarefas com interface bonita e intuitiva. Construída com Node.js, PostgreSQL e JavaScript puro.
 Funcionalidades
Gerenciamento de Usuários

    Registro e autenticação de usuários

    Hash seguro de senhas com bcrypt

    Autenticação baseada em JWT

    Gerenciamento de sessão

Gerenciamento de Listas

    Criar múltiplas listas de tarefas

    Cores personalizáveis (6 opções)

    Descrições para listas

    Acompanhamento visual de progresso

    Editar e excluir listas

Gerenciamento de Tarefas

    Criar tarefas dentro das listas

    Prioridades (Baixa, Média, Alta)

    Datas de entrega

    Descrições detalhadas

    Marcar como concluída/não concluída

    Indicadores visuais de prioridade

    Ordenação automática (pendentes primeiro, por prioridade e data)

Recursos de UI/UX

    Design moderno com gradientes

    Layout responsivo (desktop e mobile)
    -animações e transições suaves

    Modais interativos para formulários

    Botão de ação flutuante

    Barras de progresso

    Listas codificadas por cores

    Notificações toast para feedback

    Estados vazios com mensagens úteis

Pilha Tecnológica
Backend

    Node.js - Ambiente de execução

    Express - Framework web

    PostgreSQL - Banco de dados

    JWT - Autenticação

    Bcrypt - Hash de senhas

    CORS - Compartilhamento de recursos

Frontend

    HTML5 - Estrutura

    CSS3 - Estilização moderna

    JavaScript puro - Sem frameworks

    Font Awesome - Ícones

     Esquema do Banco de Dados
Tabela de Usuários

    id (SERIAL PRIMARY KEY)

    username (VARCHAR, UNIQUE)

    email (VARCHAR, UNIQUE)

    password_hash (VARCHAR)

    Timestamps (created_at, updated_at)

Tabela de Listas

    id (SERIAL PRIMARY KEY)

    user_id (Chave Estrangeira)

    title (VARCHAR)

    description (TEXT)

    color (VARCHAR)

    Timestamps

Tabela de Tarefas

    id (SERIAL PRIMARY KEY)

    list_id (Chave Estrangeira)

    title (VARCHAR)

    description (TEXT)

    priority (INTEGER 1-3)

    due_date (DATE)

    completed (BOOLEAN)

    completed_at (TIMESTAMP)

    Timestamps

 Endpoints da API
Autenticação

    POST /api/auth/register - Registrar novo usuário

    POST /api/auth/login - Login do usuário

Listas

    GET /api/lists - Obter todas as listas do usuário

    POST /api/lists - Criar nova lista

    PUT /api/lists/:id - Atualizar lista

    DELETE /api/lists/:id - Excluir lista

Tarefas

    GET /api/tasks/list/:listId - Obter tarefas de uma lista

    POST /api/tasks - Criar nova tarefa

    PUT /api/tasks/:id - Atualizar tarefa

    DELETE /api/tasks/:id - Excluir tarefa

