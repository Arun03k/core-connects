import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key), clear: () => values.clear() };
}

const tokens = { accessToken: 'expired-access', refreshToken: 'refresh', expiresIn: 900, tokenType: 'Bearer' };
const user = { id: '123', email: 'employee@example.com', firstName: 'Test', role: 'EMPLOYEE' };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json' },
});

async function setup(persisted = true) {
  const session = storage();
  if (persisted) {
    session.setItem('accessToken', tokens.accessToken);
    session.setItem('refreshToken', tokens.refreshToken);
    session.setItem('tokenExpiresIn', '900');
    session.setItem('user', JSON.stringify(user));
  }
  vi.stubGlobal('sessionStorage', session);
  vi.stubGlobal('localStorage', storage());
  const { default: reducer } = await import('./slices/authSlice');
  const actions = await import('./thunks/authThunks');
  return { store: configureStore({ reducer: { auth: reducer } }), actions, session };
}

beforeEach(() => { vi.resetModules(); vi.unstubAllGlobals(); });

describe('session security', () => {
  it('does not trust stored identity until the server verifies it', async () => {
    const { store, actions } = await setup();
    expect(store.getState().auth.isAuthenticated).toBe(false);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ data: { user } })));
    await store.dispatch(actions.restoreSession());
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.sessionStatus).toBe('ready');
  });

  it('refreshes a rejected access token and verifies the resulting identity', async () => {
    const { store, actions, session } = await setup();
    const fetch = vi.fn().mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      .mockResolvedValueOnce(json({ data: { ...tokens, accessToken: 'renewed-access' } }))
      .mockResolvedValueOnce(json({ data: { user } }));
    vi.stubGlobal('fetch', fetch);
    await store.dispatch(actions.restoreSession());
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(session.getItem('accessToken')).toBe('renewed-access');
  });

  it('clears invalid sessions and never renders them as authenticated', async () => {
    const { store, actions, session } = await setup();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(json({ message: 'Revoked' }, 401))));
    await store.dispatch(actions.restoreSession());
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.sessionStatus).toBe('ready');
    expect(session.getItem('refreshToken')).toBeNull();
  });

  it('clears local credentials even if logout cannot reach the server', async () => {
    const { store, actions, session } = await setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await store.dispatch(actions.logoutUser());
    expect(store.getState().auth.tokens).toBeNull();
    expect(session.getItem('accessToken')).toBeNull();
  });

  it('settles an anonymous session without making a request', async () => {
    const { store, actions } = await setup(false);
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    await store.dispatch(actions.restoreSession());
    expect(fetch).not.toHaveBeenCalled();
    expect(store.getState().auth.sessionStatus).toBe('ready');
  });

  it('presents a safe error for an HTML proxy failure', async () => {
    const { store, actions } = await setup(false);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>private upstream</html>', { status: 502 })));
    await store.dispatch(actions.loginUser({ email: user.email, password: 'example' }));
    expect(store.getState().auth.error).toContain('unexpected response');
    expect(store.getState().auth.error).not.toContain('private upstream');
  });

  it('ignores a delayed restoration response after logout', async () => {
    const { store, actions } = await setup();
    let resolveVerification!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveVerification = resolve; }))
      .mockResolvedValueOnce(json({ status: 'success' })));
    const pending = store.dispatch(actions.restoreSession());
    await store.dispatch(actions.logoutUser());
    resolveVerification(json({ data: { user } }));
    await pending;
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.tokens).toBeNull();
  });

  it('still allows in-memory login when browser storage rejects writes', async () => {
    const { store, actions } = await setup(false);
    vi.stubGlobal('sessionStorage', { setItem: () => { throw new Error('disabled'); }, removeItem: () => {} });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ data: { ...tokens, user } })));
    await store.dispatch(actions.loginUser({ email: user.email, password: 'example' }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });
});
