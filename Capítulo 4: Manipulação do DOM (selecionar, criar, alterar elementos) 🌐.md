# Capítulo 4: Manipulação do DOM (selecionar, criar, alterar elementos) 🌐

## 🌟 Introdução: A Ponte entre Dados e Interface
A manipulação do Document Object Model (DOM) não é apenas sobre alterar a página — trata-se de **gerenciar dinamicamente a representação visual dos dados** para criar experiências interativas e responsivas. Em uma aplicação web moderna, o DOM é a interface entre o código JavaScript e o que o usuário vê e com o qual interage.

Historicamente, as APIs DOM eram verbosas e inconsistentes entre navegadores. Hoje, com métodos modernos e a evolução das especificações, podemos manipular a árvore de elementos de forma eficiente e performática, utilizando tanto métodos clássicos quanto novos auxiliares.

---

## 🎯 Por que Dominar a Manipulação do DOM?

1.  **🔄 Interatividade Dinâmica:** Permite criar aplicações que respondem em tempo real às ações do usuário sem recarregar a página.
2.  **⚡ Performance Aprimorada:** Métodos modernos como `documentFragment` e `MutationObserver` permitem atualizações eficientes, essenciais para SPAs (Single Page Applications).
3.  **🧩 Modularidade:** A capacidade de criar e injetar componentes dinamicamente é a base de frameworks como React e Vue.
4.  **🔍 Controle Preciso:** Acesso a todos os elementos da página, permitindo desde alterações simples até complexas reestruturações.

---

## 🧱 Métodos Essenciais de Manipulação

### 🔍 Seleção de Elementos

**Métodos Clássicos (ainda úteis):**
```javascript
// Retorna o primeiro elemento que casa com o seletor
const elemento = document.querySelector('.classe');

// Retorna uma NodeList (estática) de todos os elementos que casam
const elementos = document.querySelectorAll('div');

// Seleção por id, tag ou classe (menos flexível)
const header = document.getElementById('header');
const divs = document.getElementsByTagName('div');
const botoes = document.getElementsByClassName('botao');
```

**Seleção Moderna e Específica:**
```javascript
// Seleciona o primeiro elemento com data-atributo específico
const elementoData = document.querySelector('[data-testid="user-card"]');

// Seleciona dentro de um contexto (útil para componentes)
const container = document.querySelector('.container');
const botoesInternos = container.querySelectorAll('button');

// Seleção complexa com pseudo-classes
const ultimoItem = document.querySelector('li:last-child');
const inputsInvalidos = document.querySelectorAll('input:invalid');
```

### 🏗️ Criação de Elementos

**Abordagem Tradicional:**
```javascript
// Criar elemento
const novoDiv = document.createElement('div');
novoDiv.className = 'card';
novoDiv.textContent = 'Novo Card';

// Adicionar à página
document.body.appendChild(novoDiv);
```

**Abordagem Moderna com Template Strings e `insertAdjacentHTML`:**
```javascript
// Criação rápida com template strings
const cardHTML = `
  <div class="card">
    <h3>Título</h3>
    <p>Conteúdo do card</p>
  </div>
`;

// Inserção eficiente
container.insertAdjacentHTML('beforeend', cardHTML);
```

### ✏️ Modificação de Elementos

**Propriedades e Métodos Comuns:**
```javascript
// Conteúdo textual
elemento.textContent = 'Novo texto'; // Apenas texto, mais seguro
elemento.innerHTML = '<strong>Texto</strong> formatado'; // HTML

// Classes
elemento.classList.add('ativo', 'destaque'); // Adiciona múltiplas
elemento.classList.remove('inativo');
elemento.classList.toggle('visivel'); // Alterna

// Atributos
elemento.setAttribute('data-id', '123');
const id = elemento.getAttribute('data-id');
elemento.removeAttribute('title');

// Estilos (evite quando possível, prefira classes CSS)
elemento.style.color = 'red';
elemento.style.setProperty('--cor-tema', '#ff0000');
```

---

## 🚀 Guia de Referência: Posicionamento de Inserção

| Método | Posição Relativa | Uso Comum |
| :--- | :--- | :--- |
| `appendChild()` | Dentro, no final | Adicionar como último filho |
| `insertBefore()` | Dentro, antes de referência | Inserir em posição específica |
| `insertAdjacentHTML()` | Várias opções | Inserção rápida de HTML |
| `replaceChild()` | Substituição | Trocar elemento existente |

**`insertAdjacentHTML` positions:**
- `'beforebegin'`: Antes do elemento
- `'afterbegin'`: Dentro, no início
- `'beforeend'`: Dentro, no final
- `'afterend'`: Depois do elemento

---

## 💡 Padrões Avançados de Manipulação

### 1. DocumentFragment para Performance
```javascript
// Criar múltiplos elementos sem reflow repetido
const fragmento = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  fragmento.appendChild(item);
}

// Apenas um reflow ao adicionar tudo de uma vez
lista.appendChild(fragmento);
```

### 2. Delegation de Eventos
```javascript
// Em vez de adicionar evento a cada elemento, adicione ao pai
lista.addEventListener('click', (evento) => {
  if (evento.target.matches('li.item')) {
    console.log('Item clicado:', evento.target.textContent);
  }
});
```

### 3. Observer para Mudanças no DOM
```javascript
// Monitorar alterações na árvore DOM
const observer = new MutationObserver((mutacoes) => {
  mutacoes.forEach((mutacao) => {
    console.log('Tipo:', mutacao.type);
    console.log('Alterado:', mutacao.target);
  });
});

observer.observe(container, {
  childList: true,
  subtree: true,
  attributes: true
});
```

---

## ⚠️ Armadilhas Comuns (Anti-Patterns)

### ❌ O que evitar:
```javascript
// 1. Seleção repetida no loop (performance)
for (let i = 0; i < 100; i++) {
  const elemento = document.querySelector('.item'); // ❌ Seleciona 100x
  // ...
}

// 2. innerHTML para conteúdo textual (vulnerabilidade XSS)
elemento.innerHTML = conteudoUsuario; // ❌ Perigoso se não sanitizado

// 3. Atualizações sincronizadas com layout (reflow custoso)
for (let i = 0; i < elementos.length; i++) {
  elementos[i].style.width = novoWidth + 'px'; // ❌ Reflow a cada iteração
}
```

### ✅ Melhores práticas:
```javascript
// 1. Cache de seleções
const itens = document.querySelectorAll('.item'); // ✅ Seleciona uma vez
itens.forEach(item => { /* ... */ });

// 2. Uso seguro de conteúdo
elemento.textContent = conteudoUsuario; // ✅ Seguro
// Ou sanitize antes de usar innerHTML
elemento.innerHTML = DOMPurify.sanitize(conteudoHTML);

// 3. Batch de atualizações de estilo
// Usando classe
elemento.classList.add('nova-largura');

// Ou requestAnimationFrame para animações
requestAnimationFrame(() => {
  elementos.forEach(el => {
    el.style.transform = `translateX(${offset}px)`;
  });
});
```

---

## 🛠️ Checklist de Qualidade na Manipulação DOM

- [ ] **Cache de seleções:** Elementos frequentemente acessados são armazenados em variáveis?
- [ ] **Delegação de eventos:** Eventos dinâmicos usam delegação quando apropriado?
- [ ] **Performance:** Operações em massa usam `DocumentFragment` ou `innerHTML`?
- [ ] **Segurança:** `innerHTML` é evitado com conteúdo não confiável?
- [ ] **Acessibilidade:** Elementos dinâmicos mantêm foco e semântica adequada?
- [ ] **Cleanup:** Event listeners são removidos quando elementos são destruídos?
- [ ] **Separação:** Lógica de manipulação DOM é separada da lógica de negócio?
- [ ] **Testabilidade:** A manipulação pode ser testada sem ambiente de navegador?

---

## 🔧 Ferramentas e APIs Modernas

1.  **`matches()`:** Verifica se elemento casa com seletor CSS
2.  **`closest()`:** Encontra ancestral mais próximo que case com seletor
3.  **`IntersectionObserver`:** Detecta quando elemento entra/sai da viewport
4.  **`ResizeObserver`:** Observa mudanças de tamanho de elementos
5.  **`getBoundingClientRect()`:** Medições precisas de posição e tamanho
6.  **`DOMPurify`:** Biblioteca para sanitização de HTML

---

## 🎯 Exercícios Práticos Recomendados

1.  **Crie um gerador de tabela** que converte arrays de objetos em tabelas HTML
2.  **Implemente um sistema de tabs** usando apenas JavaScript puro
3.  **Construa um componente de modal** dinâmico com foco gerenciado
4.  **Desenvolva uma lista ordenável** com drag-and-drop nativo
5.  **Crie um formulário dinâmico** que adiciona/remove campos

---

> **"A manipulação eficiente do DOM não é sobre fazer a página piscar, mas sobre criar interfaces que respondem às necessidades do usuário de forma suave e previsível."**  
> *Baseado nas melhores práticas de performance e acessibilidade web.*

**Próximo Passo:** Pegue uma interface estática e adicione interatividade usando apenas JavaScript puro - como um filtro de lista, um carrossel de imagens ou um sistema de favoritos que persiste no `localStorage`.