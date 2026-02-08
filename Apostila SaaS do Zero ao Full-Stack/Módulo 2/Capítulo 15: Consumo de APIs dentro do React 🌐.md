# Capítulo 15: Consumo de APIs dentro do React 🌐

## 🌟 Introdução: A Dança entre Estado e Dados Externos
Consumir APIs dentro do React não é apenas sobre fazer requisições HTTP — é sobre **orquestrar a complexa coreografia entre estado local e dados remotos**, onde cada componente precisa lidar com a incerteza da rede, a latência e a volatilidade dos dados externos. Enquanto o JavaScript puro se concentra em "como buscar dados", o React adiciona a dimensão crucial de "como gerenciar a interface durante todo o ciclo de vida dos dados".

Historicamente, aplicações web faziam requisições AJAX e atualizavam manualmente o DOM. No React, o consumo de APIs se torna uma disciplina arquitetural que influencia desde a estrutura de estado até a experiência do usuário, exigindo um pensamento que antecipa carregamento, erro, vazio e sucesso como estados válidos da UI.

---

## 🎯 Por que o Consumo de APIs em React é um Desafio Único?

1.  **⏳ Assincronia Visualizada:** Cada requisição transforma-se em múltiplos estados de UI (loading, error, success) que precisam ser gerenciados coordenadamente.
2.  **🧩 Composição de Dependências:** Componentes diferentes podem depender dos mesmos dados, exigindo estratégias de cache e sincronização.
3.  **🔄 Ciclo de Vida Completo:** Dados precisam ser buscados, exibidos, atualizados e limpos em sincronia com o ciclo de vida dos componentes.
4.  **⚡ Performance Holística:** Múltiplas requisições podem disparar simultaneamente, exigindo estratégias de priorização e cancelamento.
5.  **🎭 UX sob Incerteza:** A interface precisa permanecer útil e responsiva mesmo quando dados estão incompletos, lentos ou indisponíveis.
6.  **🔗 Dependências Encadeadas:** Alguns dados só podem ser buscados após outros estarem disponíveis, criando cadeias de dependência.

---

## 🧱 Os Três Paradigmas do Consumo de APIs em React

### 1. O Modelo Clássico: useState + useEffect
A combinação fundamental que todo desenvolvedor React domina, mas que esconde complexidades surpreendentes.

**Filosofia:** "Dados são um efeito colateral do ciclo de vida do componente."

**Forças:**
- Controle granular sobre quando os dados são buscados
- Integração direta com o ciclo de vida do componente
- Sem dependências externas

**Fraquezas:**
- Boilerplate significativo para casos comuns
- Cache e sincronização manuais
- Fácil cometer erros de race conditions

### 2. O Modelo de Hook Personalizado
Abstrair a lógica de fetching em Hooks reutilizáveis que encapsulam padrões comuns.

**Filosofia:** "Extraia a complexidade, exponha simplicidade."

**Forças:**
- Reutilização de lógica entre componentes
- Separação clara de responsabilidades
- Fácil de testar isoladamente

**Fraquezas:**
- Cada hook gerencia seu próprio cache (ou nenhum)
- Dificuldade de compartilhar estado entre hooks
- Necessidade de inventar convenções para casos avançados

### 3. O Modelo de Biblioteca Especializada (React Query, SWR)
Adotar soluções que tratam dados remotos como problema de primeira classe.

**Filosofia:** "Dados de servidor são cidadãos de primeira classe no estado da aplicação."

**Forças:**
- Cache inteligente e automático
- Atualização em background
- Estados otimistas (optimistic updates)
- Sincronização entre componentes

**Fraquezas:**
- Curva de aprendizado adicional
- Bundle size aumentado
- Abstração que pode esconder complexidade

---

## 🔄 O Ciclo de Vida Completo de Dados em React

### 🎭 Os 5 Estados que Toda Interface Precisa Lidar
1.  **🔄 Carregando Inicial:** Primeira busca, sem dados anteriores
2.  **📂 Vazio Intencional:** Dados carregados, mas array vazio
3.  **✅ Sucesso com Dados:** Dados carregados e disponíveis
4.  **🔄 Recarregando:** Busca nova enquanto mostra dados antigos
5.  **❌ Erro Recuperável ou Fatal:** Algo deu errado, com ou sem fallback

### ⚡ A Arte do Feedback Visual
Cada estado precisa de representação visual distinta:
```jsx
// ❌ ANTI-PATTERN: Um booleano não captura a complexidade
const [dados, setDados] = useState(null);
const [carregando, setCarregando] = useState(false);
const [erro, setErro] = useState(null);

// ✅ PADRÃO: Estado como máquina de estados
const [estado, setEstado] = useState({
  status: 'idle' | 'loading' | 'success' | 'error' | 'reloading',
  dados: null,
  erro: null,
  atualizadoEm: null,
  tentativas: 0
});
```

---

## 🏗️ Padrões de Implementação Progressiva

### Nível 1: O Fetch Básico (Para Iniciantes)
```javascript
function ComponenteBasico() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;
    
    async function buscarDados() {
      try {
        setCarregando(true);
        const resposta = await fetch('/api/dados');
        
        if (!resposta.ok) {
          throw new Error(`HTTP ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        
        if (!cancelado) {
          setDados(dados);
          setErro(null);
        }
      } catch (err) {
        if (!cancelado) {
          setErro(err.message);
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }
    
    buscarDados();
    
    return () => {
      cancelado = true;
    };
  }, []);

  if (carregando) return <Spinner />;
  if (erro) return <Erro mensagem={erro} />;
  return <ListaDados dados={dados} />;
}
```

### Nível 2: Hook Personalizado (Para Reutilização)
```javascript
function useFetch(endpoint, opcoes = {}) {
  const [estado, setEstado] = useState({
    status: 'idle',
    dados: null,
    erro: null,
    atualizadoEm: null
  });
  
  const buscar = useCallback(async (buscaPersonalizada) => {
    setEstado(e => ({ ...e, status: 'loading' }));
    
    try {
      const url = buscaPersonalizada || endpoint;
      const resposta = await fetch(url, opcoes);
      
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
      }
      
      const dados = await resposta.json();
      
      setEstado({
        status: 'success',
        dados,
        erro: null,
        atualizadoEm: new Date()
      });
      
      return dados;
    } catch (err) {
      setEstado(e => ({
        ...e,
        status: 'error',
        erro: err.message
      }));
      throw err;
    }
  }, [endpoint, opcoes]);
  
  useEffect(() => {
    buscar();
  }, [buscar]);
  
  const recarregar = () => buscar();
  
  return {
    ...estado,
    recarregar,
    buscar
  };
}
```

### Nível 3: Sistema Avançado com Cache (Para Produção)
```javascript
function criarSistemaCache() {
  const cache = new Map();
  const ouvintes = new Map();
  
  function emitir(evento, chave, dados) {
    const listeners = ouvintes.get(chave) || [];
    listeners.forEach(listener => listener(evento, dados));
  }
  
  async function buscarComCache(chave, buscarFn, ttl = 60000) {
    const agora = Date.now();
    const entrada = cache.get(chave);
    
    // Cache válido
    if (entrada && (agora - entrada.timestamp < ttl)) {
      emitir('cache', chave, entrada.dados);
      return entrada.dados;
    }
    
    // Emitir loading
    emitir('loading', chave, null);
    
    try {
      const dados = await buscarFn();
      
      cache.set(chave, {
        dados,
        timestamp: agora
      });
      
      emitir('success', chave, dados);
      return dados;
    } catch (erro) {
      emitir('error', chave, erro);
      throw erro;
    }
  }
  
  function usarCache(chave, buscarFn, ttl) {
    const [estado, setEstado] = useState({
      status: 'idle',
      dados: null,
      erro: null
    });
    
    useEffect(() => {
      const handler = (evento, dados) => {
        setEstado({
          status: evento,
          dados: evento === 'success' ? dados : null,
          erro: evento === 'error' ? dados : null
        });
      };
      
      // Registrar listener
      if (!ouvintes.has(chave)) {
        ouvintes.set(chave, []);
      }
      ouvintes.get(chave).push(handler);
      
      // Buscar dados
      buscarComCache(chave, buscarFn, ttl);
      
      return () => {
        // Cleanup
        const listeners = ouvintes.get(chave) || [];
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }, [chave, buscarFn, ttl]);
    
    return estado;
  }
  
  return { usarCache, buscarComCache };
}
```

---

## ⚡ Otimizações Avançadas de Performance

### 1. Debouncing para Buscas em Tempo Real
```javascript
function useBuscaEmTempoReal(termoBusca, atraso = 300) {
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  
  useEffect(() => {
    if (!termoBusca.trim()) {
      setResultados([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setBuscando(true);
      try {
        const resposta = await fetch(`/api/buscar?q=${termoBusca}`);
        const dados = await resposta.json();
        setResultados(dados);
      } finally {
        setBuscando(false);
      }
    }, atraso);
    
    return () => clearTimeout(timeoutId);
  }, [termoBusca, atraso]);
  
  return { resultados, buscando };
}
```

### 2. Paginação com Infinite Scroll Otimizado
```javascript
function usePaginaçãoInfinita(endpointBase, tamanhoPagina = 20) {
  const [estado, setEstado] = useState({
    dados: [],
    pagina: 1,
    carregando: false,
    temMais: true,
    erro: null
  });
  
  const carregarMais = useCallback(async () => {
    if (estado.carregando || !estado.temMais) return;
    
    setEstado(e => ({ ...e, carregando: true }));
    
    try {
      const resposta = await fetch(
        `${endpointBase}?pagina=${estado.pagina}&limite=${tamanhoPagina}`
      );
      
      const novosDados = await resposta.json();
      
      setEstado(e => ({
        ...e,
        dados: [...e.dados, ...novosDados],
        pagina: e.pagina + 1,
        carregando: false,
        temMais: novosDados.length === tamanhoPagina
      }));
    } catch (err) {
      setEstado(e => ({
        ...e,
        carregando: false,
        erro: err.message
      }));
    }
  }, [estado, endpointBase, tamanhoPagina]);
  
  // Intersection Observer para infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && estado.temMais) {
          carregarMais();
        }
      },
      { threshold: 1.0 }
    );
    
    const elementoAlvo = document.getElementById('carregador');
    if (elementoAlvo) observer.observe(elementoAlvo);
    
    return () => observer.disconnect();
  }, [carregarMais, estado.temMais]);
  
  return { ...estado, carregarMais };
}
```

### 3. Prefetching Inteligente
```javascript
function usePrefetching() {
  const cachePrefetch = useRef(new Map());
  const prefetchTimeout = useRef(null);
  
  const prefetch = useCallback((url) => {
    // Cancelar prefetch anterior se muito rápido
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
    
    // Se já está no cache, não precisa buscar
    if (cachePrefetch.current.has(url)) {
      return cachePrefetch.current.get(url);
    }
    
    // Delay para não sobrecarregar com prefetch agressivo
    prefetchTimeout.current = setTimeout(async () => {
      try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        cachePrefetch.current.set(url, dados);
      } catch (erro) {
        console.warn('Prefetch falhou:', url, erro);
      }
    }, 100);
    
    return null;
  }, []);
  
  const obterDoPrefetch = useCallback((url) => {
    if (cachePrefetch.current.has(url)) {
      const dados = cachePrefetch.current.get(url);
      cachePrefetch.current.delete(url); // LRU-like
      return dados;
    }
    return null;
  }, []);
  
  return { prefetch, obterDoPrefetch };
}
```

---

## 🚨 Tratamento de Erros em Produção

### 1. Estratificação de Erros
```javascript
class ErroAPI extends Error {
  constructor(mensagem, tipo, statusCode, dados) {
    super(mensagem);
    this.tipo = tipo; // 'network', 'validation', 'server', 'auth'
    this.statusCode = statusCode;
    this.dados = dados;
    this.timestamp = new Date();
  }
  
  podeTentarNovamente() {
    return this.tipo === 'network' || this.statusCode === 429;
  }
  
  deveRedirecionarLogin() {
    return this.statusCode === 401 || this.statusCode === 403;
  }
}

async function buscarComTratamentoErro(url, opcoes) {
  try {
    const resposta = await fetch(url, opcoes);
    
    if (resposta.status === 401) {
      throw new ErroAPI(
        'Não autorizado',
        'auth',
        401,
        { redirectTo: '/login' }
      );
    }
    
    if (resposta.status === 429) {
      throw new ErroAPI(
        'Muitas requisições',
        'rate_limit',
        429,
        { retryAfter: resposta.headers.get('Retry-After') }
      );
    }
    
    if (!resposta.ok) {
      const textoErro = await resposta.text();
      throw new ErroAPI(
        `Erro HTTP ${resposta.status}`,
        'server',
        resposta.status,
        { resposta: textoErro }
      );
    }
    
    return await resposta.json();
  } catch (erro) {
    if (erro instanceof ErroAPI) throw erro;
    
    // Erro de rede ou timeout
    throw new ErroAPI(
      erro.message,
      'network',
      0,
      { originalError: erro }
    );
  }
}
```

### 2. Sistema de Retry com Backoff Exponencial
```javascript
function useFetchComRetry(endpoint, maxTentativas = 3) {
  const [estado, setEstado] = useState({ status: 'idle', dados: null });
  const tentativasRef = useRef(0);
  
  const buscar = useCallback(async () => {
    setEstado({ status: 'loading', dados: null });
    
    while (tentativasRef.current < maxTentativas) {
      try {
        const resposta = await fetch(endpoint);
        const dados = await resposta.json();
        
        setEstado({ status: 'success', dados });
        tentativasRef.current = 0;
        return dados;
      } catch (erro) {
        tentativasRef.current++;
        
        if (tentativasRef.current === maxTentativas) {
          setEstado({ status: 'error', dados: null });
          throw erro;
        }
        
        // Backoff exponencial
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, tentativasRef.current))
        );
      }
    }
  }, [endpoint, maxTentativas]);
  
  useEffect(() => {
    buscar();
  }, [buscar]);
  
  return { ...estado, retry: buscar };
}
```

---

## 🧪 Testando Componentes que Consomem APIs

### 1. Mocking de APIs em Testes
```javascript
// Setup de testes
beforeEach(() => {
  global.fetch = jest.fn();
});

test('componente exibe dados da API', async () => {
  // Mock da resposta
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ usuarios: [{ id: 1, nome: 'João' }] })
  });
  
  render(<ListaUsuarios />);
  
  // Verificar loading
  expect(screen.getByText('Carregando...')).toBeInTheDocument();
  
  // Esperar dados
  await waitFor(() => {
    expect(screen.getByText('João')).toBeInTheDocument();
  });
});

test('componente lida com erro da API', async () => {
  fetch.mockRejectedValueOnce(new Error('Falha na rede'));
  
  render(<ListaUsuarios />);
  
  await waitFor(() => {
    expect(screen.getByText(/Erro ao carregar/)).toBeInTheDocument();
  });
});
```

### 2. Testando Estados de Carregamento
```javascript
test('mostra skeleton durante carregamento', async () => {
  fetch.mockImplementation(() => 
    new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: async () => ({ dados: [] })
      }), 100)
    )
  );
  
  render(<ListaUsuarios />);
  
  // Deve mostrar skeleton imediatamente
  expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  
  // Skeleton deve desaparecer após carregamento
  await waitForElementToBeRemoved(() =>
    screen.getByTestId('skeleton-loader')
  );
});
```

---

## 🚀 A Evolução: Bibliotecas Modernas de Gerenciamento de Dados

### Por que React Query/TanStack Query Dominam Atualmente
1. **Cache Automático:** Dados são automaticamente cacheados e invalidados
2. **Background Refetching:** Atualiza dados em segundo plano quando focado
3. **Optimistic Updates:** Atualiza UI imediatamente, reverte se falhar
4. **Infinite Queries:** Suporte nativo a paginação infinita
5. **Mutations Simples:** Operações de escrita com estados de loading/error
6. **DevTools:** Interface para visualizar e manipular cache

### Exemplo com TanStack Query
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ListaUsuarios() {
  const queryClient = useQueryClient();
  
  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => fetch('/api/usuarios').then(r => r.json()),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  const mutation = useMutation({
    mutationFn: (novoUsuario) => 
      fetch('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(novoUsuario)
      }),
    onSuccess: () => {
      // Invalidar cache para refetch
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });
  
  if (isLoading) return <Spinner />;
  if (error) return <Erro mensagem={error.message} />;
  
  return (
    <div>
      {usuarios.map(usuario => (
        <Usuario key={usuario.id} usuario={usuario} />
      ))}
    </div>
  );
}
```

---

## 🎯 Tomando Decisões Arquiteturais

### Quando Usar Cada Abordagem

**useState + useEffect:**
- Aplicações pequenas e simples
- Quando precisa de controle total sobre timing
- Protótipos e MVPs
- Quando bundle size é crítico

**Hooks Personalizados:**
- Aplicações médias com lógica reutilizável
- Equipes que preferem soluções customizadas
- Quando precisa integrar com sistemas legados
- Para problemas específicos do domínio

**Bibliotecas (React Query/SWR):**
- Aplicações complexas com muitos dados
- Equipes grandes que precisam de padrões consistentes
- Quando cache e sincronização são importantes
- Para melhor DX e produtividade

---

> **"Consumir APIs em React não é sobre fazer requisições HTTP — é sobre gerenciar a incerteza. É a arte de criar interfaces que permanecem úteis enquanto esperam por dados que podem chegar, falhar, ou nunca vir. Dominar esta arte significa entender que o verdadeiro valor não está nos dados que você recebe, mas na confiança que você dá ao usuário durante todo o processo."**

**Próximo Passo:** Escolha uma API pública complexa (com paginação, filtros e relações) e construa uma interface que implemente:
1. Cache em múltiplas camadas (memória, localStorage)
2. Estados otimistas para ações do usuário
3. Prefetching inteligente baseado em comportamento
4. Sistema de retry com fallbacks graduais

Compare a experiência do usuário antes e depois — você entenderá por que o consumo de APIs bem feito é uma das habilidades mais valorizadas em desenvolvedores React experientes.