# Capítulo 13: Roteamento com react-router-dom 🧭

## 🌟 Introdução: A Ilusão de Múltiplas Páginas em uma SPA
O roteamento em React não é apenas sobre navegar entre URLs — é sobre **gerenciar a ilusão de múltiplas páginas dentro de uma única aplicação**, mantendo a experiência instantânea e fluida que caracteriza as Single Page Applications (SPAs). Enquanto aplicações tradicionais recarregam a página a cada navegação, o roteamento no React permite transições instantâneas, estado persistente e uma experiência de usuário cinematográfica.

Historicamente, aplicações web eram coleções de arquivos HTML separados. Hoje, com bibliotecas como react-router-dom, podemos construir aplicações que se sentem nativas, com navegação rápida, histórico manipulável e URLs que refletem o estado da aplicação sem recarregamentos.

---

## 🎯 Por que o Roteamento é Essencial em SPAs?

1.  **🌐 URLs Significativas:** Cada estado importante da aplicação tem um endereço único, permitindo bookmark, compartilhamento e SEO.
2.  **⚡ Transições Instantâneas:** Navegação sem recarregamento de página, mantendo estado e melhorando a percepção de performance.
3.  **📱 Experiência Nativa:** Gestos como voltar/avançar do navegador funcionam perfeitamente, assim como em apps nativos.
4.  **🔒 Navegação Protegida:** Controle de acesso baseado em rotas (autenticação, permissões).
5.  **🎭 Code Splitting:** Carregar apenas o código necessário para cada rota, melhorando performance inicial.
6.  **🧩 Composição Modular:** Cada rota pode ser tratada como um módulo independente da aplicação.

---

## 🧱 Os Pilares do react-router-dom

### 🔄 A Mentalidade do Roteamento Declarativo
Assim como React usa JSX para declarar UI de forma declarativa, react-router-dom usa componentes para declarar rotas:

**Antes (configuração imperativa):**
```javascript
if (window.location.pathname === '/sobre') {
  renderizarPaginaSobre();
}
```

**Depois (configuração declarativa):**
```jsx
<Route path="/sobre" element={<Sobre />} />
```

### 🏗️ A Arquitetura Hierárquica de Rotas
O roteamento no React segue a mesma filosofia de composição que os componentes:

```
<BrowserRouter>           ← Container do roteamento (gerencia histórico)
  <Routes>                ← Container de rotas (define o escopo)
    <Route path="/" />    ← Rota individual (mapeia URL para elemento)
    <Route path="/sobre" />
  </Routes>
</BrowserRouter>
```

---

## 🚀 Configuração Básica: Do Zero ao Roteamento

### 1. **Envolvendo a Aplicação com BrowserRouter**
```jsx
// index.js ou App.js
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

### 2. **Definindo Rotas com Routes e Route**
```jsx
// App.js
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/contato" element={<Contato />} />
    </Routes>
  );
}
```

### 3. **Navegando Entre Rotas**
```jsx
// Componente de navegação
import { Link, NavLink } from 'react-router-dom';

function Navegacao() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink to="/sobre" className={({ isActive }) => isActive ? 'ativo' : ''}>
        Sobre
      </NavLink>
      <Link to="/contato">Contato</Link>
    </nav>
  );
}
```

---

## 🎯 Diferença entre Link e NavLink

### **Link:**
- Navegação básica entre rotas
- Não sabe se a rota está ativa
- Usado para navegação geral

### **NavLink:**
- Sabe quando a rota está ativa
- Aceita função ou classe para estilização condicional
- Ideal para menus de navegação

```jsx
<NavLink 
  to="/dashboard"
  className={({ isActive }) => 
    `nav-link ${isActive ? 'active' : ''}`
  }
  style={({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal'
  })}
>
  Dashboard
</NavLink>
```

---

## 🧩 Rotas Dinâmicas e Parâmetros

### **Capturando Parâmetros da URL**
```jsx
// Rota com parâmetro dinâmico
<Route path="/usuarios/:id" element={<UsuarioDetalhes />} />

// No componente UsuarioDetalhes:
import { useParams } from 'react-router-dom';

function UsuarioDetalhes() {
  const { id } = useParams(); // Captura o :id da URL
  // Buscar dados do usuário com este id
}
```

### **Múltiplos Parâmetros e Segmentos Opcionais**
```jsx
<Route path="/produtos/:categoria/:id?" element={<Produtos />} />
// /produtos/eletronicos → categoria="eletronicos", id=undefined
// /produtos/eletronicos/123 → categoria="eletronicos", id="123"
```

### **Rotas Coringa (Catch-all)**
```jsx
<Route path="/docs/*" element={<Documentacao />} />
// /docs/getting-started → captura "getting-started"
// /docs/api/v1/users → captura "api/v1/users"
```

---

## 🔄 Navegação Programática

### **useNavigate: A Evolução do useHistory**
```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      await fazerLogin(credenciais);
      navigate('/dashboard'); // Navegação simples
      navigate('/dashboard', { replace: true }); // Substitui no histórico
      navigate(-1); // Volta uma página
      navigate('/dashboard', { state: { fromLogin: true } }); // Passa estado
    } catch (erro) {
      navigate('/login', { state: { erro: 'Falha no login' } });
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* ... */}
    </form>
  );
}
```

### **Passando Estado entre Rotas**
```jsx
// Navegando com estado
navigate('/detalhes', {
  state: {
    produto: produtoSelecionado,
    origem: 'lista-de-produtos'
  }
});

// Acessando o estado na rota de destino
import { useLocation } from 'react-router-dom';

function DetalhesProduto() {
  const location = useLocation();
  const { produto, origem } = location.state || {};
}
```

---

## 🛡️ Rotas Protegidas (Autenticação)

### **Padrão de Componente de Rota Protegida**
```jsx
function RotaProtegida({ children }) {
  const autenticado = useAutenticacao();
  const location = useLocation();
  
  if (!autenticado) {
    // Redireciona para login, guardando a rota original
    return <Navigate to="/login" state={{ de: location.pathname }} replace />;
  }
  
  return children;
}

// Uso
<Route
  path="/dashboard"
  element={
    <RotaProtegida>
      <Dashboard />
    </RotaProtegida>
  }
/>
```

### **Padrão de Wrapper com Permissões**
```jsx
function RequerPermissao({ children, permissao }) {
  const { usuario } = useAutenticacao();
  const location = useLocation();
  
  if (!usuario?.permissoes?.includes(permissao)) {
    return <Navigate to="/acesso-negado" state={{ de: location.pathname }} replace />;
  }
  
  return children;
}

// Uso
<Route
  path="/admin"
  element={
    <RequerPermissao permissao="admin">
      <AdminDashboard />
    </RequerPermissao>
  }
/>
```

---

## 🧩 Rotas Aninhadas (Layouts Hierárquicos)

### **Padrão de Layout Compartilhado**
```jsx
// App.js
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="sobre" element={<Sobre />} />
    <Route path="contato" element={<Contato />} />
  </Route>
</Routes>

// Layout.js
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="layout">
      <Cabecalho />
      <main>
        <Outlet /> {/* As rotas filhas renderizam aqui */}
      </main>
      <Rodape />
    </div>
  );
}
```

### **Rotas Aninhadas com Múltiplos Níveis**
```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="perfil" element={<Perfil />} />
  <Route path="configuracoes" element={<Configuracoes />}>
    <Route path="conta" element={<Conta />} />
    <Route path="privacidade" element={<Privacidade />} />
  </Route>
</Route>
```

---

## ⚡ Rotas com Lazy Loading (Code Splitting)

### **Carregamento Preguiçoso de Componentes**
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Contato = lazy(() => import('./pages/Contato'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </Suspense>
  );
}
```

### **Fallbacks Granulares por Rota**
```jsx
<Suspense fallback={<CarregamentoGeral />}>
  <Routes>
    <Route path="/" element={
      <Suspense fallback={<CarregamentoHome />}>
        <Home />
      </Suspense>
    } />
    <Route path="/dashboard/*" element={
      <Suspense fallback={<CarregamentoDashboard />}>
        <Dashboard />
      </Suspense>
    } />
  </Routes>
</Suspense>
```

---

## 🔍 Hooks de Roteamento Essenciais

### **1. useLocation: Acessando Informações da URL**
```jsx
import { useLocation } from 'react-router-dom';

function AnalyticsTracker() {
  const location = useLocation();
  
  useEffect(() => {
    registrarPageview(location.pathname);
  }, [location]);
  
  return null;
}
```

### **2. useSearchParams: Trabalhando com Query Strings**
```jsx
import { useSearchParams } from 'react-router-dom';

function ListaProdutos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = searchParams.get('pagina') || '1';
  const ordenar = searchParams.get('ordenar') || 'nome';
  
  const mudarPagina = (novaPagina) => {
    setSearchParams({ pagina: novaPagina, ordenar });
  };
  
  return (
    <div>
      <button onClick={() => mudarPagina(Number(pagina) + 1)}>
        Próxima Página
      </button>
    </div>
  );
}
```

### **3. useRouteMatch (v5) → useMatch (v6)**
```jsx
// Verificando se a rota atual corresponde a um padrão
import { useMatch } from 'react-router-dom';

function ItemMenu({ to, children }) {
  const match = useMatch(to);
  const ativo = Boolean(match);
  
  return (
    <li className={ativo ? 'ativo' : ''}>
      {children}
    </li>
  );
}
```

---

## ⚠️ Armadilhas Comuns e Soluções

### ❌ **Rotas em Ordem Incorreta**
```jsx
// ❌ ORDEM ERRADA
<Routes>
  <Route path="/usuarios/:id" element={<UsuarioDetalhes />} />
  <Route path="/usuarios/novo" element={<NovoUsuario />} />
  {/* /usuarios/novo será capturado por :id como "novo" */}
</Routes>

// ✅ ORDEM CORRETA (específico → geral)
<Routes>
  <Route path="/usuarios/novo" element={<NovoUsuario />} />
  <Route path="/usuarios/:id" element={<UsuarioDetalhes />} />
</Routes>
```

### ❌ **Esquecer o Index Route**
```jsx
// ❌ Falta rota para o path exato
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="perfil" element={<Perfil />} />
  {/* Falta: <Route index element={<DashboardHome />} /> */}
</Route>

// ✅ Com rota index
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="perfil" element={<Perfil />} />
</Route>
```

### ❌ **Navegação em Loops**
```jsx
// ❌ Loop de redirecionamento
useEffect(() => {
  if (!autenticado) {
    navigate('/login');
  }
}, [autenticado, navigate]);

// ✅ Condição de saída
useEffect(() => {
  if (!autenticado && location.pathname !== '/login') {
    navigate('/login', { state: { de: location.pathname } });
  }
}, [autenticado, navigate, location.pathname]);
```

---

## 🎨 Padrões Avançados de Roteamento

### **Rotas Baseadas em Permissões Dinâmicas**
```jsx
function RotasDinamicas() {
  const { usuario } = useAutenticacao();
  const rotas = useMemo(() => {
    const base = [
      { path: '/', element: <Home /> },
      { path: '/sobre', element: <Sobre /> }
    ];
    
    if (usuario?.admin) {
      base.push({ path: '/admin', element: <Admin /> });
    }
    
    return base;
  }, [usuario]);
  
  return (
    <Routes>
      {rotas.map(rota => (
        <Route key={rota.path} {...rota} />
      ))}
    </Routes>
  );
}
```

### **Roteamento com Transições**
```jsx
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function AppComTransicoes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Home />
          </motion.div>
        } />
        {/* ... outras rotas com transições */}
      </Routes>
    </AnimatePresence>
  );
}
```

---

## 🛠️ Estrutura de Projeto com Roteamento

```
src/
├── pages/                    ← Páginas (rotas de nível superior)
│   ├── Home/
│   ├── Sobre/
│   ├── Contato/
│   └── Dashboard/
│       ├── index.js         ← Dashboard (layout)
│       ├── Home/            ← /dashboard
│       ├── Perfil/          ← /dashboard/perfil
│       └── Configuracoes/   ← /dashboard/configuracoes
├── components/              ← Componentes compartilhados
├── layouts/                 ← Layouts de rota
│   ├── MainLayout/
│   └── DashboardLayout/
├── routers/                 ← Configuração de rotas
│   ├── AppRouter.js         ← Rotas principais
│   ├── PrivateRouter.js     ← Rotas protegidas
│   └── AdminRouter.js       ← Rotas administrativas
└── hooks/                   ← Hooks customizados
    └── useAuth.js
```

---

## 🧪 Testando Rotas

### **Testando Componentes com Dependências de Roteamento**
```jsx
// Configurando contexto de roteamento nos testes
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const renderComRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

test('renderiza componente de login', () => {
  const { getByText } = renderComRouter(<Login />);
  expect(getByText('Entrar')).toBeInTheDocument();
});
```

### **Mockando Hooks de Roteamento**
```jsx
// Mock do useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' })
}));
```

---

## 🚀 Próximos Passos: Roteamento Avançado

### **Recursos a Explorar:**
1. **Rotas com Loaders e Actions (React Router Data APIs)**
2. **Scroll Restoration automático**
3. **Prefetching de rotas**
4. **Rotas modais (sobreposições)**
5. **Roteamento baseado em abas**
6. **Integração com state management (Redux, Zustand)**

### **Quando Considerar Outras Soluções:**
- **Next.js:** Para SSR, SSG e rotas baseadas em arquivos
- **TanStack Router:** Para tipagem TypeScript avançada
- **React Location:** Para features avançadas de data fetching

---

> **"O roteamento em React não é sobre servir páginas diferentes, mas sobre gerenciar a ilusão perfeita de um aplicativo multi-tela dentro de uma única página. É a arte de fazer o navegador acreditar que está navegando, enquanto você mantém o controle total sobre a experiência."**

**Próximo Passo:** Crie um projeto com 3 níveis de rotas aninhadas, implemente autenticação com rotas protegidas, e adicione lazy loading para pelo menos uma rota. Depois, adicione transições entre as rotas para uma experiência cinematográfica.