# Capítulo 1: HTML Semântico 🏗️

## 🌟 Introdução: A Alma da Web
A semântica vai além de "tags que funcionam" — trata-se de **comunicação eficiente**. Ao escrever HTML semântico, você cria uma estrutura compreensível para o navegador, motores de busca (SEO) e, fundamentalmente, para tecnologias assistivas.

Historicamente, vivíamos a era da **"Div-ite"** (uso excessivo de `<div>`). Hoje, o HTML5 oferece um vocabulário preciso: enquanto uma `<div>` é um contêiner genérico, um `<main>` é uma área rotulada e organizada.

---

## 🎯 Por que a Semântica é Crucial?

1.  **♿ Acessibilidade (A11y):** Leitores de tela criam um "mapa mental" da página. Sem semântica, o usuário navega em um mar de elementos sem contexto.
2.  **🔍 SEO Avançado:** O Google prioriza a hierarquia. Tags como `<h1>` e `<article>` indicam o que é realmente relevante para indexação.
3.  **📱 Interoperabilidade:** Melhora o modo de "Leitura" de navegadores e a renderização em diferentes dispositivos.
4.  **👨‍💻 Manutenibilidade:** É mais fácil manter um `<nav>` explícito do que decifrar uma `<div class="container-links-top-final-2">`.

---

## 🧱 Anatomia de um Documento Moderno

### 🏠 Estrutura de Layout Principal
*   **`<header>`**: Identidade visual, busca e navegação.
*   **`<nav>`**: Bloco de links de navegação (interna ou externa).
*   **`<main>`**: Conteúdo principal e exclusivo da página. **Regra:** Apenas um por documento.
*   **`<footer>`**: Créditos, links de contato e políticas.

### 📝 Organização de Conteúdo
*   **`<article>`**: Conteúdo autônomo. Se pode ser "recortado" e lido em outro site (como um post de blog), use `article`.
*   **`<section>`**: Agrupamento temático de conteúdo relacionado.
*   **`<aside>`**: Conteúdo tangencial ou complementar (sidebars, anúncios, notas).

---

## 🚀 Guia de Referência: Tags de Texto

| Tag | Significado | Quando utilizar? |
| :--- | :--- | :--- |
| `<h1>` - `<h6>` | **Hierarquia** | Define a importância dos títulos. Nunca use apenas para alterar o tamanho da fonte. |
| `<p>` | **Parágrafo** | Blocos de texto narrativo ou descritivo. |
| `<ul>` / `<ol>` | **Listas** | `<ul>` para itens sem ordem; `<ol>` para sequências lógicas. |
| `<strong>` | **Importância** | Indica urgência ou seriedade (ênfase forte). |
| `<em>` | **Ênfase** | Altera a entonação da leitura (ênfase idiomática). |

---

## 💡 Boas Práticas vs. Anti-Patterns

### ❌ O que evitar (Má prática)
Elementos genéricos simulando comportamento nativo prejudicam a acessibilidade e o SEO.

```html
<!-- PROBLEMA: Não é focável via teclado e não tem semântica de título -->
<span class="titulo-custom">Meu Blog</span>
<div class="btn-fake" onclick="enviar()">Enviar</div>
```

### ✅ O que preferir (Boa prática)
Utilize os elementos nativos que já possuem comportamento e acessibilidade embutidos.

```html
<!-- SOLUÇÃO: Hierarquia clara e interatividade nativa -->
<h1>Meu Blog</h1>
<button type="submit">Enviar</button>
```

---

## 🛠️ Checklist de Qualidade

- [ ] Existe apenas **um** `<h1>` por página?
- [ ] A hierarquia de títulos respeita a ordem lógica (ex: não pula de `h2` para `h4`)?
- [ ] A página permanece legível se todo o **CSS for desabilitado**?
- [ ] Elementos interativos (links, botões) usam as tags corretas (`<a>` vs `<button>`)?
- [ ] O conteúdo principal está dentro da tag `<main>`?
- [ ] Listas de navegação estão dentro de um elemento `<nav>`?

---

> **Nota:** "HTML semântico não é um luxo, mas a fundação para uma web inclusiva."
> *Baseado nas diretrizes MDN Web Docs e WCAG.*

**Próximo Passo:** Abra o *DevTools* (F12) em sites de grandes portais e analise como eles estruturam o `<header>` e o `<main>`.