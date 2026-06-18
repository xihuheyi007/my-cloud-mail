import app from '../hono/hono';
import result from "../model/result";
import oauthService from "../service/oauth-service";

app.get('/oauth/linuxDo/authUrl', async (c) => {
	const data = await oauthService.getAuthUrl(c);
	return c.json(result.ok(data))
});

app.post('/oauth/linuxDo/login', async (c) => {
	const loginInfo = await oauthService.linuxDoLogin(c, await c.req.json());
	return c.json(result.ok(loginInfo))
});

app.put('/oauth/bindUser', async (c) => {
	const loginInfo = await oauthService.bindUser(c, await c.req.json());
	return c.json(result.ok(loginInfo))
})
