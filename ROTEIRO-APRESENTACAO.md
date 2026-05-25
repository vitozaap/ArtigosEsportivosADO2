# Roteiro de Apresentação — Projeto PISTA

E-commerce de artigos esportivos construído em **Angular 21** + **spartan-ui (Helm UI)** + **Tailwind CSS v4**. Persistência via **json-server** (REST mock) e estado de sessão em **localStorage**.

## Distribuição dos apresentadores

| # | Apresentador | Página | Papel |
|---|--------------|--------|-------|
| 1 | Marcelo | Login | Lógica (formulário, autenticação, serviços) |
| 2 | Orlando | Login | Design e componentes spartan-ui |
| 3 | Leandro | Catálogo | Lógica (signals, computed) |
| 4 | Ricardo | Catálogo | Design e componentes spartan-ui |
| 5 | Victor | Dialog de Informações do Produto | Funcionamento completo |

> Dica: cada apresentador deve abrir o arquivo `.ts` ou `.html` correspondente no VSCode antes de começar.

---

## Visão geral da arquitetura (intro do grupo)

- **Roteamento** em `src/app/app.routes.ts` define quatro rotas: `''` (App raiz), `/login`, `/shop` (catálogo) e `/admin/products` (gestão).
- **Guards** (`AuthGuard`, `AdminAuthGuard`) Um extra para proteger rotas que exigem login ou perfil admin.
- **Services injetáveis** (`UserService`, `AuthService`, `ProductsService`) concentram a lógica de negócio fora dos componentes.
- **Standalone components** — todo componente declara seus próprios `imports`; não usamos `NgModule`.
- **spartan-ui (Helm)** entrega componentes acessíveis sem estilizar pesado — usamos diretivas como `hlmBtn`, `hlmInput`, `hlmCard` aplicadas diretamente nos elementos HTML.

---

# 🔐 Página 1 — Login

**Arquivos:** `src/app/login/login.ts`, `src/app/login/login.html`
**Serviços relacionados:** `core/services/user/user.service.ts`, `core/services/auth/auth.service.ts`, `core/users.ts`

---

## 👤 Marcelo — Lógica do Login

### Roteiro de fala

> "A página de login é responsável por validar as credenciais do usuário e direcioná-lo para a loja. Toda a lógica fica no arquivo `login.ts`."

#### 1. Injeção de dependências (linhas 19–21)

```ts
private userService = inject(UserService)
private readonly router = inject(Router)
private readonly authService = inject(AuthService)
```

- Usamos a função `inject()` do Angular para injetar os três serviços que precisamos para fazer o login funcionar.
- **`UserService`** salva/lê o usuário no `localStorage`, mas buscando se existe o usuário no servidor do json-serber.
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

- Se o usuário já estiver logado (tem dados no localStorage), ele é redirecionado direto pro `/shop` sem precisar logar de novo, funciona igual ao ngOnInit explicado em sala.

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

#### 4. Submissão (`onSubmit`, linhas 34–52)

```ts
onSubmit() {
  if (!this.form.valid) {
    return
  }

  this.userService.getUsers().subscribe((users) => {
    const userExists = users.find(
      (user) => user.email === this.form.value.email && user.password === this.form.value.password
    )

    if (userExists) {
      this.userService.changeUser({ email: userExists.email, password: userExists.password })
      this.router.navigate(["/shop"])
    } else {
      toast.info("Usuário não encontrado")
    }
  })
}
```

- Se o form estiver inválido, ja invalida o fluxo de login.
- Chamamos `userService.getUsers()` — método que faz um `HttpClient.get` no endpoint `/users` do **json-server**.
- O método `.subscribe()` recebe o array/lista de usuários cadastrados quando a resposta chega.
- Método de array `find()` procura um usuário que bata **tanto email quanto senha** com o formulário.
- Se encontrou → grava no `localStorage` via `changeUser` e navega pra `/shop`.
- Se não encontrou → toast informativo "Usuário não encontrado".
- A diferenciação entre admin e usuário acontece **depois**, na função do Serviço de Auth (Victor que fez) `AuthService.isAdmin()`, comparando o email salvo no localStorage com o admin escrito em core/users.ts.

## 🎨 Orlando — Design e componentes spartan-ui do Login

### Roteiro de fala

> "Todo o visual do login é construído com componentes do spartan-ui, que é uma biblioteca de UI. Em vez de criar `<div>` estilizadas manualmente, usamos diretivas como `hlmCard` e `hlmBtn` que já trazem o design pronto. Bem semelhante ao passado na aula 10, sobre o material design do google "

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

- `min-h-dvh` / `min-w-dvw` ocupam **100% da tela** (Tailwind CSS).
- `flex items-center justify-center` centraliza o card vertical e horizontalmente.
- A diretiva **`hlmCard`** aplicada na tag `<section>` transforma ela em um card com bordas, sombra e padding já estilizados pelo spartan-ui.

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


### Pontos difíceis para explicar

| Conceito | Como explicar |
|----------|---------------|
| Tailwind CSS | Em vez de CSS separado, classes como `flex items-center` já trazem o estilo direto no HTML |
| `form="login"` no botão | Atributo **HTML nativo** (não Angular) — liga o botão a um `<form id="login">` em qualquer lugar do DOM |

---

# 🛍️ Página 2 — Catálogo

**Arquivos:** `src/app/shop/shop.ts`, `src/app/shop/shop.html`
**Serviços relacionados:** `core/services/products/products.service.ts`, `core/services/products/types.ts`

---

## 👤 Leandro — Lógica do Catálogo

### Roteiro de fala

> "O catálogo lista todos os produtos cadastrados no backend. A reatividade é construída com **Signals** do angular"

#### 1. Signal — o coração da reatividade (linha 36)

```ts
readonly products = signal<Product[]>([]);
```

- **`signal<Product[]>(valorInicial)`** cria uma variável "reativa": quando ela muda, qualquer template que a usa re-renderiza **só essa parte**.
- Pra **ler** o valor: `products()` (com parênteses, como uma função).
- Pra **mudar**: `products.set(novoArray)` ou `products.update(fn)`.

#### 2. Carregando produtos do backend (linhas 38–42)

```ts
ngOnInit(): void {
  this.productsService.getProducts().subscribe((products) => {
    this.products.set(products);
  });
}
```

- O método `ngOnInit` roda **uma vez**, logo após o componente ser criado.
- `productsService.getProducts()` retorna um **Observable** (do RxJS) — uma "promise contínua" para que possamos pegar os dados dos produtos da API.
- O método `subscribe()` recebe a lista de produtos quando a requisição HTTP termina, e nós o jogamos no signal `products`.

#### 3. Service e tipo compartilhados (linhas 11–12)

```ts
import { ProductsService } from '../core/services/products/products.service';
import { Product } from '../core/services/products/types';
```

- **`ProductsService`** é a mesma classe injetável usada pelo admin — concentra todas as chamadas HTTP num único lugar.
- `Product` é a **interface TypeScript** que define o formato dos dados (`id`, `name`, `brand`, `category`, `price`, `stock`, `description`).

#### 4. Melhor exibição de categorias (linhas 44–48)

```ts
protected formatCategory(category: Product['category']): string {
  if (!category) return '';
  const str = category.toString();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

- Recebe a categoria crua do produto (ex: `"futebol"`) e retorna formatada (`"Futebol"`).
- Usada tanto no card quanto no dialog de informações pra padronizar a apresentação em maiúsculo no inicio.

### ⚠️ Pontos difíceis pra iniciantes

| Conceito | Como explicar |
|----------|---------------|
| `signal()` vs variável normal | Variável normal = Angular não sabe quando mudou. Signal = Angular sabe e re-renderiza automaticamente |
| `signal()()` (dois parênteses) | O primeiro cria, o segundo lê. Sempre pra ler: `meuSignal()` |
| `Observable` vs `Promise` | Observable pode emitir vários valores ao longo do tempo (Promise emite um só). Precisa `.subscribe()` pra ativar |
| `OnInit` vs constructor | Constructor: classe sendo criada (dados ainda não chegaram). OnInit: componente pronto, hora de carregar dados |

---

## 🎨 Ricardo — Design e componentes spartan-ui do Catálogo

### Roteiro de fala

> "O catálogo monta uma interface limpa: um cabeçalho com contador, grade de cards e um estado de vazio/sem produtos. Todos os componentes vêm do spartan-ui e se ajustam automaticamente ao tema claro/escuro."

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
- `px e py` dá espaçamento lateral, igual usado na página de admin.
- `[class]="h3"` aplica a string de classes Tailwind retornada por `hlmH3` (vem de `@spartan-ui/helm/typography`) — Gerando padronização de textos.
- `{{ products().length }}` mostra o contador de produtos, pegando o tamanho da lista de produtos, que **atualiza sozinho** quando o signal `products` muda.

#### 2. Grid responsivo de cards (linhas 25–87)

```html
<div class="grid grid-cols-3 gap-4">
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
- Usamos Grid para definir a grade de amostragem de produtos
- `@for` para fazer um loop nos produtos e conseguir exibi-los na página.
- Cada card usa a mesma anatomia do card na tela de Login: `hlm-card-header`, `hlm-card-content`, `hlm-card-footer`.

---

# 💬 Página 3 — Dialog de Informações do Produto

**Arquivo:** `src/app/shop/shop.html` (linhas 80–122, dentro de cada card)

---

## 👤 Victor — Dialog

### Roteiro de fala

> "Quando o usuário clica em 'Ver' num card do catálogo, abre um dialog com as informações detalhadas do produto. O spartan-ui resolve toda a parte chata de lógica do dialog, então foi bem simples fazer, seguindo sempre a documentação da biblioteca."

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

- Botão com `hlmDialogTrigger` que faz o dialog abrir, sem isso, o spartan-ui não sabe quando abrir

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


#### 3. Header, body e footer

| Diretiva | O que faz |
|----------|-----------|
| `<hlm-dialog-header>` | Parte do topo (título + descrição) |
| `hlmDialogTitle` | Aplica tipografia de título (h3 estilizado) |
| `hlmDialogDescription` | Texto secundário muted abaixo do título |
| `<hlm-dialog-footer>` | parte das ações no rodapé |
| `hlmDialogClose` | Marca o botão "Fechar" — ao clicar, o dialog fecha sozinho |

#### 4. Por que esse dialog é interessante?

Mostre na apresentação que:
1. **Não escrevemos** nenhuma lógica de "abrir/fechar" em TypeScript — o spartan-ui cuida disso.
2. **Reutilização**: o mesmo padrão de `hlm-dialog` é usado na página admin pra criar/editar produtos — é um componente do nosso "design system".

### Pontos difíceis para explicar

| Conceito | Como explicar |
|----------|---------------|
| Modal dentro de `@for` | Cada produto tem seu próprio `<hlm-dialog>` — não é um único modal que muda de conteúdo, são vários modais independentes |
| Portal | Renderiza HTML "fora" do componente pra evitar bugs visuais — conceito comum em libs de UI (React, Vue também têm) |

---

# Glossário das Aulas Passadas

Pra ajudar a responder sobre as aulas do pro:

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

# ⏱️ Cronograma

| Tempo | Quem | O quê |
|-------|------|-------|
| 0:00–1:00 | Todos | Intro + arquitetura geral |
| 1:00–4:00 | Marcelo | Login — lógica |
| 4:00–7:00 | Orlando | Login — design |
| 7:00–10:00 | Leandro | Catálogo — lógica |
| 10:00–13:00 | Ricardo | Catálogo — design |
| 13:00–16:00 | Victor | Dialog de informações |
| 16:00–17:00 | Todos | Demo final + perguntas |

---
