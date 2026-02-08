# Capítulo 21: Autenticação e Autorização (JWT, OAuth) 🔐

## 🌟 Introdução: A Arte de Saber Quem é Quem (e o que Pode Fazer)
Autenticação e autorização não são apenas sobre senhas e permissões — são sobre **estabelecer e gerenciar identidades digitais** em um mundo onde cada interação pode vir de qualquer lugar, a qualquer momento, com intenções diversas. Enquanto a autenticação responde "você é quem diz ser?", a autorização pergunta "o que você tem permissão para fazer?". Juntas, elas formam o sistema nervoso da segurança em aplicações modernas.

Historicamente, sessões no servidor e cookies dominavam a segurança web. Hoje, com APIs distribuídas, microserviços e clientes múltiplos (web, mobile, desktop), JWT e OAuth emergiram como padrões que permitem segurança escalável e flexível. Eles representam não apenas tecnologias, mas uma mudança fundamental em como pensamos sobre identidade e acesso em sistemas distribuídos.

---

## 🎯 Por que Identidade e Acesso São os Pilares da Confiança Digital?

1.  **🆔 Identidade como Fundação:** Toda interação significativa em sistemas digitais começa com uma identidade verificada — não apenas para segurança, mas para personalização, auditoria e responsabilidade.
2.  **🔐 Segurança em Camadas:** Autenticação forte protege contra acesso não autorizado, enquanto autorização granular controla exatamente o que cada identidade pode fazer.
3.  **🌐 Acesso Universal Controlado:** Usuários esperam logar uma vez e acessar múltiplos serviços (Single Sign-On) sem sacrificar segurança.
4.  **📱 Multiplataforma Nativa:** APIs modernas precisam servir web, mobile, desktop e dispositivos IoT com o mesmo sistema de segurança.
5.  **⚡ Experiência do Usuário vs Segurança:** Encontrar o equilíbrio entre facilidade de uso (login social, "lembrar-me") e robustez de segurança (2FA, verificação de dispositivo).
6.  **🔍 Rastreabilidade Completa:** Saber não apenas quem fez o que, mas quando, de onde e com que permissões.

---

## 🧠 Os Dois Mundos da Identidade Digital

### 🆔 Autenticação: Prova de Identidade
**Filosofia:** "Como você prova que é você?"

**Os Três Fatores de Autenticação:**
1.  **Algo que você sabe:** Senha, PIN, resposta secreta
2.  **Algo que você tem:** Smartphone (app autenticador), token físico, certificado digital
3.  **Algo que você é:** Biometria (impressão digital, reconhecimento facial)

**Evolução:** De senhas únicas → senhas com hash e salt → autenticação multifator → passwordless (magic links, WebAuthn)

### 🚦 Autorização: Gestão de Permissões
**Filosofia:** "O que você pode fazer agora que sabemos quem você é?"

**Modelos de Autorização:**
- **RBAC (Role-Based Access Control):** Permissões baseadas em papéis (admin, usuário, moderador)
- **ABAC (Attribute-Based Access Control):** Permissões baseadas em atributos (departamento, senioridade, localização)
- **PBAC (Policy-Based Access Control):** Regras complexas que consideram múltiplos fatores

---

## 🔥 JWT (JSON Web Tokens): As Credenciais Portáteis

### 🎯 A Filosofia do JWT
JWT não é apenas um token — é um **documento de identidade autocontido** que permite que serviços verifiquem quem você é e o que pode fazer sem consultar um banco de dados central. Pense nele como um passaporte digital: contém sua identidade, validade e recursos de segurança, tudo em um formato que qualquer país (serviço) pode verificar.

### 🏗️ A Anatomia de um JWT
```
header.payload.signature
```

**1. Header (Cabeçalho):** Metadados sobre o token
```json
{
  "alg": "HS256",       // Algoritmo de assinatura
  "typ": "JWT"         // Tipo do token
}
```

**2. Payload (Carga útil):** Os "claims" ou declarações sobre a identidade
```json
{
  "sub": "1234567890",  // Subject (identificador único do usuário)
  "name": "João Silva",
  "email": "joao@email.com",
  "roles": ["user", "premium"],
  "iat": 1516239022,    // Issued at (emitido em)
  "exp": 1516242622     // Expiration (expira em)
}
```

**3. Signature (Assinatura):** Garantia de integridade
```
HMACSHA256(
  base64UrlEncode(header) + "." + 
  base64UrlEncode(payload),
  secret
)
```

### ⚡ Por que JWT Revolucionou APIs Modernas

**Vantagens:**
- **Stateless:** Servidores não precisam armazenar sessões
- **Escalável:** Qualquer servidor pode verificar tokens sem banco de dados compartilhado
- **Auto-contido:** Todas as informações necessárias estão no próprio token
- **Flexível:** Pode ser usado em qualquer cliente (web, mobile, IoT)

**Desvantagens:**
- **Irrevogabilidade:** Tokens válidos até a expiração (solução: refresh tokens curtos)
- **Tamanho:** Maior que session IDs tradicionais (cada requisição carrega mais dados)
- **Exposição de Dados:** Payload é apenas base64 encoded (não criptografado por padrão)

### 🔄 O Ciclo de Vida de um Token JWT
```
Login → Servidor valida credenciais → Gera Access Token (curto) e Refresh Token (longo) → Cliente armazena → Cliente envia Access Token em cada requisição → Servidor verifica assinatura e expiração → Se expirado, usa Refresh Token para novo Access Token
```

### 🛡️ Boas Práticas com JWT
1.  **Tokens Curtos:** Access tokens de 15-30 minutos, refresh tokens de 7 dias
2.  **HTTPS Sempre:** Tokens trafegam apenas em conexões criptografadas
3.  **Storage Seguro:** HttpOnly cookies para web, Secure Storage para mobile
4.  **Blacklist para Revogação:** Liste tokens revogados (para logout forçado)
5.  **Claims Mínimos:** Inclua apenas dados necessários no payload

---

## 🌐 OAuth 2.0: O Protocolo de Autorização da Internet

### 🎯 A Filosofia do OAuth
OAuth não é sobre autenticação — é sobre **autorização delegada**. Permite que aplicações terceiras acessem recursos de um usuário sem que ele precise compartilhar suas credenciais. Pense nisso como dar uma chave específica do seu apartamento para um amigo, sem dar a chave mestra do prédio.

### 👥 Os Quatro Papéis do OAuth

1.  **Resource Owner (Proprietário do Recurso):** O usuário que possui os dados/protected resources
2.  **Client (Cliente):** A aplicação que quer acessar os recursos do usuário
3.  **Resource Server (Servidor de Recurso):** API que possui os dados protegidos
4.  **Authorization Server (Servidor de Autorização):** Serviço que autentica o usuário e emite tokens

### 🔄 Os Quatro Fluxos (Grants) do OAuth

#### 1. Authorization Code Flow (Mais Seguro)
**Para:** Aplicações web server-side
```
Usuário → Client → Authorization Server (login) → Authorization Code → Client (troca code por token) → Access Token → Resource Server
```

#### 2. Implicit Flow (Depreciado)
**Evite:** Segurança inferior, tokens expostos no browser

#### 3. Resource Owner Password Credentials (Pouco Usado)
**Para:** Aplicações de alta confiança (primeira parte)
```
Usuário → Client (entrega credenciais) → Client → Authorization Server → Access Token
```

#### 4. Client Credentials Flow (Machine-to-Machine)
**Para:** Comunicação entre servidores
```
Client → Authorization Server → Access Token (sem usuário envolvido)
```

### 🎨 OAuth na Vida Real: Login Social
Quando você vê "Login com Google/Facebook/GitHub", está vendo OAuth em ação:
1.  Seu site (Client) redireciona para Google (Authorization Server)
2.  Usuário faz login no Google (se já não estiver)
3.  Google pergunta: "Site X quer acessar seu email e perfil"
4.  Usuário autoriza
5.  Google redireciona de volta com Authorization Code
6.  Seu site troca code por Access Token
7.  Seu site usa token para obter dados do usuário

---

## 🔗 JWT + OAuth: O Casamento Perfeito

### 🏗️ Arquitetura Moderna de Autenticação
```
Frontend → Login com OAuth → Authorization Server → Retorna JWT → Frontend armazena JWT → Frontend envia JWT para APIs → APIs verificam JWT
```

### 🎯 Por que Esta Combinação Domina
1.  **OAuth para Obtenção:** Fluxo seguro para obter tokens
2.  **JWT para Uso:** Tokens auto-contidos para APIs stateless
3.  **Separação de Responsabilidades:** Authorization Server gerencia identidade, Resource Server foca em dados
4.  **Interoperabilidade:** Padrões abertos que funcionam entre diferentes provedores

---

## 🔐 OpenID Connect (OIDC): Autenticação sobre OAuth

### 🎯 O Problema que OIDC Resolve
OAuth é apenas para autorização. OIDC **adiciona uma camada de autenticação padronizada** sobre OAuth 2.0, permitindo que você saiba não apenas que um token é válido, mas quem é o usuário por trás dele.

### 🎨 O Fluxo OIDC
```
1. Client inicia fluxo OAuth com escopo "openid"
2. Usuário autentica no Authorization Server
3. Authorization Server retorna "id_token" (JWT) além do access_token
4. id_token contém claims sobre a identidade do usuário
```

### 📋 Claims Padrão do id_token
```json
{
  "iss": "https://auth.meudominio.com",  // Issuer (quem emitiu)
  "sub": "123456",                       // Subject (ID único)
  "aud": "client-id",                    // Audience (para quem)
  "exp": 1516239022,                     // Expiration
  "iat": 1516239022,                     // Issued at
  "email": "usuario@email.com",
  "email_verified": true,
  "name": "João Silva",
  "picture": "https://foto.url"
}
```

---

## 🏗️ Implementação Prática: Do Login à Autorização

### 1. Sistema de Registro/Login Próprio
```javascript
// Fluxo completo com JWT
async function login(email, password) {
  // 1. Validação básica
  if (!validator.isEmail(email)) throw new Error('Email inválido');
  
  // 2. Busca usuário no banco
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new Error('Credenciais inválidas');
  
  // 3. Verifica senha (com hash)
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Credenciais inválidas');
  
  // 4. Gera tokens JWT
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // 5. Armazena refresh token no banco (para revogação)
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  // 6. Retorna tokens (sem senha no user)
  return {
    user: { id: user._id, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
}
```

### 2. Middleware de Autenticação
```javascript
function authenticateToken(req, res, next) {
  // 1. Extrai token do header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  // 2. Verifica e decodifica token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    // 3. Adiciona dados do usuário à requisição
    req.user = decoded;
    next();
  });
}
```

### 3. Middleware de Autorização
```javascript
function authorize(roles = []) {
  return (req, res, next) => {
    // Se não especificar roles, qualquer autenticado pode acessar
    if (roles.length === 0) return next();
    
    // Verifica se usuário tem uma das roles permitidas
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.' 
      });
    }
    
    next();
  };
}

// Uso
app.get('/admin/dashboard', 
  authenticateToken, 
  authorize(['admin', 'superadmin']),
  (req, res) => { /* ... */ }
);
```

---

## 🚨 Armadilhas de Segurança e Como Evitá-las

### ❌ Erros Comuns

**1. Armazenamento Inseguro de Tokens:**
```javascript
// ❌ LOCALSTORAGE (vulnerável a XSS)
localStorage.setItem('token', jwtToken);

// ✅ HTTP-ONLY COOKIE (protegido contra XSS)
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

**2. JWT Sem Expiração:**
```javascript
// ❌ Token eterno (inseguro)
jwt.sign(payload, secret);

// ✅ Token com expiração curta
jwt.sign(payload, secret, { expiresIn: '15m' });
```

**3. Falta de Refresh Token Rotation:**
```javascript
// ❌ Mesmo refresh token usado múltiplas vezes
// ✅ Gera novo refresh token a cada uso
async function refreshAccessToken(oldRefreshToken) {
  // 1. Valida oldRefreshToken
  // 2. Invalida oldRefreshToken no banco
  // 3. Gera NOVO refreshToken (não reutiliza)
  // 4. Retorna novo accessToken E novo refreshToken
}
```

**4. Segredos no Código:**
```javascript
// ❌ Hardcoded secret
const secret = 'minha-senha-super-secreta';

// ✅ Variável de ambiente
const secret = process.env.JWT_SECRET;
```

### ✅ Melhores Práticas de Segurança

1.  **Use HTTPS em Todo Lugar:** Sem exceções em produção
2.  **Implemente Rate Limiting:** Previna brute force attacks
3.  **Valide Todos os Inputs:** Do email ao token
4.  **Use Bibliotecas Conhecidas:** `jsonwebtoken`, `bcrypt`, `passport`
5.  **Monitore Tentativas Falhas:** Alertas para padrões suspeitos
6.  **Revogue Tokens em Mudanças:** Senha alterada? Revogue todos tokens
7.  **Implemente 2FA:** Para ações sensíveis ou contas privilegiadas

---

## 🏗️ Arquitetura para Escala

### 1. Microserviços com Autenticação Centralizada
```
[Client] → [API Gateway] → [Authentication Service] → [User Database]
                            ↓
                     [JWT Token] → [Outros Microserviços]
```

### 2. Single Sign-On (SSO) Empresarial
```
[Apps Corporativos] → [Identity Provider (IdP)] ← [LDAP/Active Directory]
         ↓
    [SAML/OIDC] → [Acesso Unificado]
```

### 3. Serverless/JWT Nativo
```
[Client] → [JWT] → [API Gateway] → [Lambda Functions] → [Sem Estado Mantido]
```

---

## 🔮 O Futuro da Autenticação

### 1. Passwordless Authentication
- **Magic Links:** Login por email sem senha
- **WebAuthn/Passkeys:** Padrão FIDO2 para autenticação sem senha
- **Biometria:** Impressão digital, reconhecimento facial no navegador

### 2. Zero Trust Architecture
- **"Nunca confie, sempre verifique":** Autenticação contínua
- **Context-Aware Access:** Permissões baseadas em localização, dispositivo, horário
- **Micro-segmentation:** Cada recurso com seu próprio controle de acesso

### 3. Blockchain Identity
- **Self-Sovereign Identity (SSI):** Controle total do usuário sobre sua identidade
- **Decentralized Identifiers (DIDs):** IDs não controlados por autoridades centrais
- **Verifiable Credentials:** Credenciais digitais verificáveis criptograficamente

---

## 🎯 Quando Usar Cada Abordagem

### Escolha JWT Quando:
- Sua aplicação tem seu próprio sistema de usuários
- Você precisa de APIs stateless e escaláveis
- Performance é crítica (menos consultas ao banco)
- Você controla todos os componentes do sistema

### Escolha OAuth/OIDC Quando:
- Você quer permitir login social (Google, Facebook, GitHub)
- Está construindo uma plataforma para terceiros
- Precisa de SSO entre múltiplas aplicações
- Quer delegar a complexidade da autenticação

### Escolha SAML Quando:
- Integração com sistemas empresariais (Active Directory)
- Aplicações B2B ou governamentais
- Alta segurança e conformidade regulatória

---

## 💡 O Princípio Fundamental: Defense in Depth

Autenticação e autorização não são recursos binários (ligado/desligado) — são **camadas de proteção** que devem ser implementadas em múltiplos níveis:

1.  **Camada de Transporte:** HTTPS, certificados válidos
2.  **Camada de Aplicação:** Validação de input, sanitização
3.  **Camada de Autenticação:** Senhas fortes, 2FA, rate limiting
4.  **Camada de Autorização:** RBAC, ABAC, least privilege principle
5.  **Camada de Auditoria:** Logs, monitoramento, alertas
6.  **Camada de Resposta:** Revogação rápida, notificações de segurança

---

> **"Dominar autenticação e autorização não é sobre implementar a biblioteca mais recente — é sobre entender que você está construindo um sistema de confiança digital. Cada token JWT é uma promessa criptográfica, cada fluxo OAuth é uma delegação de confiança, e cada verificação de permissão é uma aplicação do princípio do menor privilégio. A verdadeira maestria está em equilibrar segurança robusta com experiência do usuário fluida, sabendo que cada decisão afeta não apenas a funcionalidade, mas a confiança que os usuários depositam em seu sistema."**

**Próximo Passo:** Implemente um sistema completo de autenticação em um dos seus projetos. Comece com registro/login próprio usando JWT, adicione refresh tokens, implemente middleware de autorização por roles, e então adicione OAuth para login social. Teste cada cenário de segurança (token expirado, token inválido, usuário sem permissão) e observe como sua aplicação se comporta. A jornada da segurança nunca termina — cada nova feature é uma nova oportunidade para proteger e confiar.