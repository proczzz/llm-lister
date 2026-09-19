# 🔍 llm-lister

[![Live tests](https://github.com/proczzz/llm-lister/actions/workflows/live-tests.yml/badge.svg)](https://github.com/proczzz/llm-lister/actions/workflows/live-tests.yml)

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
// ['deepseek', 'anthropic', 'openai']
```

## 📖 API

### `listModels(provider, apiKey)`

Returns the list of models available to the given API key.

- `provider: Provider` — the provider to query
- `apiKey: string` — the API key for that provider
- Returns: `Promise<ModelInfo[]>`
- Throws if the provider is not supported, the request fails, or the response shape is unexpected.

```typescript
type Provider = 'deepseek' | 'anthropic' | 'openai';

interface ModelInfo {
  id: string;
  provider: Provider;
}
```

Models are returned as the provider reports them, without filtering. Depending on the provider this can include non-chat models (for example embeddings or speech models).

### `getSupportedProviders()`

Returns the list of providers currently implemented by this package.

- Returns: `Provider[]`

## ✅ Supported providers

| Provider     | Status       |
| ------------ | ------------ |
| `deepseek`   | ✅ Supported |
| `anthropic`  | ✅ Supported |
| `openai`     | ✅ Supported |
| `groq`       | 🚧 Planned   |
| `openrouter` | 🚧 Planned   |

## 🤝 Contributing

Each provider lives in its own file under `src/providers/`, implementing the `ProviderAdapter` interface (`src/types.ts`). To add a new provider:

1. Add the provider's name to `Provider` in `src/types.ts`.
2. Create `src/providers/<name>.ts` exporting a `ProviderAdapter`, and register it in `src/index.ts`.
3. Add `tests/providers/<name>.test.ts` and a sample response under `tests/fixtures/`, following the existing providers. Samples must not contain private data such as organization names or fine-tuned model ids.
4. Update the table in this README.

### 🧪 Testing

```bash
npm test            # unit tests: offline, no API keys needed
npm run test:live   # live tests: call the real provider APIs
```

Live tests read keys from `<PROVIDER>_API_KEY` environment variables (for example `OPENAI_API_KEY`); providers without a key are skipped locally. They also run weekly on GitHub Actions to catch provider-side API changes, and a maintainer will set up the API key for a new provider.

## 📄 License

MIT
