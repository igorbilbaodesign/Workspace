# Capítulo 3: Lógica de Programação com JavaScript (ES6+) 🧠

## 🌟 Introdução: A Arquitetura do Comportamento
A lógica de programação em JavaScript não é apenas sobre escrever código que funciona — trata-se de **construir sistemas de pensamento** que resolvem problemas de forma eficiente e elegante. Com o ES6+ (ECMAScript 2015+), JavaScript evoluiu de uma linguagem de scripting simples para uma plataforma poderosa que suporta paradigmas funcionais, orientados a objetos e reativos.

Historicamente, JavaScript enfrentava críticas por comportamentos inesperados e sintaxe limitada. Hoje, o ES6+ nos oferece ferramentas que transformam lógica complexa em expressões claras e manuteníveis, estabelecendo a base para toda a interatividade moderna da web.

---

## 🎯 Por que Dominar a Lógica JavaScript Moderna?

1.  **⚡ Expressividade Aumentada:** Recursos como arrow functions, desestruturação e template literais reduzem código boilerplate em 40-60%.
2.  **🔒 Previsibilidade Garantida:** `let` e `const` eliminam problemas clássicos de escopo, enquanto módulos ESM criam sistemas isolados e confiáveis.
3.  **🚀 Concorrência Moderna:** Async/await transforma código assíncrono complexo em fluxos lineares e legíveis.
4.  **🧩 Composição Potente:** Funções de alta ordem e métodos de array modernos permitem construir lógica complexa a partir de blocos simples.

---

## 🧱 Pilares da Lógica ES6+

### 🔄 Paradigmas Complementares
**Programação Funcional:**
```javascript
// Composição de funções puras
const processarDados = compose(
  filtrarAtivos,
  mapearParaDTO,
  ordenarPorData
);

// Imutabilidade como padrão
const usuariosAtualizados = usuarios.map(u => 
  u.id === userId ? { ...u, ativo: false } : u
);
```

**Programação Orientada a Objetos Moderna:**
```javascript
// Classes com sintaxe limpa
class Usuario {
  #senha; // Campo privado (#)
  
  constructor(nome, email) {
    this.nome = nome;
    this.email = email;
    this.#senha = this.gerarSenha();
  }
  
  // Métodos estáticos
  static validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### 📊 Estruturas de Dados Essenciais
**Map e Set:**
```javascript
// Map para pares chave-valor complexos
const cache = new Map();
cache.set(userId, { dados: userData, timestamp: Date.now() });

// Set para coleções únicas
const tagsUnicas = new Set([...tags1, ...tags2]);
```

---

## 🚀 Guia de Referência: Recursos ES6+ Essenciais

| Recurso | Sintaxe | Caso de Uso |
| :--- | :--- | :--- |
| **Arrow Functions** | `const soma = (a, b) => a + b;` | Callbacks concisos e escopo léxico |
| **Template Literals** | `` `Olá, ${nome}!` `` | Strings dinâmicas e multilinha |
| **Desestruturação** | `const { nome, idade } = pessoa;` | Extração elegante de valores |
| **Parâmetros Rest/Spread** | `function(...args) {}` | Argumentos variáveis e cópias |
| **Módulos (ESM)** | `import { fn } from 'module';` | Organização de código |
| **Optional Chaining** | `user?.profile?.avatar` | Acesso seguro a propriedades |
| **Nullish Coalescing** | `valor ?? 'default'` | Valores padrão inteligentes |
| **Promises/Async-Await** | `const data = await fetch();` | Concorrência legível |

---

## 💡 Padrões de Lógica Avançados

### 1. Composição Funcional
```javascript
// Pipe operator pattern (próximo ao ES)
const processar = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Uso prático
const formatarUsuario = processar(
  removerCamposSensiveis,
  adicionarTimestamp,
  converterParaJSON
);
```

### 2. Lógica Assíncrona Robusta
```javascript
// Pattern: Retry com exponential backoff
async function fetchComRetry(url, maxTentativas = 3) {
  let tentativa = 0;
  while (tentativa < maxTentativas) {
    try {
      const resposta = await fetch(url);
      return await resposta.json();
    } catch (erro) {
      tentativa++;
      if (tentativa === maxTentativas) throw erro;
      await new Promise(res => 
        setTimeout(res, 1000 * 2 ** tentativa) // 1s, 2s, 4s
      );
    }
  }
}
```

### 3. Transformação de Dados Declarativa
```javascript
// Pipeline de transformação
const analisarVendas = vendas => vendas
  .filter(v => v.status === 'completo')
  .reduce((acc, v) => ({
    total: acc.total + v.valor,
    porCategoria: {
      ...acc.porCategoria,
      [v.categoria]: (acc.porCategoria[v.categoria] || 0) + 1
    }
  }), { total: 0, porCategoria: {} });
```

---

## ⚠️ Armadilhas da Lógica JavaScript

### ❌ Anti-Patterns Comuns:
```javascript
// 1. Callback Hell (antes do ES6)
buscarUsuario(id, function(usuario) {
  buscarPedidos(usuario.id, function(pedidos) {
    processarPedidos(pedidos, function(resultado) {
      // ❌ Aninhamento excessivo
    });
  });
});

// 2. Mutações acidentais
const config = { timeout: 3000 };
function atualizarConfig(novaConfig) {
  Object.assign(config, novaConfig); // ❌ Muta o original
}

// 3. Comparações problemáticas
if ([] == false) { // ❌ Coerção tipo imprevisível
  console.log('Isso executa!');
}
```

### ✅ Soluções Modernas:
```javascript
// 1. Async/await linear
async function processarUsuario(id) {
  const usuario = await buscarUsuario(id);
  const pedidos = await buscarPedidos(usuario.id);
  return await processarPedidos(pedidos); // ✅ Fluxo claro
}

// 2. Imutabilidade por padrão
function atualizarConfig(configAtual, novasConfigs) {
  return { ...configAtual, ...novasConfigs }; // ✅ Novo objeto
}

// 3. Comparações estritas e explícitas
if (Array.isArray(arr) && arr.length === 0) {
  console.log('Array vazio verificado corretamente');
}
```

---

## 🛠️ Checklist de Qualidade de Lógica

- [ ] **Imutabilidade:** Funções puras são preferidas sobre mutações diretas?
- [ ] **Tratamento de Erros:** Todas as operações assíncronas têm `try/catch` ou `.catch()`?
- [ ] **Separação de Responsabilidades:** Funções seguem o princípio da única responsabilidade?
- [ ] **Testabilidade:** A lógica pode ser testada isoladamente (sem side effects)?
- [ ] **Performance:** Operações O(n²) são evitadas quando possível?
- [ ] **Legibilidade:** Nomes de variáveis/funções comunicam intenção claramente?
- [ ] **Consistência:** Padrões de código são seguidos em todo o projeto?
- [ ] **Documentação:** Lógica complexa tem comentários explicativos?

---

## 🔧 Ferramentas para Aprimorar a Lógica

1.  **ESLint + Prettier:** Padronização automática de código
2.  **Chrome DevTools:** Debugging passo a passo com breakpoints condicionais
3.  **Jest/ Vitest:** Testes unitários para validar lógica
4.  **LeetCode / Codewars:** Desafios de algoritmo para prática
5.  **TypeScript:** Tipagem estática para prevenir erros lógicos
6.  **Node.js REPL:** Experimentação rápida de conceitos

---

## 🎯 Exercícios Práticos Recomendados

1.  **Transforme callbacks** em async/await em um código legado
2.  **Reescreva loops** `for` tradicionais usando `map`, `filter`, `reduce`
3.  **Implemente um cache** usando Map com expiração automática
4.  **Crie uma função compose** que combine múltiplas funções
5.  **Refatore uma classe** grande em múltiplas funções puras pequenas

---

> **"A excelência em programação não está em escrever código que o computador entende, mas em escrever código que humanos entendem."**  
> *Baseado nos princípios de Clean Code e JavaScript: The Good Parts.*

**Próximo Passo:** Pegue um trecho de código antigo que use callbacks aninhados e var, e refatore-o utilizando async/await, const/let e funções de array modernas.