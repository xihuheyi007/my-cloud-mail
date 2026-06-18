import { Hono } from 'hono';
const app = new Hono();

import result from '../model/result';
import { cors } from 'hono/cors';

app.use('*', cors({
	origin: (origin, c) => {
		if (!origin) return '';
		const allowed = ['http://localhost:3001', 'http://127.0.0.1:3001'];
		// 从环境变量扩展允许的域名（逗号分隔）
		try {
			const extra = c?.env?.ALLOWED_ORIGINS;
			if (extra) {
				allowed.push(...extra.split(',').map(s => s.trim()).filter(Boolean));
			}
		} catch (_) {
			// env 不可用时使用默认列表
		}
		return allowed.includes(origin) ? origin : '';
	},
	credentials: true,
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Authorization', 'Content-Type', 'Accept'],
}));

app.use('*', async (c, next) => {
	await next();
	c.header('X-Content-Type-Options', 'nosniff');
	c.header('X-Frame-Options', 'DENY');
	c.header('X-XSS-Protection', '0');
	c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

app.onError((err, c) => {
	if (err.name === 'BizError') {
		console.log(err.message);
	} else {
		console.error(err);
	}

	// Check if service bindings are missing
	if (!c.env.db || !c.env.kv) {
		return c.json(result.fail('Service configuration error', 502));
	}

	// BizError passes its message and code to the client
	if (err.name === 'BizError') {
		return c.json(result.fail(err.message, err.code));
	}

	// Other errors return generic message to avoid information leakage
	return c.json(result.fail('Internal server error', 500));
});

export default app;


