/**
 * The `/models` response shape shared by most providers:
 * `{ data: [{ id: string, ... }] }`.
 * Only the fields this package consumes are checked; extra fields are ignored.
 * A provider whose response differs should define its own guard in its adapter.
 */
export interface ModelsResponse {
  data: { id: string }[];
}

export function isModelsResponse(body: unknown): body is ModelsResponse {
  if (typeof body !== 'object' || body === null || !('data' in body)) return false;
  const data = (body as { data: unknown }).data;
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) => typeof item === 'object' && item !== null && typeof (item as { id: unknown }).id === 'string',
  );
}

export function assertResponseOk(response: Response, providerName: string): void {
  if (!response.ok) {
    throw new Error(`Failed to list ${providerName} models: ${response.status} ${response.statusText}`);
  }
}
