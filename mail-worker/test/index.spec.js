import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('cloud-mail worker', () => {
	it('serves the SPA for the root path (unit style)', async () => {
		const request = new Request('http://example.com/');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/html');
	});

	it('serves the SPA for the root path (integration style)', async () => {
		const response = await SELF.fetch('http://example.com/');
		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/html');
	});

	it('returns the standard JSON wrapper for public config API', async () => {
		const response = await SELF.fetch('http://example.com/api/setting/websiteConfig');
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty('code');
		expect(body).toHaveProperty('message');
	});

	it('rejects unknown API routes without auth (security middleware runs before 404)', async () => {
		const response = await SELF.fetch('http://example.com/api/not-exist-route');
		// 安全中间件先于 Hono 404 执行：未知路由无 token 时返回 401
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.code).toBe(401);
	});

	it('rejects login with invalid credentials payload', async () => {
		const response = await SELF.fetch('http://example.com/api/login', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email: '', password: '' })
		});
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.code).not.toBe(200);
	});
});
