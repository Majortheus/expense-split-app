---
name: restructure-expo-project
description: Reorganiza a estrutura de um projeto Expo recém-criado para um padrão preferido
---

# Skill: Reestruturação de projeto Expo

Este documento descreve a estrutura de projeto desejada para um projeto criado pela CLI do Expo, de modo que uma IA (ou script) possa ler estas instruções e reorganizar automaticamente o projeto recém-criado para o padrão preferido.

Note about responsibilities
- Structural refactors and changes to folder layout or global project organization should be recorded in this skill (`.github/skills/restructure-expo-project/SKILL.md`).
- Do NOT use this skill to document component-level styling or component API conventions — those belong in `.github/react-native-components.md`.

Objetivos principais:

- Manter arquivos existentes na raiz do projeto.
- Garantir pastas de configuração e build no root (incluindo pastas iniciadas por ponto).
- Centralizar código fonte em `src` com subpastas bem definidas: `app`, `@types`, `components`, `libs`, `services`, `styles`.
- Prover exemplos mínimos (por ex. uma `index.tsx` com "Hello World") e arquivos de referência para configuração (Tailwind v5 + NativeWind).

---

## Stack

- **React 19** (sem `forwardRef`)
- **React Native 0.72+**
- **Expo SDK 52+**
- **TypeScript** strict
- **Tailwind CSS v5 e Nativewind** com `@theme` e CSS variables
- **CLSX** (`clsx`) para customização de classes condicional
- **Tailwind Merge** (`tailwind-merge`) para merge de classes
- **Lucide React** ou **Phosphor Icons** para ícones

---

## Nomenclatura

- Arquivos: **lowercase com hífens** → `user-card.tsx`, `use-modal.ts`
- **Sempre named exports**, nunca default export
- Não criar barrel files (`index.ts`) para pastas internas

---

## Estrutura desejada (nível root)

- Arquivos de configuração que já existam na raiz: devem permanecer na raiz.
- Pastas e arquivos que devem existir no root:
  - `.expo/` (pasta oculta do Expo)
  - `.github/` (workflows, etc.)
  - `.vscode/` (configurações do editor)
  - `android/` (se o projeto tiver)
  - `assets/`
  - `dist/`
  - `node_modules/`
  - `src/` (contendo todo código fonte do app — ver abaixo)

> Observação: o passo de reestruturação não deve mover ou deletar arquivos de build/gerados sem verificação — a IA deve preservar arquivos existentes ou perguntar antes de removê-los.

## `src/` — regras gerais

- Todo o código fonte deve ficar dentro de `src/`.
- Se existirem pastas com código atualmente fora de `src` (por ex. `app/`, `components/`), mover para `src/` seguindo as regras abaixo. Quando mover arquivos, atualizar caminhos de import relativos se necessário.

### `src/app/` (expo-router)

Esta pasta deve conter a estrutura mínima do `expo-router` com os arquivos essenciais:

- `src/app/_layout.tsx` — layout principal do router (deve usar `Slot` e definir `initialRouteName: 'index'`; não referenciar páginas opcionais automaticamente)
- `src/app/+html.tsx` — wrapper HTML (web-only)
- `src/app/+not-found.tsx` — página 404/Not Found
- `src/app/index.tsx` — página inicial com um JSX simples "Hello World"

Implementação recomendada para `_layout.tsx`:

- Exporte `ErrorBoundary` de `expo-router` quando aplicável.
- Use `Slot` do `expo-router` para renderizar as rotas filhas.
- Defina `unstable_settings.initialRouteName` para `index` para garantir que `src/app/index.tsx` seja a rota inicial.
- Não importe automaticamente hooks ou componentes de `src/components` dentro do layout. Para detecção de tema, prefira o hook `useColorScheme` do `react-native` ou `Appearance` em vez de dependências internas que podem não existir.
- Não injetar automaticamente fontes de bibliotecas de ícones (ex.: `FontAwesome.font`) a menos que a biblioteca esteja realmente instalada; carregue apenas fontes confirmadas em `assets/`.

Exemplo mínimo de `src/app/index.tsx`:

```tsx
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello World</Text>
    </View>
  );
}
```

> Observação: todos os arquivos acima devem ser TypeScript React (`.tsx`).

### `src/envs/`

crie tambem uma sistematica aonde use zod para fazer um parse das envs, e gere um variavel global com tipagens dos valores das envs, para evitar erros de digitação e garantir que as variáveis de ambiente sejam validadas corretamente. Por exemplo:

```ts
// src/envs/index.ts
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  // Adicione outras variáveis de ambiente necessárias aqui
});

export const env = envSchema.parse(process.env);

// Agora você pode usar `env.API_URL` e `env.NODE_ENV` com tipagem garantida
```

### `src/@types/`

- Pasta para declarações e tipos extras do TypeScript (tipos de respostas/requests de APIs, tipagens para bibliotecas sem types, extensões de módulos, declarações globais).
- Exemplos de arquivos que a IA deve criar quando necessários:
  - `src/@types/api.d.ts`
  - `src/@types/custom-libs.d.ts`

### `src/components/`

- Pasta para componentes reutilizáveis.
- A skill deve criar `src/components/` vazia caso não exista. NÃO crie arquivos de componente automaticamente — deixe a pasta pronta para uso futuro.

### `src/libs/`

- Configurações e wrappers para bibliotecas padrão do projeto, por exemplo:
  - `src/libs/axios.ts` (instância do axios com interceptors)
  - `src/libs/queryClient.ts` (configuração do tanstack-query)

### `src/services/`

- Chamadas e estruturas para serviços externos (APIs, AsyncStorage, etc.).
- Organização sugerida:
  - `src/services/api/` — funções para endpoints (ex: `users.ts`, `auth.ts`)
  - `src/services/storage/` — wrappers para AsyncStorage
  - `src/services/query/` — organização dos hooks do tanstack-query (useQuery, useMutation)

### `src/styles/`

- Deve existir `src/styles/global.css` contendo as diretivas do Tailwind v5 e comentários/valores iniciais para customização do tema.
- O arquivo `global.css` deve ser o ponto de referência para todas as personalizações de tema e para garantir compatibilidade com `nativewind` (Tailwind v5).

Exemplo inicial de `src/styles/global.css` (esqueleto para Tailwind v5 + NativeWind):

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";

@import "nativewind/theme";

/* Example: custom properties / theme tokens */
:root {
  --color-primary: #0ea5e9; /* sky-500 */
  --font-sans: "System";
}

@media android {
  :root {
    --font-sans: "System";
  }
}

@media ios {
  :root {
    --font-sans: "System";
  }
}

:root,
html,
body {
  height: 100%;
}

div#root {
  height: 100%;
  display: flex;
}
```

/_ NativeWind compatibility notes: - Use classes Tailwind normalmente dentro dos components RN (via nativewind) _/

## Regras de reestruturação (comportamento da IA)

1. Detectar e preservar arquivos na raiz existentes — NÃO movê-los automaticamente (ex.: `app.json`, `package.json`, `tsconfig.json`).
2. Criar `src/` caso não exista e mover código-fonte detectado para dentro de `src/` seguindo as regras deste documento.
3. Ao mover, atualizar imports relativos que eram baseados na antiga estrutura (se possível automaticamente). Se não for possível, abrir uma lista de mudanças propostas.
4. Criar pastas vazias quando solicitado (`src/components/`) ao invés de arquivos placeholder.
5. Para cada arquivo criado automaticamente (ex.: `src/app/index.tsx`, `src/styles/global.css`), adicionar um comentário inicial informando que foi gerado pela skill e orientações rápidas para edição.

## Exemplos de arquivos que a IA deve criar automaticamente

- `src/app/index.tsx` — página inicial (Hello World) — já mostrado acima.
- `src/app/_layout.tsx` — pode ser um layout mínimo usando index do expo-router.

## Instalação e configurações

Observações gerais:

- Todas as dependências de execução listadas abaixo devem ser instaladas usando `npx expo install <nome-da-biblioteca>`.
- As dependências de desenvolvimento (dev) devem ser instaladas separadamente como dev-dependencies (ex.: `bun install -D <pkg>`).

Comandos de instalação (exemplos):

- Dependências de runtime (execute na raiz do projeto):

```
npx expo install react-hook-form zod @hookform/resolvers @backpackapp-io/react-native-toast \
  @gorhom/bottom-sheet @react-native-async-storage/async-storage @tanstack/react-query clsx \
  nativewind@preview react-native-gesture-handler react-native-keyboard-controller react-native-svg \
  tailwind-merge axios
```

- Dependências de desenvolvimento (ex.: ferramentas de build/transform):

```
bun install -D @biomejs/biome react-native-svg-transformer tailwindcss @tailwindcss/postcss postcss
```

Configurações e exemplos (resumo rápido):

- `react-hook-form`, `zod`, `@hookform/resolvers`
  - Instalar conforme acima e usar `zodResolver` do `@hookform/resolvers/zod` para validação no `react-hook-form`.

- `@backpackapp-io/react-native-toast`
  - Instalar e usar o toast provider no root do app. Ex.: envolver o `Router`/`NavigationContainer` com o provider do toast.

- `@gorhom/bottom-sheet`
  - Exige `react-native-reanimated` e configuração de `Reanimated` (ver docs do gorhom). Use `BottomSheet` nos componentes conforme docs.

- `@react-native-async-storage/async-storage`
  - Usar para persistência local; criar wrapper em `src/services/storage/`.

- `@tanstack/react-query`
  - Criar `src/libs/queryClient.ts` com `QueryClient` e `QueryClientProvider` no entry do app.

- `clsx` e `tailwind-merge`
  - Utilitários para composição de classes; úteis em componentes estilizados com NativeWind.

- `nativewind` (preview)
  - Instalação via `npx expo install nativewind@preview`.
  - Atualizar `postcss.config.mjs`.

- `react-native-gesture-handler` e `react-native-keyboard-controller`
  - Instalar e seguir as instruções de linking/gestures para Expo (normalmente via `expo install`).

- `react-native-svg` e `react-native-svg-transformer`
  - Para permitir import de `.svg` como componentes, configure `metro.config.js` com `react-native-svg-transformer`.
  - Exemplo de `metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return withNativewind(config);
})();
```

- `tailwindcss@^5`, `@tailwindcss/postcss`, `postcss`
  - Após instalar como dev deps, crie `postcss.config.mjs` com:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- `@biomejs/biome`
  - Instale em dev e crie o arquivo de configuração de formatação/lint do Biome na raiz do projeto chamado `biome.json`. Exemplo mínimo no `biome.json`:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "linter": {
    "rules": {
      "nursery": {
        "useSortedClasses": {
          "fix": "safe",
          "level": "warn"
        }
      }
    }
  },
  "formatter": {
    "lineWidth": 160,
    "formatWithErrors": true
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "semicolons": "asNeeded",
      "trailingCommas": "all"
    }
  }
}
```

- `axios` — cliente HTTP com refresh token e retry para 401
  - Exemplo de `src/libs/apiClient.ts` (TypeScript):

```ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { env } from "@/env";

const baseURL = env.API_BASE_URL;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

function createApiClient(): AxiosInstance {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    // attach access token from storage/env
    const token = globalThis?.__ACCESS_TOKEN__ || null;
    if (token && config.headers)
      config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers)
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Exemplo: fazer refresh usando endpoint /auth/refresh
          const refreshToken = globalThis?.__REFRESH_TOKEN__ || null;
          const resp = await axios.post(`${baseURL}/auth/refresh`, {
            token: refreshToken,
          });
          const newToken = resp.data?.accessToken;

          // Atualize local storage / global state com newToken
          globalThis.__ACCESS_TOKEN__ = newToken;

          processQueue(null, newToken);
          if (originalRequest.headers)
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const apiClient = createApiClient();
```

- Observações do trecho acima:
  - A lógica usa uma fila (`failedQueue`) para armazenar requests 401 enquanto o refresh ocorre, e os re-executa após obter novo token.
  - Em produção armazene tokens de forma segura (AsyncStorage seguro, Keychain) e trate erros de refresh adequadamente (logout, redirecionamento).

## Passo a passo pós-instalação (resumo rápido)

1. Instale dependências conforme os comandos acima.
2. Configure `postcss.config.mjs` e rode as tasks de build quando necessário (normalmente somente para web builds).
3. Configure `metro.config.js` para `react-native-svg-transformer` se quiser importar SVGs como componentes.
4. Crie instâncias/wrappers iniciais em `src/libs/` e `src/services/` (ex.: `apiClient`, `queryClient`, `storage` wrappers).

## Observações finais

- Este documento serve como referência objetiva para a IA reorganizar o projeto. Ele prioriza segurança (não apagar/alterar arquivos sem validação) e convenções claras para TypeScript + Expo + Tailwind v5 + NativeWind.
- Se houver preferências adicionais (ex.: monorepo, src/components compartilhados, testes), adicione uma seção específica e a IA vai aplicar as regras novas.

## Atualização: política mínima de layout, fontes e remoção de pastas na raiz

Esta skill foi atualizada com regras adicionais para criar uma base de projeto mínima e evitar geração automática de wrappers e assets:

- Remover as pastas `components/` e `constants/` que existam na raiz do projeto. Após a reestruturação, o código-fonte reutilizável deve residir em `src/components/` e `src/constants/` (ou equivalente) — o root não deve conter essas pastas.
- Remover as pastas `app/`, `components/` e `constants/` que existam na raiz do projeto. Após a reestruturação, o código-fonte reutilizável deve residir em `src/` (ex.: `src/components/`, `src/constants/`) — o root não deve conter essas pastas.
- Não criar automaticamente arquivos de componente dentro de `src/components/`; crie apenas a pasta vazia para o desenvolvedor adicionar componentes posteriormente.
- Não carregar ou instalar automaticamente fontes presentes em `assets/fonts` no layout. A skill pode remover fontes em `assets/fonts` se o usuário solicitar explicitamente. O `_layout.tsx` não deve executar `useFonts` por padrão.
- A skill deve criar um `apiClient` mínimo em `src/libs/apiClient.ts` quando for reorganizar o projeto — um axios instance com `baseURL` configurado via variáveis de ambiente e um interceptor para anexar `Authorization` quando um token estiver presente. Não implemente automaticamente refresh tokens/filas sem confirmação do usuário.
- O `QueryClient` padrão deve ser criado em `src/libs/react-query.ts` com `defaultOptions.queries.staleTime` definido para 10 minutos (600000 ms). Use uma constante nomeada para o cálculo em milisegundos e inclua um comentário explicando que representa 10 minutos.
- A skill deve criar um `apiClient` mínimo em `src/libs/apiClient.ts` quando for reorganizar o projeto — um axios instance com `baseURL` configurado via variáveis de ambiente e um interceptor para anexar `Authorization` quando um token estiver presente. O `apiClient` deve usar um serviço de `AsyncStorage` para persistir e recuperar o objeto `token` (contendo `accessToken` e opcionalmente `refreshToken`).
- Ao detectar `401`, o `apiClient` pode implementar um fluxo de refresh token com fila de requests (retries) — a skill deve implementar esse fluxo apenas se o serviço de armazenamento de token (`src/services/storage/token-storage.ts`) estiver presente.
- O serviço de `AsyncStorage` deve expor funções `getTokenFromStorage`, `setTokenToStorage`, `updateTokenInStorage`, `removeTokenFromStorage` e usar chaves definidas em `src/constants/asyncstorage-keys.ts`. A chave para o token deve seguir o padrão `@<project-name>:token`.
- O `QueryClient` padrão deve ser criado em `src/libs/react-query.ts` com `defaultOptions.queries.staleTime` definido para 10 minutos (600000 ms). Use uma constante nomeada para o cálculo em milisegundos e inclua um comentário explicando que representa 10 minutos.
- O `_layout.tsx` gerado deve ser mínimo: usar `Slot` do `expo-router`, definir `unstable_settings.initialRouteName` para `index` e NÃO incluir theming dinâmico, wrappers de provedor, guards, toasts, query clients, gesture handlers ou outros handlers automaticamente. Esses elementos só devem ser adicionados quando as dependências forem confirmadas e a inclusão for solicitada pelo usuário.
- Evitar referências automáticas a `@/components`, `@/libs` ou `@/hooks` no layout — importe apenas quando os arquivos existirem e forem necessários.

- Evitar referências automáticas a `@/components`, `@/libs` ou `@/hooks` no layout — importe apenas quando os arquivos existirem e forem necessários.
- Não importar `React` diretamente em arquivos gerados. A skill deve assumir o uso do runtime JSX automático (sem `import React from "react"`) ao produzir arquivos `.tsx`.

Essas regras garantem que a skill produza uma base enxuta e evitam alterações indesejadas que precisem de limpeza manual após a reestruturação.

---

Arquivo atualizado: .github/skills/restructure/SKILL.md
