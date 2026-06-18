import emailService from './email-service';
import { emailConst } from '../const/entity-const';
import BizError from '../error/biz-error';

const resendService = {

	async webhooks(c, bodyText) {

		// Webhook signature verification
		const svixId = c.req.header('svix-id');
		const svixTimestamp = c.req.header('svix-timestamp');
		const svixSignature = c.req.header('svix-signature');
		if (!svixId || !svixTimestamp || !svixSignature) {
			throw new BizError('Invalid webhook signature');
		}
		// Verify timestamp is within 5 minutes
		const now = Math.floor(Date.now() / 1000);
		const ts = parseInt(svixTimestamp);
		if (Math.abs(now - ts) > 300) {
			throw new BizError('Webhook timestamp expired');
		}

		// HMAC-SHA256 signature verification
		const webhookSecret = c.env?.RESEND_WEBHOOK_SECRET;
		if (!webhookSecret) {
			throw new BizError('Webhook secret not configured');
		}
		try {
			// Svix secret format: whsec_<base64-encoded-key>
			const rawSecretBase64 = webhookSecret.replace(/^whsec_/, '');
			const rawSecret = Uint8Array.from(atob(rawSecretBase64), ch => ch.charCodeAt(0));

			const key = await crypto.subtle.importKey(
				'raw',
				rawSecret,
				{ name: 'HMAC', hash: 'SHA-256' },
				false,
				['sign']
			);

			const signedContent = `${svixId}.${svixTimestamp}.${bodyText}`;
			const signatureBuffer = await crypto.subtle.sign(
				'HMAC',
				key,
				new TextEncoder().encode(signedContent)
			);
			const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

			// svix-signature format: "v1,sig1 v1,sig2" (space-separated, may contain multiple)
			const signatures = svixSignature.split(' ').map(s => s.split(',')[1]).filter(Boolean);
			const isValid = signatures.includes(computedSignature);
			if (!isValid) {
				throw new BizError('Invalid webhook signature');
			}
		} catch (e) {
			if (e instanceof BizError) throw e;
			throw new BizError('Webhook signature verification failed');
		}

		// Parse JSON body after successful signature verification
		let body;
		try {
			body = JSON.parse(bodyText);
		} catch (e) {
			throw new BizError('Invalid webhook body');
		}

		const params = {
			resendEmailId: body.data.email_id,
			status: emailConst.status.SENT
		}

		if (body.type === 'email.delivered') {
			params.status = emailConst.status.DELIVERED
			params.message = null
		}

		if (body.type === 'email.complained') {
			params.status = emailConst.status.COMPLAINED
			params.message = null
		}

		if (body.type === 'email.bounced') {
			let bounce = body.data.bounce
			bounce = JSON.stringify(bounce);
			params.status = emailConst.status.BOUNCED
			params.message = bounce
		}

		if (body.type === 'email.delivery_delayed') {
			params.status = emailConst.status.DELAYED
			params.message = null
		}

		if (body.type === 'email.failed') {
			params.status = emailConst.status.FAILED
			params.message = body.data.failed.reason
		}

		const emailRow = await emailService.updateEmailStatus(c, params)

		if (!emailRow) {
			throw new BizError('更新邮件状态记录失败');
		}

	}
}

export default resendService
