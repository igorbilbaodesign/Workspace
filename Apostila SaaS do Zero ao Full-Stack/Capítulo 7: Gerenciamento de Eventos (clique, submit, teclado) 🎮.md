# Capítulo 7: Gerenciamento de Eventos (clique, submit, teclado) 🎮

## 🌟 Introdução: A Conversa entre Usuário e Interface
O gerenciamento de eventos não é apenas sobre "ouvir cliques" — trata-se de **criar um diálogo fluido entre o usuário e a aplicação**, onde cada interação é compreendida, processada e respondida de forma contextual. Em uma interface moderna, os eventos são a tradução digital dos gestos humanos, transformando intenções em ações específicas e resultados visíveis.

Historicamente, usávamos atributos inline como `onclick` que misturavam lógica com marcação. Hoje, com o sistema de eventos do DOM, podemos criar aplicações desacopladas, reativas e acessíveis, capazes de lidar com interações complexas de múltiplos dispositivos.

---

## 🎯 Por que Dominar o Gerenciamento de Eventos?

1.  **🖱️ Interatividade Rica:** Transforma interfaces estáticas em experiências dinâmicas que respondem a cada gesto do usuário.
2.  **⌨️ Acessibilidade Universal:** Garante que todas as interações funcionem tanto com mouse quanto com teclado, incluindo tecnologias assistivas.
3.  **⚡ Performance Otimizada:** Técnicas como delegação de eventos e throttling melhoram significativamente a responsividade.
4.  **🧩 Manutenibilidade:** Separa claramente a lógica de interação da estrutura HTML, seguindo princípios de arquitetura limpa.
5.  **📱 Multiplataforma:** Suporta consistentemente interações de toque, mouse, teclado e até comandos de voz.

---

## 🧱 O Sistema de Eventos do DOM

### 1. As Três Fases de Propagação
```javascript
// 1. Fase de Captura (do window até o alvo)
elemento.addEventListener('click', handler, true);

// 2. Fase no Alvo (no elemento que disparou)
elemento.addEventListener('click', handler);

// 3. Fase de Bubbling (do alvo até o window)
elemento.addEventListener('click', handler, false); // false é o padrão
```

### 2. Objeto Event e suas Propriedades
```javascript
function handleEvent(evento) {
  console.log('Tipo:', evento.type); // 'click', 'keydown', etc
  console.log('Alvo:', evento.target); // Elemento que disparou
  console.log('Atual:', evento.currentTarget); // Elemento com listener
  console.log('Coordenadas:', evento.clientX, evento.clientY);
  console.log('Tecla:', evento.key, evento.code);
  console.log('PreventDefault:', evento.defaultPrevented);
  console.log('Fase:', evento.eventPhase); // 1=captura, 2=alvo, 3=bubbling
}
```

---

## 🚀 Guia de Referência: Tipos de Eventos Essenciais

| Categoria | Eventos Comuns | Casos de Uso | Boas Práticas |
| :--- | :--- | :--- | :--- |
| **Mouse** | `click`, `dblclick`, `mouseenter`, `mouseleave`, `mousemove`, `contextmenu` | Botões, hover effects, menus | Use `mouseenter/mouseleave` em vez de `mouseover/mouseout` |
| **Teclado** | `keydown`, `keyup`, `keypress` (depreciado) | Formulários, atalhos, jogos | Verifique `event.key` para teclas específicas |
| **Formulário** | `submit`, `change`, `input`, `focus`, `blur`, `reset` | Validação, autocomplete | Use `input` para tempo real, `change` para finalização |
| **Toque** | `touchstart`, `touchmove`, `touchend`, `touchcancel` | Mobile, gestos | Implemente fallback para mouse |
| **Foco** | `focus`, `blur`, `focusin`, `focusout` | Acessibilidade, validação | `focusin/out` propagam, `focus/blur` não |
| **Janela** | `load`, `DOMContentLoaded`, `resize`, `scroll` | Layout responsivo | Debounce eventos de `resize` e `scroll` |

---

## 💡 Padrões Avançados e Boas Práticas

### 1. Delegação de Eventos (Event Delegation)
```javascript
// ❌ Ineficiente: Adiciona listener a cada item
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Eficiente: Um listener no pai
document.getElementById('lista').addEventListener('click', (evento) => {
  // Verifica se o clique foi em um item
  if (evento.target.matches('.item')) {
    console.log('Item clicado:', evento.target.dataset.id);
  }
  
  // Verifica se foi em um botão dentro do item
  const botao = evento.target.closest('.botao-excluir');
  if (botao) {
    const item = botao.closest('.item');
    excluirItem(item.dataset.id);
  }
});
```

### 2. Gerenciamento de Eventos em Aplicações Complexas
```javascript
class GerenciadorEventos {
  constructor() {
    this.handlers = new Map();
    this.elementos = new WeakMap();
  }

  registrar(elemento, tipo, handler, opcoes = {}) {
    const chave = `${tipo}_${Math.random().toString(36).substr(2, 9)}`;
    
    const handlerWrapper = (evento) => {
      if (opcoes.once) {
        this.removerPorChave(chave);
      }
      handler.call(elemento, evento);
    };

    this.handlers.set(chave, { elemento, tipo, handler: handlerWrapper });
    
    if (!this.elementos.has(elemento)) {
      this.elementos.set(elemento, new Set());
    }
    this.elementos.get(elemento).add(chave);

    elemento.addEventListener(tipo, handlerWrapper, opcoes);
    return chave;
  }

  removerPorChave(chave) {
    const { elemento, tipo, handler } = this.handlers.get(chave) || {};
    if (elemento && handler) {
      elemento.removeEventListener(tipo, handler);
      this.handlers.delete(chave);
      
      const chavesElemento = this.elementos.get(elemento);
      if (chavesElemento) {
        chavesElemento.delete(chave);
        if (chavesElemento.size === 0) {
          this.elementos.delete(elemento);
        }
      }
    }
  }

  removerTodosDoElemento(elemento) {
    const chaves = this.elementos.get(elemento);
    if (chaves) {
      chaves.forEach(chave => this.removerPorChave(chave));
    }
  }
}

// Uso
const gerenciador = new GerenciadorEventos();
const idEvento = gerenciador.registrar(botao, 'click', handleClick, { once: true });
```

### 3. Throttling e Debouncing para Eventos de Alta Frequência
```javascript
// Debounce: Executa após uma pausa
function debounce(funcao, tempo, immediate = false) {
  let timeout;
  return function executada(...args) {
    const contexto = this;
    const maisTarde = () => {
      timeout = null;
      if (!immediate) funcao.apply(contexto, args);
    };
    
    const chamarAgora = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(maisTarde, tempo);
    
    if (chamarAgora) funcao.apply(contexto, args);
  };
}

// Throttle: Executa no máximo uma vez por período
function throttle(funcao, tempo) {
  let emEspera = false;
  let ultimosArgs = null;
  
  return function executada(...args) {
    if (!emEspera) {
      funcao.apply(this, args);
      emEspera = true;
      
      setTimeout(() => {
        emEspera = false;
        if (ultimosArgs) {
          executada.apply(this, ultimosArgs);
          ultimosArgs = null;
        }
      }, tempo);
    } else {
      ultimosArgs = args;
    }
  };
}

// Uso
window.addEventListener('resize', debounce(() => {
  console.log('Janela redimensionada');
  atualizarLayout();
}, 250));

canvas.addEventListener('mousemove', throttle((evento) => {
  desenhar(evento.clientX, evento.clientY);
}, 16)); // ~60fps
```

### 4. Eventos Personalizados para Comunicação entre Componentes
```javascript
// Criando e disparando eventos personalizados
function criarEventoPersonalizado(nome, detalhes) {
  return new CustomEvent(nome, {
    bubbles: true, // Permite que o evento se propague
    cancelable: true, // Permite preventDefault()
    composed: true, // Atravessa shadow DOM
    detail: detalhes // Dados customizados
  });
}

// Componente A dispara evento
botao.addEventListener('click', () => {
  const evento = criarEventoPersonalizado('itemAdicionado', {
    id: 123,
    nome: 'Produto X'
  });
  document.dispatchEvent(evento);
});

// Componente B escuta
document.addEventListener('itemAdicionado', (evento) => {
  console.log('Item adicionado:', evento.detail);
  atualizarCarrinho(evento.detail);
});
```

---

## ⚠️ Armadilhas Comuns (Anti-Patterns)

### ❌ O que evitar:
```javascript
// 1. Inline handlers (mistura HTML com JavaScript)
<button onclick="handleClick()">Clicar</button> // ❌

// 2. Adicionar múltiplos listeners iguais
elemento.addEventListener('click', handler);
elemento.addEventListener('click', handler); // ❌ Duplicado

// 3. Não remover listeners em elementos temporários
function criarElementoTemporario() {
  const elemento = document.createElement('div');
  elemento.addEventListener('click', () => console.log('clicado'));
  document.body.appendChild(elemento);
  // ❌ Nunca remove o listener
}

// 4. Usar `return false` em listeners
elemento.onclick = function() {
  return false; // ❌ Comportamento inconsistente
}

// 5. Confundir `event.target` com `event.currentTarget`
elemento.addEventListener('click', (evento) => {
  console.log(evento.target); // ❌ Pode ser filho do elemento
  console.log(evento.currentTarget); // ✅ Sempre o elemento com listener
});
```

### ✅ Melhores práticas:
```javascript
// 1. Use addEventListener separadamente
botao.addEventListener('click', handleClick);

// 2. Armazene referência para remoção
const handler = () => console.log('clicado');
elemento.addEventListener('click', handler);
// ... mais tarde
elemento.removeEventListener('click', handler);

// 3. Use AbortController para cleanup
const controller = new AbortController();
elemento.addEventListener('click', handler, { signal: controller.signal });
// Para remover todos os listeners deste controller
controller.abort();

// 4. Use preventDefault e stopPropagation explicitamente
form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // ✅ Explícito
  if (!validarFormulario()) {
    evento.stopPropagation(); // ✅ Explícito
    return;
  }
  enviarFormulario();
});

// 5. Use event delegation para elementos dinâmicos
document.addEventListener('click', (evento) => {
  if (evento.target.closest('.botao-dinamico')) {
    console.log('Botão dinâmico clicado');
  }
});
```

---

## 🛠️ Checklist de Qualidade no Gerenciamento de Eventos

- [ ] **Delegação:** Eventos em elementos dinâmicos usam delegação?
- [ ] **Limpeza:** Todos os listeners são removidos quando elementos são destruídos?
- [ ] **Acessibilidade:** Todas as interações funcionam via teclado (Tab, Enter, Space)?
- [ ] **Throttling/Debouncing:** Eventos de alta frequência são otimizados?
- [ ] **Propagação:** O fluxo de propagação é controlado quando necessário?
- [ ] **Prevenção:** `preventDefault()` é usado apenas quando necessário?
- [ ] **Separação:** Lógica de eventos está separada do HTML?
- [ ] **Cross-browser:** Eventos funcionam em todos os navegadores suportados?
- [ ] **Toque/Mouse:** Há suporte adequado para ambos os tipos de interação?
- [ ] **Performance:** Não há listeners desnecessários ou duplicados?

---

## 🔧 Ferramentas e APIs Modernas

1.  **AbortController:** Para cancelar múltiplos listeners de uma vez
2.  **Passive Event Listeners:** Melhora performance de eventos como `touch` e `wheel`
3.  **Event.composedPath():** Retorna o caminho de propagação completo
4.  **KeyboardEvent.key:** Padronizado para identificar teclas
5.  **Pointer Events:** Unifica mouse, touch e pen
6.  **getEventListeners():** No DevTools para debugging
7.  **EventTarget.dispatchEvent():** Para disparar eventos programaticamente

---

## 🎯 Exercícios Práticos Recomendados

1.  **Crie um menu dropdown** que fecha ao clicar fora ou pressionar ESC
2.  **Implemente um sistema de atalhos** (Ctrl+S salvar, Ctrl+Z desfazer)
3.  **Desenvolva um slider arrastável** com suporte a mouse e touch
4.  **Construa um formulário** com validação em tempo real e navegação por Tab
5.  **Crie um canvas interativo** que responda a múltiplos tipos de entrada
6.  **Implemente um carrossel** com navegação por teclas, swipe e botões
7.  **Desenvolva um jogo simples** que responda a múltiplos inputs simultâneos

---

> **"O verdadeiro domínio do gerenciamento de eventos não está em responder a ações, mas em antecipar intenções — criando interfaces que parecem ler a mente do usuário antes mesmo do clique acontecer."**  
> *Baseado nas melhores práticas de UX e acessibilidade web.*

**Próximo Passo:** Escolha uma interface complexa (como um player de vídeo ou editor de texto) e implemente todos os controles usando apenas eventos nativos, garantindo acessibilidade completa via teclado e compatibilidade com dispositivos touch.