# Capítulo 5: Consumo de APIs REST com fetch() ou axios 🌐

## 🌟 Introdução: A Ponte para Dados Externos
O consumo de APIs REST não é apenas sobre buscar dados — trata-se de **estabelecer diálogos estruturados entre aplicações**, transformando dados brutos em experiências interativas ricas. Em um ecossistema onde serviços se comunicam constantemente, dominar a arte da comunicação HTTP é a chave para criar aplicações verdadeiramente conectadas.

Historicamente, usávamos XMLHttpRequest com sua sintaxe verbosa. Hoje, com a Fetch API nativa e bibliotecas como axios, temos abstrações elegantes que simplificam requisições assíncronas, tratamento de erros e gerenciamento de estado de rede.

---

## 🎯 Por que Dominar o Consumo de APIs?

1.  **🔄 Dados em Tempo Real:** Integre-se a fontes dinâmicas como preços de ações, clima, redes sociais e muito mais.
2.  **⚡ Performance Otimizada:** Técnicas como cache, lazy loading e paginação mantêm sua aplicação rápida mesmo com grandes volumes de dados.
3.  **🧩 Arquitetura Desacoplada:** Separe front-end e back-end, permitindo escalabilidade e manutenção independentes.
4.  **🔒 Segurança e Confiabilidade:** Implemente autenticação, tratamento de erros e fallbacks para criar aplicações resilientes.

---

## 🧱 As Duas Principais Ferramentas

### 1. Fetch API (Nativo do JavaScript)
A Fetch API é uma interface moderna baseada em Promises para fazer requisições HTTP.

**Sintaxe Básica:**
```javascript
// GET request simples
fetch('https://api.exemplo.com/dados')
  .then(resposta => resposta.json())
  .then(dados => console.log(dados))
  .catch(erro => console.error('Erro:', erro));
```

**Vantagens do Fetch:**
- Nativa, sem dependências externas
- Suporte a Promises e async/await
- Interface limpa e moderna

**Desvantagens:**
- Necessidade de verificar status manualmente
- Sem cancelamento nativo (sem AbortController)
- Não envia cookies por padrão

### 2. Axios (Biblioteca Popular)
Axios é uma biblioteca cliente HTTP baseada em Promises, com recursos avançados.

**Sintaxe Básica:**
```javascript
// GET request com Axios
axios.get('https://api.exemplo.com/dados')
  .then(resposta => console.log(resposta.data))
  .catch(erro => console.error('Erro:', erro));
```

**Vantagens do Axios:**
- Transformação automática de JSON
- Cancelamento de requisições
- Interceptores para requisições e respostas
- Proteção contra XSRF
- Melhor tratamento de erros

**Desvantagens:**
- Dependência externa (aumenta bundle size)
- Necessidade de instalação e importação

---

## 🚀 Guia de Referência: Métodos HTTP Comuns

| Método | Descrição | Fetch | Axios |
| :--- | :--- | :--- | :--- |
| **GET** | Buscar dados | `fetch(url)` | `axios.get(url)` |
| **POST** | Criar novo recurso | `fetch(url, {method: 'POST', body: data})` | `axios.post(url, data)` |
| **PUT** | Atualizar recurso completo | `fetch(url, {method: 'PUT', body: data})` | `axios.put(url, data)` |
| **PATCH** | Atualizar parcialmente | `fetch(url, {method: 'PATCH', body: data})` | `axios.patch(url, data)` |
| **DELETE** | Excluir recurso | `fetch(url, {method: 'DELETE'})` | `axios.delete(url)` |

---

## 💡 Padrões Avançados e Boas Práticas

### 1. Configuração de Headers e Autenticação
```javascript
// Fetch com headers e autenticação
const opcoesFetch = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-API-Key': 'sua-chave-api'
  },
  body: JSON.stringify(dados)
};

fetch('https://api.exemplo.com/recurso', opcoesFetch);

// Axios com interceptors para autenticação
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});
```

### 2. Tratamento Robusto de Erros
```javascript
// Fetch com tratamento detalhado
async function buscarDadosComTratamento(url) {
  try {
    const resposta = await fetch(url);
    
    if (!resposta.ok) {
      // Tenta extrair mensagem de erro do servidor
      const erro = await resposta.json().catch(() => ({}));
      throw new Error(
        `Erro ${resposta.status}: ${erro.message || resposta.statusText}`
      );
    }
    
    return await resposta.json();
  } catch (erro) {
    if (erro.name === 'TypeError' && erro.message.includes('fetch')) {
      console.error('Erro de rede ou CORS:', erro);
      throw new Error('Não foi possível conectar ao servidor');
    }
    throw erro;
  }
}

// Axios com tratamento global de erros
axios.interceptors.response.use(
  resposta => resposta,
  erro => {
    if (erro.response?.status === 401) {
      // Token expirado, redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);
```

### 3. Gerenciamento de Estado de Carregamento e Cache
```javascript
// Hook personalizado para React (exemplo)
function useAPI(url) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function buscarDados() {
      try {
        setCarregando(true);
        const resposta = await fetch(url, {
          signal: controller.signal
        });
        
        if (!resposta.ok) throw new Error('Erro na requisição');
        
        const dados = await resposta.json();
        setDados(dados);
        // Armazenar em cache local
        localStorage.setItem(`cache_${url}`, JSON.stringify(dados));
      } catch (erro) {
        if (erro.name !== 'AbortError') {
          setErro(erro.message);
          // Tentar buscar do cache
          const cache = localStorage.getItem(`cache_${url}`);
          if (cache) setDados(JSON.parse(cache));
        }
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
    
    return () => controller.abort(); // Cleanup
  }, [url]);

  return { dados, carregando, erro };
}
```

---

## ⚠️ Armadilhas Comuns (Anti-Patterns)

### ❌ O que evitar:
```javascript
// 1. Não verificar status da resposta
fetch(url)
  .then(resposta => resposta.json()) // ❌ Ignora status 404, 500, etc.
  .then(dados => console.log(dados));

// 2. Não tratar erros de rede
fetch(url)
  .then(resposta => resposta.json())
  .then(dados => console.log(dados));
  // ❌ Sem catch, erros silenciosos

// 3. Vazamento de memória (não cancelar requisições)
useEffect(() => {
  fetch(url).then(/* ... */); // ❌ Continua mesmo após desmontar componente
}, []);
```

### ✅ Melhores práticas:
```javascript
// 1. Verificação completa do status
async function buscarDados(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
  }
  return resposta.json();
}

// 2. Tratamento abrangente de erros
try {
  const dados = await buscarDados(url);
  console.log(dados);
} catch (erro) {
  console.error('Falha ao buscar dados:', erro);
  // Fallback ou estado de erro na UI
}

// 3. Cancelamento com AbortController
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal })
    .then(/* ... */)
    .catch(erro => {
      if (erro.name !== 'AbortError') {
        console.error('Erro:', erro);
      }
    });
  
  return () => controller.abort(); // ✅ Cancela ao desmontar
}, [url]);
```

---

## 🛠️ Checklist de Qualidade no Consumo de APIs

- [ ] **Tratamento de erros:** Todos os possíveis erros (rede, CORS, status HTTP) são tratados?
- [ ] **States de UI:** Há indicadores de carregamento, erro e sucesso?
- [ ] **Timeout:** Requisições têm timeout configurado para evitar bloqueios?
- [ ] **Cache:** Dados estáticos ou pouco voláteis são cacheados?
- [ ] **Retry:** Há lógica de retry para falhas transitórias?
- [ ] **Cancelamento:** Requisições podem ser canceladas quando não são mais necessárias?
- [ ] **Segurança:** Tokens e chaves são armazenados e transmitidos com segurança?
- [ ] **Rate limiting:** A aplicação respeita limites de requisições da API?
- [ ] **Documentação:** As chamadas de API estão documentadas (endpoints, payloads, respostas)?

---

## 🔧 Ferramentas e Recursos Úteis

1.  **Postman / Insomnia:** Testar e documentar APIs
2.  **JSON Server:** Mockar APIs para desenvolvimento
3.  **SWR / React Query:** Gerenciamento avançado de estado de dados (React)
4.  **Axios Mock Adapter:** Mockar requisições para testes
5.  **Network Tab (DevTools):** Inspecionar requisições HTTP
6.  **CORS:** Compreender e configurar Cross-Origin Resource Sharing
7.  **HTTP Toolkit:** Debugging avançado de tráfego HTTP

---

## 🎯 Exercícios Práticos Recomendados

1.  **Crie um dashboard de criptomoedas** que atualize preços em tempo real
2.  **Implemente uma busca em tempo real** usando a API do GitHub ou Spotify
3.  **Construa um app de previsão do tempo** com geolocalização
4.  **Desenvolva um cliente para sua API favorita** com paginação e cache
5.  **Crie um sistema de autenticação completo** com JWT e refresh tokens

---

> **"Consumir APIs não é apenas sobre receber dados, mas sobre criar conversas confiáveis entre sistemas — onde cada requisição é uma pergunta bem formulada e cada resposta é compreendida em seu contexto completo."**  
> *Baseado nas melhores práticas de comunicação entre serviços e resiliência de sistemas.*

**Próximo Passo:** Escolha uma API pública (como JSONPlaceholder, PokéAPI, ou alguma que você goste) e construa uma interface completa com: loading states, tratamento de erros, cache local, e a capacidade de criar/ler/atualizar/excluir recursos.