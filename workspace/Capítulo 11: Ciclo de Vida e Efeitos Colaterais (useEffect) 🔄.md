# Capítulo 11: Ciclo de Vida e Efeitos Colaterais (useEffect) 🔄

## 🌟 Introdução: A Arte de Sincronizar Mundos
`useEffect` não é apenas um Hook do React — é a **ponte entre o mundo declarativo dos componentes e o mundo imperativo do navegador**. Enquanto componentes React descrevem *o que* renderizar, `useEffect` gerencia *quando e como* interagir com tudo que está fora do controle direto do React: APIs, timers, manipulação direta do DOM, e qualquer operação que tenha efeitos além da renderização.

Historicamente, componentes de classe tinham métodos de ciclo de vida separados (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). Com `useEffect`, unificamos toda essa lógica em um único conceito: **sincronizar efeitos colaterais com o ciclo de vida do componente**.

---

## 🎯 Por que Efeitos Colaterais São um Problema Especial?

1.  **🌍 Fuga do Paradigma Declarativo:** React é sobre descrever UI baseada em props e estado. Efeitos colaterais são ações com consequências no mundo exterior.
2.  **⏰ Timing Complexo:** Quando executar código? Após renderizar? Antes do próximo render? Quando certas condições mudam?
3.  **🧹 Limpeza Necessária:** Algumas operações (como subscriptions ou timers) precisam ser desfeitas para evitar memory leaks.
4.  **🔄 Renderizações Repetidas:** Efeitos podem rodar múltiplas vezes — precisamos controlar quando isso é aceitável e quando é prejudicial.
5.  **🎭 Estados de Carregamento Assíncrono:** APIs, operações de rede e cálculos pesados introduzem estados intermediários que precisam ser gerenciados.

---

## 🧠 O Modelo Mental do useEffect

### 🔄 Do Ciclo de Vida para Sincronização
**Antigo pensamento (componentes de classe):**
"Preciso rodar este código quando o componente monta, e atualizá-lo quando certas props mudam."

**Novo pensamento (useEffect):**
"Preciso sincronizar este efeito colateral com o estado atual do componente. Quando certas dependências mudam, preciso atualizar o efeito."

### 🎯 As Três Partes Essenciais de Todo useEffect
```javascript
useEffect(
  () => {
    // 1. AÇÃO: O que executar
    const subscription = dataSource.subscribe();
    
    // 2. LIMPEZA: Como desfazer (opcional)
    return () => {
      subscription.unsubscribe();
    };
  },
  // 3. DEPENDÊNCIAS: Quando executar
  [dataSource]
);
```

---

## 📊 Os Quatro Padrões Fundamentais de useEffect

### 1. ⚡ Efeito Que Executa Apenas uma Vez (onMount)
```javascript
// Simula componentDidMount
useEffect(() => {
  console.log('Componente montado!');
  // Buscar dados iniciais
  // Configurar listeners globais
  // Inicializar bibliotecas de terceiros
  
  return () => {
    console.log('Componente desmontado!');
    // Limpar listeners
    // Cancelar requests pendentes
  };
}, []); // Array vazio = nenhuma dependência
```

**Quando usar:** Inicializações que não dependem de props ou estado.

### 2. 🔄 Efeito Que Executa em Cada Renderização
```javascript
// CUIDADO: Geralmente anti-pattern!
useEffect(() => {
  console.log('Renderizou!');
}); // Sem array de dependências
```

**Quando (não) usar:** Quase nunca. Pode causar loops infinitos ou problemas de performance.

### 3. 🎯 Efeito Controlado por Dependências
```javascript
// Simula componentDidUpdate condicional
useEffect(() => {
  if (userId) {
    buscarDadosDoUsuario(userId);
  }
}, [userId]); // Executa quando userId muda
```

**Quando usar:** 90% dos casos — quando seu efeito depende de valores específicos.

### 4. ⏱️ Efeito com Limpeza
```javascript
useEffect(() => {
  const intervalId = setInterval(() => {
    atualizarContador(c => c + 1);
  }, 1000);
  
  // Função de limpeza
  return () => {
    clearInterval(intervalId);
  };
}, []);
```

**Quando usar:** Qualquer efeito que aloque recursos (timers, subscriptions, event listeners).

---

## 🧩 O Sistema de Dependências Desmistificado

### 🎯 Como React Decide Quando Executar Efeitos
React compara o array de dependências **referência por referência** (Object.is comparison):
- Mesmo valor primitivo? ✅ Não re-executa
- Mesma referência de objeto/array? ✅ Não re-executa
- Nova referência? ❌ Re-executa

### ⚠️ As Armadilhas das Dependências
```javascript
// ❌ PROBLEMA: Nova referência a cada render
useEffect(() => {
  console.log(objeto.nome);
}, [objeto]); // objeto é recriado a cada render

// ✅ SOLUÇÃO 1: Valores específicos
useEffect(() => {
  console.log(objeto.nome);
}, [objeto.nome]); // Depende apenas do nome

// ✅ SOLUÇÃO 2: useMemo para referência estável
const objetoEstavel = useMemo(() => ({
  nome: 'João'
}), []);

useEffect(() => {
  console.log(objetoEstavel.nome);
}, [objetoEstavel]); // Referência estável
```

### 🎯 A Regra do ESLint Exhaustive-Deps
```javascript
// ❌ ESLint vai reclamar
useEffect(() => {
  console.log(propA, propB);
}, [propA]); // propB faltando!

// ✅ Correto
useEffect(() => {
  console.log(propA, propB);
}, [propA, propB]); // Todas dependências declaradas
```

**Por que seguir esta regra:** Previne bugs sutis onde efeitos usam valores stale.

---

## 💡 Padrões Avançados de Efeitos

### 1. 📡 Fetch de Dados com Estados Completo
```javascript
function useFetch(url) {
  const [estado, setEstado] = useState({
    dados: null,
    carregando: true,
    erro: null
  });

  useEffect(() => {
    let cancelado = false;
    
    async function buscar() {
      try {
        setEstado(e => ({ ...e, carregando: true, erro: null }));
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        if (!cancelado) {
          setEstado({ dados, carregando: false, erro: null });
        }
      } catch (erro) {
        if (!cancelado) {
          setEstado(e => ({ ...e, carregando: false, erro }));
        }
      }
    }

    buscar();
    
    // Cleanup para evitar state updates após desmontar
    return () => {
      cancelado = true;
    };
  }, [url]); // Re-executa quando URL muda

  return estado;
}
```

### 2. 🎭 Controlando Execuções com useRef
```javascript
function ComponenteComEfeitoPesado() {
  const [contador, setContador] = useState(0);
  const executandoRef = useRef(false);

  useEffect(() => {
    // Evitar execução simultânea
    if (executandoRef.current) {
      return;
    }
    
    executandoRef.current = true;
    
    // Operação pesada
    operacaoPesada().then(() => {
      executandoRef.current = false;
    });
  }, [contador]);

  // ...
}
```

### 3. 🔄 Efeitos que Dependem do Estado Anterior
```javascript
function ContadorComLog() {
  const [contador, setContador] = useState(0);
  const contadorAnteriorRef = useRef(contador);

  useEffect(() => {
    contadorAnteriorRef.current = contador;
  });

  useEffect(() => {
    console.log(`Contador mudou de ${contadorAnteriorRef.current} para ${contador}`);
  }, [contador]);

  // ...
}
```

---

## ⚠️ Anti-Patterns Comuns (e Como Evitá-los)

### ❌ Efeito para Sincronizar Estado com Estado
```javascript
// ❌ ANTI-PATTERN: Efeito desnecessário
const [a, setA] = useState(0);
const [b, setB] = useState(0);

useEffect(() => {
  setB(a * 2); // Derivação de estado no efeito
}, [a]);

// ✅ SOLUÇÃO: Calcular durante renderização
const b = a * 2; // Simplesmente calcule!
const [a, setA] = useState(0);
// b não precisa ser estado!
```

### ❌ Efeitos com Dependências em Loop
```javascript
// ❌ LOOP INFINITO
const [contador, setContador] = useState(0);

useEffect(() => {
  setContador(contador + 1); // Atualiza dependência!
}, [contador]); // Que causa re-execução...

// ✅ SOLUÇÃO: useCallback ou condição
useEffect(() => {
  if (contador < 10) {
    setContador(c => c + 1);
  }
}, [contador]);
```

### ❌ Esquecer Limpeza
```javascript
// ❌ MEMORY LEAK
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Esqueceu: removeEventListener!
}, []);

// ✅ SEMPRE limpe quando necessário
useEffect(() => {
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

---

## 🧪 O Ciclo de Vida Visualizado

```
MOUNTING
    ↓
Render Inicial
    ↓
useEffect(() => {}, []) → Executa após render
    ↓
UPDATING
    ↓
Props/State Change
    ↓
Render
    ↓
useEffect(() => {}, [deps]) → Executa se deps mudaram
    ↓
UNMOUNTING
    ↓
Componente será removido
    ↓
Função de limpeza executa ← Retorno do useEffect
```

---

## 🛠️ Checklist: Quando Usar useEffect

**Use useEffect para:**
- [ ] Buscar dados de APIs externas
- [ ] Inscrever-se em event listeners do navegador
- [ ] Manipular o DOM diretamente (quando necessário)
- [ ] Configurar timers ou intervals
- [ ] Logging ou analytics baseados em mudanças
- [ ] Sincronizar com localStorage ou outras APIs do navegador

**NÃO use useEffect para:**
- [ ] Derivar estado de outro estado (calcule durante render)
- [ ] Manipular estado baseado em props iniciais (use initialState)
- [ ] Lidar com eventos de UI (use event handlers)
- [ ] Executar código em resposta a ações específicas do usuário
- [ ] Otimizações prematuramente

---

## 🔮 A Evolução: De useEffect para Hooks Modernos

### 🎯 Quando useEffect é Demais
Para certos casos, surgiram Hooks mais específicos:

1. **useLayoutEffect:** Para manipulações de DOM que devem acontecer sincronamente antes da pintura
2. **useInsertionEffect:** Para injetar estilos dinamicamente
3. **Bibliotecas especializadas:**
   - `react-query` / `swr` para fetching de dados
   - `@tanstack/router` para navegação
   - Bibliotecas de estado para gerenciamento complexo

### 💡 A Filosofia por Trás dos Efeitos
O objetivo final não é usar useEffect, mas **minimizar efeitos colaterais**. O React ideal é quase puramente declarativo. useEffect existe para lidar com a realidade impura do mundo exterior, mas sempre com parcimônia.

---

## 🎯 Exercícios Práticos Recomendados

1. **Crie um custom Hook `useLocalStorage`** que sincroniza estado com localStorage
2. **Implemente um debounced search** que busca na API apenas após o usuário parar de digitar
3. **Construa um component de polling** que busca dados periodicamente e limpa o timer ao desmontar
4. **Desenvolva um hook `useWindowSize`** que fornece dimensões da janela e atualiza no resize
5. **Crie um sistema de analytics** que registra pageviews quando a URL muda

---

> **"Dominar useEffect é como aprender a nadar nas correntes do tempo do React: você precisa saber quando mergulhar, quanto tempo ficar submerso, e como sair sem ser arrastado pelos ciclos de renderização."**

**Próximo Passo:** Pegue um componente que faz fetch de dados com `useEffect` e refatore-o para lidar com:
1. Estados de loading e erro
2. Cancelamento de requests pendentes
3. Atualizações quando dependências mudam muito rápido
4. Cache básico para evitar re-fetches desnecessários

**Lembre-se:** Um useEffect bem escrito é quase invisível — ele simplesmente mantém o mundo exterior sincronizado com sua UI, sem chamar atenção para si mesmo.