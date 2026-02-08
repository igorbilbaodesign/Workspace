# Capítulo 6: Persistência de Dados no Navegador (localStorage, sessionStorage) 💾

## 🌟 Introdução: A Memória da Aplicação Web
A persistência de dados no navegador não é apenas sobre guardar informações — trata-se de **criar experiências contínuas e personalizadas** que se lembram do usuário entre visitas, mantendo estado, preferências e contexto. Em uma era de aplicações web ricas e SPAs, a capacidade de armazenar dados localmente é o que diferencia uma página estática de uma aplicação verdadeiramente interativa.

Historicamente, tínhamos apenas cookies com suas limitações de tamanho (4KB) e complexidade. Hoje, com as Web Storage APIs, temos uma solução robusta e simples para armazenar dados estruturados no cliente, possibilitando desde salvamento automático até experiências offline completas.

---

## 🎯 Por que Persistir Dados Localmente?

1.  **🚀 Performance Imediata:** Reduz chamadas de rede desnecessárias mantendo dados acessíveis localmente.
2.  **📱 Experiência Offline:** Permite que aplicações funcionem parcialmente sem conexão à internet.
3.  **🔧 Personalização Contínua:** Lembra preferências do usuário (tema, idioma, configurações) entre sessões.
4.  **💾 Estado da Aplicação:** Mantém o estado atual entre recarregamentos ou fechamento do navegador.
5.  **💰 Custos Reduzidos:** Diminui a carga no servidor armazenando dados estáticos no cliente.

---

## 🧱 As Duas Principais APIs de Armazenamento

### 1. localStorage
**Armazenamento Persistente** - Dados permanecem até serem explicitamente removidos.

**Características:**
- Capacidade: ~5-10MB por domínio (dependendo do navegador)
- Persistência: Dados sobrevivem a fechar e reabrir o navegador
- Escopo: Acessível em todas as abas/janelas do mesmo domínio
- Sincronização: Não sincronizado entre dispositivos

### 2. sessionStorage
**Armazenamento de Sessão** - Dados são limpos ao fechar a aba/janela.

**Características:**
- Capacidade: ~5-10MB por domínio
- Persistência: Dados são destruídos ao fechar a aba
- Escopo: Limitado à aba/janela atual (não compartilhado entre abas)
- Caso de uso ideal: Dados temporários de um fluxo específico

---

## 🚀 Guia de Referência: Métodos Essenciais

| Operação | localStorage | sessionStorage | Descrição |
| :--- | :--- | :--- | :--- |
| **Salvar** | `setItem(chave, valor)` | `setItem(chave, valor)` | Armazena par chave-valor |
| **Ler** | `getItem(chave)` | `getItem(chave)` | Recupera valor pela chave |
| **Remover** | `removeItem(chave)` | `removeItem(chave)` | Remove item específico |
| **Limpar tudo** | `clear()` | `clear()` | Remove todos os itens |
| **Quantidade** | `length` | `length` | Número de itens armazenados |
| **Chave por índice** | `key(índice)` | `key(índice)` | Retorna nome da chave no índice |

---

## 💡 Padrões Avançados e Boas Práticas

### 1. Gerenciamento de Dados Estruturados
```javascript
// Encapsulamento em uma classe para gerenciamento robusto
class ArmazenamentoLocal {
  constructor(namespace = 'app') {
    this.namespace = namespace;
  }

  // Salvar objeto com namespace
  salvar(chave, dados) {
    try {
      const chaveCompleta = `${this.namespace}_${chave}`;
      localStorage.setItem(chaveCompleta, JSON.stringify({
        dados,
        timestamp: Date.now(),
        versao: '1.0'
      }));
      return true;
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      return false;
    }
  }

  // Recuperar com validação
  recuperar(chave, maxAge = null) {
    try {
      const chaveCompleta = `${this.namespace}_${chave}`;
      const item = localStorage.getItem(chaveCompleta);
      
      if (!item) return null;
      
      const { dados, timestamp, versao } = JSON.parse(item);
      
      // Verificar se dados estão expirados
      if (maxAge && Date.now() - timestamp > maxAge) {
        this.remover(chave);
        return null;
      }
      
      return dados;
    } catch (erro) {
      console.error('Erro ao recuperar:', erro);
      return null;
    }
  }

  // Remover item
  remover(chave) {
    const chaveCompleta = `${this.namespace}_${chave}`;
    localStorage.removeItem(chaveCompleta);
  }

  // Limpar apenas dados do namespace
  limparNamespace() {
    Object.keys(localStorage)
      .filter(chave => chave.startsWith(`${this.namespace}_`))
      .forEach(chave => localStorage.removeItem(chave));
  }
}

// Uso
const storage = new ArmazenamentoLocal('meuApp');
storage.salvar('usuario', { nome: 'João', id: 123 });
const usuario = storage.recuperar('usuario', 24 * 60 * 60 * 1000); // Expira em 24h
```

### 2. Sistema de Cache com Expiração
```javascript
class CacheLocal {
  constructor() {
    this.prefixo = 'cache_';
  }

  set(chave, valor, ttl = 3600000) { // TTL padrão: 1 hora
    const item = {
      valor,
      expiraEm: Date.now() + ttl
    };
    localStorage.setItem(`${this.prefixo}${chave}`, JSON.stringify(item));
  }

  get(chave) {
    const itemStr = localStorage.getItem(`${this.prefixo}${chave}`);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    
    // Verificar expiração
    if (Date.now() > item.expiraEm) {
      this.delete(chave);
      return null;
    }
    
    return item.valor;
  }

  delete(chave) {
    localStorage.removeItem(`${this.prefixo}${chave}`);
  }

  // Limpar cache expirado
  limparExpirados() {
    Object.keys(localStorage)
      .filter(chave => chave.startsWith(this.prefixo))
      .forEach(chave => {
        this.get(chave.replace(this.prefixo, '')); // Get já limpa expirados
      });
  }
}
```

### 3. Observador de Mudanças (Cross-Tab)
```javascript
// Detectar mudanças no localStorage entre abas
window.addEventListener('storage', (evento) => {
  console.log('Storage alterado em outra aba:', {
    chave: evento.key,
    valorAntigo: evento.oldValue,
    valorNovo: evento.newValue,
    url: evento.url
  });

  // Sincronizar estado da aplicação
  if (evento.key === 'sessao_usuario') {
    const usuario = JSON.parse(evento.newValue || 'null');
    atualizarEstadoUsuario(usuario);
  }
});

// Disparar evento personalizado para sincronização
function sincronizarEntreAbas(chave, valor) {
  localStorage.setItem(chave, valor);
  // Disparar manualmente evento storage na mesma aba
  window.dispatchEvent(new StorageEvent('storage', {
    key: chave,
    oldValue: localStorage.getItem(chave),
    newValue: valor,
    url: window.location.href
  }));
}
```

---

## ⚠️ Armadilhas Comuns (Anti-Patterns)

### ❌ O que evitar:
```javascript
// 1. Armazenar dados sensíveis
localStorage.setItem('token_jwt', 'eyJhbGciOiJ...'); // ❌ Muito inseguro!
localStorage.setItem('senha_usuario', '123456');    // ❌ Nunca faça isso!

// 2. Não tratar quota excedida
function salvarGrandeDado(dados) {
  localStorage.setItem('grandeDado', JSON.stringify(dados)); // ❌ Pode lançar erro
}

// 3. Confiar cegamente em dados recuperados
const config = JSON.parse(localStorage.getItem('config'));
api.setTimeout(config.timeout); // ❌ Pode ser null/undefined

// 4. Não serializar objetos
localStorage.setItem('usuario', usuario); // ❌ Armazena "[object Object]"
```

### ✅ Melhores práticas:
```javascript
// 1. Use sessão ou tokens HTTP-only para dados sensíveis
// localStorage só para dados não sensíveis
localStorage.setItem('tema_preferido', 'escuro');
localStorage.setItem('idioma', 'pt-BR');

// 2. Tratar quota excedida
function salvarComSeguranca(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    if (erro.name === 'QuotaExceededError') {
      // Estratégia de fallback: limpar cache antigo
      const chaves = Object.keys(localStorage).sort((a, b) => {
        return localStorage.getItem(a).timestamp - localStorage.getItem(b).timestamp;
      });
      
      if (chaves.length > 0) {
        localStorage.removeItem(chaves[0]);
        salvarComSeguranca(chave, valor); // Tentar novamente
      }
    }
  }
}

// 3. Sempre validar dados
function getItemValidado(chave, padrao = null) {
  try {
    const item = localStorage.getItem(chave);
    return item ? JSON.parse(item) : padrao;
  } catch {
    return padrao;
  }
}

// 4. Serializar sempre
localStorage.setItem('usuario', JSON.stringify(usuario));
```

---

## 🛠️ Checklist de Qualidade no Armazenamento Local

- [ ] **Segurança:** Dados sensíveis (tokens, senhas, PII) não são armazenados?
- [ ] **Quota:** Há tratamento para erros de quota excedida?
- [ ] **Serialização:** Todos os dados são serializados/deserializados corretamente?
- [ ] **Validação:** Dados recuperados são validados antes do uso?
- [ ] **TTL:** Dados temporários têm expiração configurada?
- [ ] **Namespace:** Chaves usam namespace para evitar conflitos?
- [ ] **Limpeza:** Há rotina para limpar dados antigos/obsoletos?
- [ ] **Sincronização:** Mudanças são sincronizadas entre abas quando necessário?
- [ ] **Fallback:** Há fallback para quando storage não está disponível (modo privado)?
- [ ] **Performance:** Operações em massa são otimizadas (evitando loops desnecessários)?

---

## 🔧 Ferramentas e Bibliotecas Úteis

1.  **localForage:** Wrapper com fallback para IndexedDB/WebSQL e API Promise-based
2.  **store.js:** Biblioteca cross-browser para Web Storage
3.  **lscache:** Implementação de cache com expiração
4.  **DevTools Storage Inspector:** Ferramenta nativa para inspecionar Web Storage
5.  **CryptoJS:** Para criptografar dados antes do armazenamento (com cautela)
6.  **IndexedDB:** Para dados mais complexos e volumosos
7.  **Workbox:** Para estratégias avançadas de cache e offline

---

## 🎯 Exercícios Práticos Recomendados

1.  **Implemente um carrinho de compras** que persista entre sessões
2.  **Crie um editor de texto** com autosave automático a cada alteração
3.  **Desenvolva um tema dark/light** que lembre da preferência do usuário
4.  **Construa um app de notas** com rascunhos salvos localmente
5.  **Implemente cache de API** com invalidação por tempo e versão
6.  **Crie um jogo** que salve o progresso do jogador localmente

---

> **"O armazenamento local não é apenas uma memória, mas uma extensão da experiência do usuário — permitindo que aplicações web se lembrem, aprendam e se adaptem ao comportamento de quem as utiliza."**  
> *Baseado nas melhores práticas de UX e arquitetura front-end.*

**Próximo Passo:** Crie um sistema de favoritos para um site de produtos que persista localmente, implemente sincronização entre abas, e adicione uma funcionalidade de "exportar/importar" dados para backup.