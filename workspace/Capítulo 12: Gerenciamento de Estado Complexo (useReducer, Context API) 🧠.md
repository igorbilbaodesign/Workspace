# Capítulo 12: Gerenciamento de Estado Complexo (useReducer, Context API) 🌐

## 🌟 Introdução: Quando o Estado Cresce Além do Simples
O gerenciamento de estado em aplicações React não é apenas sobre armazenar valores — é sobre **orquestrar a coreografia complexa entre múltiplas partes da UI que precisam permanecer sincronizadas**. Enquanto `useState` resolve problemas locais e isolados, aplicações reais demandam sistemas de estado que coordenam componentes distantes, gerenciam transições complexas e mantêm consistência em toda a aplicação.

Historicamente, bibliotecas como Redux dominavam este espaço. Hoje, com `useReducer` e Context API nativos, podemos construir sistemas sofisticados de gerenciamento de estado sem dependências externas, mantendo a filosofia declarativa do React em escala.

---

## 🎯 Por que useState Não é Suficiente para Aplicações Reais?

1.  **🧩 Estado Interdependente:** Quando mudar um valor requer atualizar múltiplos outros valores simultaneamente
2.  **🌍 Estado Global:** Dados que precisam ser acessados por componentes em extremos opostos da árvore
3.  **🔄 Transições Complexas:** Lógica de atualização que envolve múltiplos passos ou condições
4.  **📦 Prop Drilling:** Passar props através de 5+ níveis de componentes (um sinal claro de que algo está errado)
5.  **🎭 Estado Derivado:** Valores que são calculados a partir de múltiplas fontes de estado
6.  **⏱️ Ações Assíncronas Coordenadas:** Operações que envolvem múltiplas etapas (loading, success, error)

---

## 🧠 useReducer: O Poder da Previsibilidade

### 🔄 Do useState ao useReducer: Uma Evolução Natural
`useReducer` não é uma ferramenta diferente — é `useState` elevado à enésima potência. Enquanto `useState` lida com valores isolados, `useReducer` lida com **sistemas de estado complexos**.

**Analogia:** Se `useState` é como ter várias caixas soltas, `useReducer` é como ter um sistema de arquivamento organizado.

### 🎯 O Padrão Reducer Desmistificado
Um reducer é uma **função pura** que recebe:
1. O estado atual
2. Uma ação (objeto que descreve "o que aconteceu")
3. Retorna o próximo estado

```javascript
// Estrutura mental (não código)
(state, action) => newState
```

### ⚡ Por que Reducers são Poderosos?
1. **Previsibilidade:** Dado o mesmo estado e ação, sempre produz o mesmo próximo estado
2. **Testabilidade:** Funções puras são trivialmente testáveis
3. **Rastreabilidade:** Cada mudança de estado é documentada por uma ação específica
4. **Centralização:** Toda a lógica de atualização vive em um único lugar

### 🎭 Os Três Componentes do Sistema useReducer

**1. Estado Inicial:** A "foto" inicial do seu estado
```javascript
const estadoInicial = {
  usuarios: [],
  carregando: false,
  erro: null,
  filtro: 'ativos',
  paginaAtual: 1
};
```

**2. Ações:** Eventos nomeados que descrevem "o que aconteceu"
```javascript
// Padrão Flux Standard Action
{
  type: 'USUARIOS_CARREGADOS',  // Obrigatório: nome da ação
  payload: [...],                // Opcional: dados da ação
  meta: {                        // Opcional: metadados
    timestamp: Date.now(),
    origem: 'API'
  }
}
```

**3. Reducer:** O "cérebro" que processa ações
```javascript
function reducer(estado, acao) {
  switch (acao.type) {
    case 'CARREGAMENTO_INICIADO':
      return { ...estado, carregando: true, erro: null };
    
    case 'USUARIOS_CARREGADOS':
      return {
        ...estado,
        carregando: false,
        usuarios: acao.payload,
        erro: null
      };
    
    case 'ERRO_CARREGAMENTO':
      return {
        ...estado,
        carregando: false,
        erro: acao.payload
      };
    
    default:
      // IMPORTANTE: Sempre retorne o estado atual para ações desconhecidas
      return estado;
  }
}
```

### 🏗️ Padrões Avançados de Reducers

**Reducers Aninhados (Reducer Composition):**
```javascript
// Em vez de um reducer gigante, divida por domínio
function rootReducer(estado, acao) {
  return {
    usuarios: usuariosReducer(estado.usuarios, acao),
    ui: uiReducer(estado.ui, acao),
    autenticacao: authReducer(estado.autenticacao, acao)
  };
}
```

**Reducers com Efeitos Colaterais Controlados:**
```javascript
// Padrão "reducer com efeitos"
function reducerComEfeitos(estado, acao) {
  const [proximoEstado, efeitos] = reducerPuro(estado, acao);
  
  // Executar efeitos colaterais
  efeitos.forEach(efeito => {
    if (efeito.type === 'FETCH_USUARIOS') {
      buscarUsuarios(efeito.payload).then(usuarios => {
        dispatch({ type: 'USUARIOS_CARREGADOS', payload: usuarios });
      });
    }
  });
  
  return proximoEstado;
}
```

---

## 🌐 Context API: Compartilhamento de Estado sem Caos

### 🔄 A Evolução do Compartilhamento de Estado

**Geração 1 - Prop Drilling:**
```javascript
// ❌ O inferno dos props através de 5+ componentes
<App>
  <Header usuario={usuario}>
    <Nav usuario={usuario}>
      <UserMenu usuario={usuario}>
        <Avatar usuario={usuario}/>
```

**Geração 2 - Context API:**
```javascript
// ✅ Um provider, consumo em qualquer profundidade
<UsuarioProvider>
  <App>
    <Header>
      <Nav>
        <UserMenu>
          <Avatar/> {/* Acessa contexto diretamente */}
```

### 🎯 Quando Usar Context (e Quando Não Usar)

**Use Context para:**
- Tema (dark/light mode)
- Preferências do usuário (idioma, configurações)
- Autenticação (usuário atual, tokens)
- Dados compartilhados por muitas partes da app
- Estado "global" da aplicação

**NÃO use Context para:**
- Estado que muda frequentemente (causa re-renders em massa)
- Dados de formulário localizados
- Estado que pertence a um componente e seus filhos imediatos
- Substituição para comunicação pai-filho apropriada

### 🏗️ Padrões de Implementação de Context

**Padrão 1: Provider Simples**
```javascript
const TemaContext = React.createContext();

function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');
  
  const alternarTema = () => {
    setTema(temaAtual => temaAtual === 'claro' ? 'escuro' : 'claro');
  };
  
  const valor = { tema, alternarTema };
  
  return (
    <TemaContext.Provider value={valor}>
      {children}
    </TemaContext.Provider>
  );
}
```

**Padrão 2: Contexto com useReducer (Padrão Redux-like)**
```javascript
const EstadoGlobalContext = React.createContext();
const DispatchContext = React.createContext();

function GlobalProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);
  
  return (
    <EstadoGlobalContext.Provider value={estado}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </EstadoGlobalContext.Provider>
  );
}

// Hook personalizado para acesso fácil
function useGlobalEstado() {
  const estado = useContext(EstadoGlobalContext);
  if (estado === undefined) {
    throw new Error('useGlobalEstado deve ser usado dentro de GlobalProvider');
  }
  return estado;
}

function useDispatch() {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error('useDispatch deve ser usado dentro de GlobalProvider');
  }
  return dispatch;
}
```

### ⚡ Otimização de Performance com Context

**Problema:** Contexto causa re-render de todos os consumidores quando o valor muda

**Solução 1: Contextos Divididos**
```javascript
// ❌ Um contexto gigante
<AppContext.Provider value={{ usuario, tema, configs, notificacoes }}>
  {/* Tudo re-render quando qualquer coisa muda */}

// ✅ Múltiplos contextos específicos
<UsuarioProvider>
  <TemaProvider>
    <ConfigsProvider>
      <NotificacoesProvider>
        {/* Cada componente consome apenas o que precisa */}
```

**Solução 2: Memoização do Valor do Contexto**
```javascript
function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');
  
  // useMemo para evitar nova referência a cada render
  const valor = useMemo(() => ({
    tema,
    alternarTema: () => setTema(t => t === 'claro' ? 'escuro' : 'claro')
  }), [tema]); // Só recria quando tema muda
  
  return (
    <TemaContext.Provider value={valor}>
      {children}
    </TemaContext.Provider>
  );
}
```

---

## 🔗 A Fusão Perfeita: useReducer + Context API

### 🏗️ Arquitetura para Aplicações Médias/Grandes

```javascript
// 1. Definições de Ações (actionTypes.js)
export const ActionTypes = {
  USUARIO_LOGIN: 'USUARIO_LOGIN',
  USUARIO_LOGOUT: 'USUARIO_LOGOUT',
  TEMA_ALTERAR: 'TEMA_ALTERAR',
  NOTIFICACAO_ADD: 'NOTIFICACAO_ADD',
  NOTIFICACAO_REMOVE: 'NOTIFICACAO_REMOVE'
};

// 2. Reducers (appReducer.js)
function appReducer(estado, acao) {
  switch (acao.type) {
    case ActionTypes.USUARIO_LOGIN:
      return {
        ...estado,
        usuario: acao.payload,
        autenticado: true
      };
    
    case ActionTypes.TEMA_ALTERAR:
      return {
        ...estado,
        tema: acao.payload,
        ultimaAlteracaoTema: Date.now()
      };
    
    // ... outros casos
    
    default:
      return estado;
  }
}

// 3. Contexto e Provider (AppContext.js)
const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

export function AppProvider({ children }) {
  const [estado, dispatch] = useReducer(appReducer, estadoInicial);
  
  // Otimização: memoize o valor do contexto
  const contextoEstado = useMemo(() => estado, [estado]);
  
  return (
    <AppStateContext.Provider value={contextoEstado}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// 4. Hooks personalizados para consumo
export function useAppEstado() {
  const contexto = useContext(AppStateContext);
  if (!contexto) {
    throw new Error('useAppEstado deve ser usado dentro de AppProvider');
  }
  return contexto;
}

export function useAppDispatch() {
  const contexto = useContext(AppDispatchContext);
  if (!contexto) {
    throw new Error('useAppDispatch deve ser usado dentro de AppProvider');
  }
  return contexto;
}

// 5. Action Creators (opcional, mas recomendado)
export function loginUsuario(usuario) {
  return {
    type: ActionTypes.USUARIO_LOGIN,
    payload: usuario
  };
}
```

### 🎯 Consumo na Aplicação
```javascript
function ComponenteQualquer() {
  // Acessa apenas o estado que precisa
  const { tema, usuario } = useAppEstado();
  const dispatch = useAppDispatch();
  
  const handleLogin = () => {
    // Usando action creator
    dispatch(loginUsuario({ nome: 'João', id: 1 }));
  };
  
  return (
    <div className={`app ${tema}`}>
      <p>Olá, {usuario?.nome}</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

---

## ⚠️ Armadilhas Comuns do Gerenciamento de Estado Avançado

### ❌ Contexto Como Estado de Alta Frequência
```javascript
// ❌ ANTI-PATTERN: Contexto com estado que muda a cada tecla pressionada
const InputContext = React.createContext();

function FormProvider({ children }) {
  const [valor, setValor] = useState('');
  
  return (
    <InputContext.Provider value={{ valor, setValor }}>
      {children} {/* TUDO re-render a cada tecla! */}
    </InputContext.Provider>
  );
}

// ✅ SOLUÇÃO: useState local ou bibliotecas otimizadas como Zustand/Recoil
```

### ❌ Reducers Gigantes e Indomáveis
```javascript
// ❌ ANTI-PATTERN: Um reducer com 50+ cases
function reducerMonolitico(estado, acao) {
  switch (acao.type) {
    case 'CASE_1': /* ... */
    case 'CASE_2': /* ... */
    // ... 48 casos mais
    case 'CASE_50': /* ... */
  }
}

// ✅ SOLUÇÃO: Combine reducers ou use Redux Toolkit
function rootReducer(estado, acao) {
  return {
    usuarios: usuariosReducer(estado.usuarios, acao),
    produtos: produtosReducer(estado.produtos, acao),
    // ...
  };
}
```

### ❌ Sobrecarga de Re-renders
```javascript
// ❌ PROBLEMA: Componente re-render mesmo quando não precisa
function ComponenteCaro({ usuario, tema, configs }) {
  // Recebe todas as props mesmo que só use uma
  
  return <div>{usuario.nome}</div>;
}

// ✅ SOLUÇÃO: Consumir apenas o contexto necessário ou usar selectores
function ComponenteOtimizado() {
  // Consome apenas o que precisa
  const usuario = useUsuario(); // Hook específico
  return <div>{usuario.nome}</div>;
}
```

---

## 🎯 Quando Escolher Cada Abordagem

### **Escolha useState quando:**
- Estado é local ao componente
- Lógica de atualização é simples
- Não precisa ser compartilhado profundamente
- Componente é isolado e reutilizável

### **Escolha useReducer quando:**
- Estado tem estrutura complexa (objetos/aninhados)
- Próximo estado depende do anterior
- Lógica de atualização é complexa
- Precisa de ações nomeadas para rastreabilidade
- Quer separar lógica de atualização do componente

### **Escolha Context API quando:**
- Estado precisa ser compartilhado por muitos componentes
- Quer evitar prop drilling
- Tem dados "globais" (tema, autenticação, configurações)
- Componentes precisam reagir a mudanças de estado global

### **Escolha Bibliotecas Externas (Zustand, Redux) quando:**
- Estado é muito complexo e distribuído
- Precisa de middleware (logging, async actions)
- Tem problemas de performance com Context
- Precisa de ferramentas de debugging avançadas
- Equipe grande com padrões estabelecidos

---

## 🧪 Testando Sistemas de Estado Complexo

### **Testando Reducers (Fácil):**
```javascript
test('reducer deve lidar com LOGIN_USUARIO', () => {
  const estadoInicial = { usuario: null, autenticado: false };
  const acao = { type: 'LOGIN_USUARIO', payload: { id: 1, nome: 'João' } };
  
  const resultado = reducer(estadoInicial, acao);
  
  expect(resultado.usuario).toEqual({ id: 1, nome: 'João' });
  expect(resultado.autenticado).toBe(true);
});
```

### **Testando Contexto:**
```javascript
test('Provider deve fornecer estado e dispatch', () => {
  const TestComponent = () => {
    const estado = useAppEstado();
    const dispatch = useAppDispatch();
    // Verificações...
    return null;
  };
  
  render(
    <AppProvider>
      <TestComponent />
    </AppProvider>
  );
});
```

---

## 🚀 Próxima Evolução: Bibliotecas Modernas

### **Por que Algumas Pessoas Vão Além do Context:**
1. **Zustand:** Estado global com menos boilerplate, ótima performance
2. **Recoil:** Estado atômico com selectors poderosos (Facebook)
3. **Jotai:** Estado atômico inspirado no Recoil, mais simples
4. **Redux Toolkit:** Redux modernizado com menos código

### **A Regra de Ouro:**
Comece com useState, evolua para useReducer + Context quando necessário, e considere bibliotecas externas apenas quando essas soluções nativas se provarem insuficientes.

---

> **"Gerenciamento de estado avançado não é sobre usar a ferramenta mais complexa, mas sobre escolher a ferramenta certa para a complexidade real do seu problema. useState resolve 80% dos casos, useReducer + Context resolve 15%, e bibliotecas externas resolvem os 5% restantes."**

**Próximo Passo:** Pegue um projeto existente com useState e identifique:
1. Onde há prop drilling (3+ níveis)
2. Onde a lógica de atualização de estado é complexa
3. Onde múltiplos componentes precisam do mesmo estado

Refatore gradualmente, começando pelos pontos mais dolorosos. Lembre-se: não precisa reescrever tudo de uma vez. A migração incremental é seu amigo.