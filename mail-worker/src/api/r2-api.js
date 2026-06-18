import r2Service from '../service/r2-service';
import app from '../hono/hono';
import KvConst from '../const/kv-const';

app.get('/oss/*', async (c) => {
	// Public token verification (supports query param for img src compatibility)
	const publicToken = c.req.header('X-Public-Token') || c.req.header('token') || c.req.query('token');
	const storedToken = await c.env.kv.get(KvConst.PUBLIC_KEY);
	if (!storedToken || publicToken !== storedToken) {
		return c.json({ code: 401, message: 'Unauthorized' }, 401);
	}

	const key = c.req.path.split('/oss/')[1];
	if (!key || key.includes('..') || key.startsWith('/') || key.startsWith('\\')) {
		return c.json({ code: 400, message: 'Invalid key' }, 400);
	}
	const obj = await r2Service.getObj(c, key);
	return new Response(obj.body, {
		headers: {
			'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
			'Content-Disposition': obj.httpMetadata?.contentDisposition || null
		}
	});
});


