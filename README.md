# 🔍 llm-lister

Zero-dependency, cross-runtime utility to list the models available to an LLM provider account, given an API key.

Works in Node.js (18+), Cloudflare Workers, browsers, and any other runtime that implements the standard `fetch` API. No SDKs, no bundled provider clients — just a thin wrapper around each provider's `/models` endpoint.

## 🤔 Why

Most multi-provider LLM libraries bundle chat completion, streaming, and model listing together, pulling in a large dependency tree even if all you need is "what models can this API key use?" `llm-lister` does only that one thing.

## 📦 Install

```bash
npm install llm-lister
```

## 🚀 Usage

```typescript
import { listModels } from 'llm-lister';

const apiKey = /* however you store your DeepSeek API key */ '...';
const models = await listModels('deepseek', apiKey);
// [{ id: 'deepseek-flash', provider: 'deepseek' }, { id: 'deepseek-v4-pro', provider: 'deepseek' }]
```

Check which providers are currently supported:

```typescript
import { getSupportedProviders } from 'llm-lister';

getSupportedProviders();
// ['deepseek']
```

## 📖 API

### `listModels(provider, apiKey)`

Returns the list of models available to the given API key.

- `provider: Provider` — the provider to query
- `apiKey: string` — the API key for that provider
- Returns: `Promise<ModelInfo[]>`
- Throws if the provider is not supported, the request fails, or the response shape is unexpected.

```typescript
interface ModelInfo {
  id: string;
  provider: string;
}
```

### `getSupportedProviders()`

Returns the list of providers currently implemented by this package.

- Returns: `Provider[]`

## ✅ Supported providers

| Provider     | Status       |
| ------------ | ------------ |
| `deepseek`   | ✅ Supported |
| `anthropic`  | ✅ Supported |
| `openai`     | 🚧 Planned   |
| `groq`       | 🚧 Planned   |
| `openrouter` | 🚧 Planned   |

## 🤝 Contributing

Each provider lives in its own file under `src/providers/`, implementing the `ProviderAdapter` interface (`src/types.ts`). To add a new provider:

1. Create `src/providers/<name>.ts` exporting a `ProviderAdapter`.
2. Register it in the `adapters` map in `src/index.ts`.
3. Add tests under `tests/providers/<name>.test.ts`, mocking `fetch` — do not call the real API in tests.

## 📄 License

MIT
