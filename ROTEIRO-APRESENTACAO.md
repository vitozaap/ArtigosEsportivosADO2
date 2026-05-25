# Roteiro de Apresentação — Projeto PISTA

E-commerce de artigos esportivos construído em **Angular 21** + **spartan-ng (Helm UI)** + **Tailwind CSS v4**. Persistência via **json-server** (REST mock) e estado de sessão em **localStorage**.

## Distribuição dos apresentadores

| # | Apresentador | Página | Papel |
|---|--------------|--------|-------|
| 1 | Pessoa A | Login | Lógica (formulário, autenticação, serviços) |
| 2 | Pessoa B | Login | Design e componentes spartan-ng |
| 3 | Pessoa C | Catálogo | Lógica (signals, computed, filtro) |
| 4 | Pessoa D | Catálogo | Design e componentes spartan-ng |
| 5 | Pessoa E | Dialog de Informações do Produto | Funcionamento completo |

> Dica: cada apresentador deve abrir o arquivo `.ts` ou `.html` correspondente no VSCode antes de começar.

---

## Visão geral da arquitetura (intro do grupo, ~1 min)

- **Roteamento** em `src/app/app.routes.ts` define quatro rotas: `''` (App raiz), `/login`, `/shop` (catálogo) e `/admin/products` (gestão).
- **Guards** (`AuthGuard`, `AdminAuthGuard`) protegem rotas que exigem login ou perfil admin.
- **Services injetáveis** (`UserService`, `AuthService`, `ProductsService`) concentram a lógica de negócio fora dos componentes.
- **Standalone components** — todo componente declara seus próprios `imports`; não usamos `NgModule`.
- **spartan-ng (Helm)** entrega componentes acessíveis sem estilizar pesado — usamos diretivas como `hlmBtn`, `hlmInput`, `hlmCard` aplicadas diretamente nos elementos HTML.

---

# 🔐 Página 1 — Login

**Arquivos:** `src/app/login/login.ts`, `src/app/login/login.html`
**Serviços relacionados:** `core/services/user/user.service.ts`, `core/services/auth/auth.service.ts`, `core/users.ts`

---

## 👤 Pessoa A — Lógica do Login (~3 min)

### Roteiro de fala

> "A página de login é responsável por validar as credenciais do usuário e direcioná-lo para a loja. Toda a lógica fica no arquivo `login.ts`."

#### 1. Injeção de dependências (linhas 19–21)

```ts
private userService = inject(UserService)
private readonly router = inject(Router)
private readonly authService = inject(AuthService)
```

- Usamos a função `inject()` do Angular (alternativa moderna ao construtor) para obter os três serviços.
- **`UserService`** salva/lê o usuário no `localStorage`.
- **`AuthService`** verifica se o usuário já está logado.
- **`Router`** faz a navegação programática entre páginas.

#### 2. Redirect automático (constructor — linhas 22–26)

```ts
constructor() {
  if (this.authService.isAuthenticated()) {
    this.router.navigate(["/shop"])
  }
}
```

- Se o usuário já estiver logado (tem dados válidos no localStorage), ele é redirecionado direto pro `/shop` sem precisar logar de novo.

#### 3. Reactive Forms (linhas 28–31)

```ts
form = new FormGroup({
  email: new FormControl('', [Validators.email, Validators.required]),
  password: new FormControl('', [Validators.required, Validators.minLength(5)])
})
```

- Criamos um `FormGroup` com dois `FormControl`.
- **Validators** rodam automaticamente:
  - `Validators.email` — checa formato de e-mail
  - `Validators.required` — campo obrigatório
  - `Validators.minLength(5)` — senha mínima de 5 caracteres
- O Angular bloqueia o submit enquanto `form.valid` for `false`.

#### 4. Submissão (`onSubmit`, linhas 33–60)

```ts
if (this.form.value.email == admin.email && this.form.value.password == admin.password) {
  this.userService.changeUser({ email: ..., password: ... })
  toast.success("Logado como admin!", { ... })
  setTimeout(() => this.router.navigate(["/shop"]), 1000)
}
```

- Comparamos as credenciais com duas constantes em `core/users.ts` (`admin` e `user` — usuários "mockados" para a demonstração).
- Se bate com `admin` → salva como admin no localStorage e mostra toast verde.
- Se bate com `user` → salva como usuário comum.
- Caso contrário → toast de erro "Usuário não encontrado".
- O `setTimeout` de 1 segundo deixa o toast aparecer antes da navegação.

### ⚠️ Pontos difíceis pra iniciantes — explique com calma

| Conceito | Por que é confuso | Como explicar |
|----------|-------------------|---------------|
| `inject()` vs construtor | Iniciantes aprendem injeção via parâmetros de construtor | É o jeito novo (Angular 14+), mais flexível e funciona até fora de classes |
| `FormGroup`/`FormControl` | Não é HTML puro nem template-driven | É **Reactive Forms**: o estado do form vive no `.ts`, não no `.html` |
| `localStorage` em vez de cookies | Diferente de sessões tradicionais | Funciona só no navegador, sobrevive ao refresh, mas não é seguro pra dados sensíveis (ok pra protótipo) |

---

## 🎨 Pessoa B — Design e componentes spartan-ng do Login (~3 min)

### Roteiro de fala

> "Todo o visual do login é construído com componentes do spartan-ng, que é uma biblioteca de UI inspirada no shadcn/ui. Em vez de criar `<div>` estilizadas manualmente, usamos diretivas como `hlmCard` e `hlmBtn` que já trazem o design pronto. Bem semelhante ao passado na aula 10, sobre o material design do google "

#### 1. Imports do componente (`login.ts`, linha 14)

```ts
imports: [HlmButtonImports, HlmCardImports, HlmInputImports, HlmLabelImports, RouterModule, ReactiveFormsModule]
```

- Cada `HlmXxxImports` é um **array** com todas as diretivas relacionadas (ex: `HlmCardImports` traz `HlmCard`, `HlmCardHeader`, `HlmCardTitle`, `HlmCardDescription`, `HlmCardContent`, `HlmCardFooter`).
- `ReactiveFormsModule` é nativo do Angular, dá os atributos `formGroup` e `formControlName`.

#### 2. Layout principal (`login.html`, linhas 1–2)

```html
<div class="min-w-dvw min-h-dvh flex border items-center justify-center">
  <section class="w-full max-w-sm" hlmCard>
```

- `min-h-dvh` / `min-w-dvw` ocupam **100% da viewport** (Tailwind v4).
- `flex items-center justify-center` centraliza o card vertical e horizontalmente.
- A diretiva **`hlmCard`** aplicada na `<section>` transforma ela em um cartão com bordas, sombra e padding já estilizados.

#### 3. Estrutura do card (linhas 3–39)

```html
<div hlmCardHeader>
  <h3 hlmCardTitle>Fazer login na PISTA</h3>
  <p hlmCardDescription>Preencha os campos para fazer login na PISTA.</p>
</div>

<div hlmCardContent>
  <form [formGroup]="form" id="login" (ngSubmit)="onSubmit()">
    ...
  </form>
</div>

<div hlmCardFooter class="flex-col gap-2">
  <button hlmBtn type="submit" form="login" class="w-full">Entrar agora</button>
</div>
```

- O card é dividido em **header / content / footer** — cada um é uma diretiva diferente que aplica margens e separações consistentes.
- `[formGroup]="form"` conecta o `<form>` HTML ao `FormGroup` declarado no `.ts`.
- `(ngSubmit)="onSubmit()"` escuta o submit do form e chama nosso método.
- O botão usa `form="login"` (atributo HTML nativo) pra disparar o submit mesmo estando **fora** do `<form>` — truque útil pra colocar o botão no footer.

#### 4. Inputs com label (linhas 11–21)

```html
<label hlmLabel for="email">Email</label>
<input type="email" id="email" placeholder="m@example.com"
       formControlName="email" required hlmInput />
```

- `hlmLabel` estiliza o label (peso, espaçamento).
- `hlmInput` estiliza o input (borda, padding, focus ring).
- `formControlName="email"` amarra o campo ao `FormControl` correspondente.

#### 5. Toasts (em `app.ts` e disparados de `login.ts`)

```ts
toast.success("Logado como admin!", { description: ... })
```

- O `<hlm-toaster />` está no `App` raiz (`app.ts`), posicionado em `bottom-center`.
- Qualquer componente do app pode disparar toasts importando `toast` de `@spartan-ng/brain/sonner`.

### ⚠️ Pontos difíceis pra iniciantes

| Conceito | Como explicar |
|----------|---------------|
| Por que `hlmCard` é diretiva e não componente? | Aplicar como atributo em qualquer elemento (`<section>`, `<div>`) — é mais flexível que `<hlm-card>` |
| Tailwind utility classes | Em vez de CSS separado, classes como `flex items-center` já trazem o estilo direto no HTML |
| `form="login"` no botão | Atributo **HTML nativo** (não Angular) — liga o botão a um `<form id="login">` em qualquer lugar do DOM |

---

# 🛍️ Página 2 — Catálogo

**Arquivos:** `src/app/shop/shop.ts`, `src/app/shop/shop.html`
**Serviços relacionados:** `core/services/products/products.service.ts`, `core/services/products/types.ts`

---

## 👤 Pessoa C — Lógica do Catálogo (~3 min)

### Roteiro de fala

> "O catálogo lista todos os produtos cadastrados no backend. A reatividade é construída com **Signals**, que é a nova forma do Angular gerenciar estado de forma performática."

#### 1. Signal — o coração da reatividade (linha 36)

```ts
readonly products = signal<Product[]>([]);
```

- **`signal<T>(valorInicial)`** cria uma variável "reativa": quando ela muda, qualquer template que a usa re-renderiza **só essa parte**.
- Pra **ler** o valor: `products()` (com parênteses, como uma função).
- Pra **mudar**: `products.set(novoArray)` ou `products.update(fn)`.
- Comparado ao `*ngFor` clássico, é mais rápido porque o Angular sabe exatamente o que mudou.

#### 2. Carregando produtos do backend (linhas 38–42)

```ts
ngOnInit(): void {
  this.productsService.getProducts().subscribe((products) => {
    this.products.set(products);
  });
}
```

- **`OnInit`** é um **lifecycle hook**: o método `ngOnInit` roda **uma vez**, logo após o componente ser criado.
- `productsService.getProducts()` retorna um **Observable** (do RxJS) — uma "promise contínua".
- O `.subscribe()` recebe o array de produtos quando a requisição HTTP termina, e nós o jogamos no signal `products`.

#### 3. Service e tipo compartilhados (linhas 11–12)

```ts
import { ProductsService } from '../core/services/products/products.service';
import { Product } from '../core/services/products/types';
```

- **`ProductsService`** é a mesma classe injetável usada pelo admin — concentra todas as chamadas HTTP num único lugar.
- `Product` é a **interface TypeScript** que define o formato dos dados (`id`, `name`, `brand`, `category`, `price`, `stock`, `description`).

#### 4. Helper de exibição (linhas 44–48)

```ts
protected formatCategory(category: Product['category']): string {
  if (!category) return '';
  const str = category.toString();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

- Recebe a categoria crua do produto (ex: `"futebol"`) e retorna formatada (`"Futebol"`).
- Usada tanto no card quanto no dialog de informações pra padronizar a apresentação.

### ⚠️ Pontos difíceis pra iniciantes

| Conceito | Como explicar |
|----------|---------------|
| `signal()` vs variável normal | Variável normal = Angular não sabe quando mudou. Signal = Angular sabe e re-renderiza automaticamente |
| `signal()()` (dois parênteses) | O primeiro cria, o segundo lê. Sempre pra ler: `meuSignal()` |
| `Observable` vs `Promise` | Observable pode emitir vários valores ao longo do tempo (Promise emite um só). Precisa `.subscribe()` pra ativar |
| `OnInit` vs constructor | Constructor: classe sendo criada (dados ainda não chegaram). OnInit: componente pronto, hora de carregar dados |

---

## 🎨 Pessoa D — Design e componentes spartan-ng do Catálogo (~3 min)

### Roteiro de fala

> "O catálogo monta uma interface limpa: um cabeçalho com contador, grid responsivo de cards e estado vazio. Todos os componentes vêm do spartan-ng e se ajustam automaticamente ao tema claro/escuro."

#### 1. Layout geral (`shop.html`, linhas 1–10)

```html
<div class="w-full min-h-dvh flex flex-col">
  <app-header />

  <div class="w-full px-32 py-6 flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h3 [class]="h3">Catálogo</h3>
      <p class="text-sm text-muted-foreground">
        {{ products().length }} produtos disponíveis
      </p>
    </div>
```

- `<app-header />` reusa o componente de cabeçalho global.
- `px-32 py-6` dá padding lateral generoso (32 * 4px = 128px) — combina com a página admin.
- `[class]="h3"` aplica a string de classes Tailwind retornada por `hlmH3` (vem de `@spartan-ng/helm/typography`) — padronização tipográfica consistente.
- `{{ products().length }}` mostra o contador, que **atualiza sozinho** quando o signal `products` muda.

#### 2. Grid responsivo de cards (linhas 25–87)

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  @for (product of products(); track product.id) {
    <hlm-card class="flex flex-col">
      <hlm-card-header class="gap-2">
        <p class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {{ formatCategory(product.category) }}
        </p>
        <h4 hlmCardTitle class="text-lg">{{ product.name }}</h4>
      </hlm-card-header>

      <div hlmCardContent class="flex flex-col gap-2 border-t pt-4">
        <p class="text-2xl font-bold">R$ {{ product.price }}</p>
      </div>

      <div hlmCardFooter class="flex items-center justify-between">
        <span class="text-xs text-muted-foreground">{{ product.stock }} em estoque</span>
        ...
      </div>
    </hlm-card>
  }
</div>
```

- **Grid responsivo Tailwind**:
  - Mobile (`grid-cols-1`): 1 coluna
  - Tablet (`sm:`): 2 colunas
  - Desktop (`lg:`): 3 colunas
- **`@for`** é a nova sintaxe de loop do Angular 17+ (substitui `*ngFor`).
- `track product.id` ajuda o Angular a saber quem mudou e evitar re-renderizar tudo — ganho de performance.
- Cada card usa a mesma anatomia do Login: `hlm-card-header`, `hlmCardContent`, `hlmCardFooter`.
- Acima do nome, mostramos a categoria em **uppercase + muted-foreground** (cor desbotada do tema).

#### 3. Empty state (linhas 12–23)

```html
@if (products().length === 0) {
  <hlm-empty>
    <hlm-empty-header>
      <hlm-empty-media variant="icon">
        <ng-icon name="lucideSquircleDashed" />
      </hlm-empty-media>
      <div hlmEmptyTitle>Nenhum produto disponível</div>
      <div hlmEmptyDescription>
        Os produtos cadastrados aparecerão aqui.
      </div>
    </hlm-empty-header>
  </hlm-empty>
}
```

- **`hlm-empty`** é um componente pronto pra "estado vazio" — quando não há nada pra mostrar.
- Mantém consistência visual com o resto do app (já é usado na página admin quando não há produtos).
- O ícone `lucideSquircleDashed` vem da biblioteca **Lucide** via `@ng-icons/lucide`.

### ⚠️ Pontos difíceis pra iniciantes

| Conceito | Como explicar |
|----------|---------------|
| `@for` e `@if` (novo) | Substitui `*ngFor` e `*ngIf` do Angular antigo — mais simples e performático |
| `track` no `@for` | Identificador único pra cada item — Angular usa pra saber quem mudou e evitar re-renderizar tudo |
| Classes responsivas Tailwind | `sm:`, `lg:` são **breakpoints**: estilo só aplica se a tela passar daquele tamanho |
| `text-muted-foreground` | Cor "auxiliar" do tema — automaticamente clara/escura conforme tema atual |

---

# 💬 Página 3 — Dialog de Informações do Produto

**Arquivo:** `src/app/shop/shop.html` (linhas 80–122, dentro de cada card)

---

## 👤 Pessoa E — Dialog (~3 min)

### Roteiro de fala

> "Quando o usuário clica em 'Ver' num card do catálogo, abre um modal com as informações detalhadas do produto. O spartan-ng resolve toda a parte chata: foco, fechar com ESC, overlay escurecido, animações."

#### 1. Estrutura básica (linhas 80–90)

```html
<hlm-dialog>
  <button
    hlmBtn
    hlmDialogTrigger
    variant="ghost"
    size="sm"
    class="cursor-pointer"
  >
    Ver
    <ng-icon hlm size="sm" name="lucideArrowRight" />
  </button>
  ...
</hlm-dialog>
```

- **`<hlm-dialog>`** é o "container lógico" do dialog — não renderiza nada visível sozinho.
- **`hlmDialogTrigger`** marca qualquer elemento (no caso, o botão "Ver") como o gatilho que abre o modal.
- O texto "Ver" + ícone `lucideArrowRight` formam a seta "Ver →" do design.

#### 2. Conteúdo do modal com `*hlmDialogPortal` (linhas 92–121)

```html
<hlm-dialog-content *hlmDialogPortal="let ctx">
  <hlm-dialog-header>
    <h3 hlmDialogTitle>{{ product.name }}</h3>
    <p hlmDialogDescription>
      {{ formatCategory(product.category) }} · {{ product.brand }}
    </p>
  </hlm-dialog-header>

  <div class="flex flex-col gap-4 py-2">
    <div class="flex items-baseline justify-between">
      <span class="text-3xl font-bold">R$ {{ product.price }}</span>
      <span class="text-sm text-muted-foreground">
        {{ product.stock }} em estoque
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-xs font-semibold uppercase text-muted-foreground">Descrição</p>
      <p class="text-sm">{{ product.description }}</p>
    </div>
  </div>

  <hlm-dialog-footer>
    <button hlmBtn variant="outline" hlmDialogClose class="cursor-pointer">
      Fechar
    </button>
  </hlm-dialog-footer>
</hlm-dialog-content>
```

- **`*hlmDialogPortal`** é uma **structural directive** (parecida com `*ngIf`) — o asterisco indica isso.
- Ela faz o conteúdo do dialog ser **renderizado em outro lugar do DOM** (no fim do `<body>`, fora da hierarquia do componente). Isso evita problemas de `z-index` e overflow.
- O `let ctx` captura o "contexto" do dialog — dá acesso a métodos como `ctx.close()` se precisássemos fechar programaticamente.

#### 3. Header, body e footer

| Diretiva | O que faz |
|----------|-----------|
| `<hlm-dialog-header>` | Container do topo (título + descrição) |
| `hlmDialogTitle` | Aplica tipografia de título (h3 estilizado) |
| `hlmDialogDescription` | Texto secundário muted abaixo do título |
| `<hlm-dialog-footer>` | Container das ações no rodapé |
| `hlmDialogClose` | Marca o botão "Fechar" — ao clicar, o dialog fecha sozinho |

#### 4. Conteúdo dinâmico via interpolação

- `{{ product.name }}`, `{{ product.price }}`, `{{ product.description }}` — interpolação clássica.
- `formatCategory(product.category)` chama um método que capitaliza a categoria (`"futebol"` → `"Futebol"`).
- O modal recebe **automaticamente** o `product` correto porque está **dentro do `@for`** — cada card tem o seu próprio modal escopado.

#### 5. Por que esse dialog é interessante?

Mostre na apresentação que:
1. **Não escrevemos** nenhuma lógica de "abrir/fechar" em TypeScript — o spartan-ng cuida disso.
2. **Acessibilidade** vem de graça: tecla ESC fecha, foco fica preso dentro do modal, leitor de tela lê o título.
3. **Reutilização**: o mesmo padrão de `hlm-dialog` é usado na página admin pra criar/editar produtos — é um componente do nosso "design system".

### ⚠️ Pontos difíceis pra iniciantes

| Conceito | Como explicar |
|----------|---------------|
| Structural directive (`*hlmDialogPortal`) | O asterisco "expande" pra um `<ng-template>` — Angular renderiza o conteúdo só quando o dialog abre |
| `let ctx` no template | Sintaxe pra capturar variáveis do contexto da diretiva (similar ao `let item of items` no `@for`) |
| Modal dentro de `@for` | Cada produto tem seu próprio `<hlm-dialog>` — não é um único modal que muda de conteúdo, são N modais independentes |
| Portal | Renderiza HTML "fora" do componente pra evitar bugs visuais — conceito comum em libs de UI (React, Vue também têm) |

---

# 🧩 Apêndice — Glossário rápido de Angular

Pra ajudar a responder perguntas do professor:

| Termo | Definição curta |
|-------|-----------------|
| **Standalone component** | Componente que declara seus próprios imports (não precisa de NgModule) |
| **Signal** | Variável reativa nativa do Angular — atualiza a UI automaticamente quando muda |
| **Reactive Forms** | Formulários cujo estado vive no `.ts` (FormGroup/FormControl) |
| **Validators** | Funções que validam campos de form (required, email, minLength...) |
| **Service** | Classe `@Injectable` com lógica reutilizável (HTTP, auth, etc.) |
| **inject()** | Função moderna pra injetar dependências (alternativa ao construtor) |
| **Lifecycle hook** | Métodos que rodam em momentos específicos do ciclo de vida (`ngOnInit`, `ngOnDestroy`...) |
| **Observable** | Stream de valores do RxJS — precisa `.subscribe()` |
| **Guard** | Função que protege rotas (libera ou bloqueia navegação) |
| **Directive** | Atributo HTML que adiciona comportamento (ex: `hlmBtn`, `formControlName`) |
| **Structural directive** | Diretiva que modifica o DOM (asterisco: `*ngIf`, `*hlmDialogPortal`) |
| **Interpolation** | `{{ expressao }}` — insere valor TypeScript no HTML |
| **Property binding** | `[propriedade]="valor"` — passa valor TS pra atributo HTML |
| **Event binding** | `(evento)="metodo()"` — escuta eventos do DOM |

---

# ⏱️ Cronograma sugerido (~17 min total)

| Tempo | Quem | O quê |
|-------|------|-------|
| 0:00–1:00 | Todos | Intro + arquitetura geral |
| 1:00–4:00 | Pessoa A | Login — lógica |
| 4:00–7:00 | Pessoa B | Login — design |
| 7:00–10:00 | Pessoa C | Catálogo — lógica |
| 10:00–13:00 | Pessoa D | Catálogo — design |
| 13:00–16:00 | Pessoa E | Dialog de informações |
| 16:00–17:00 | Todos | Demo final + perguntas |

---

**Boa apresentação! 🚀**
