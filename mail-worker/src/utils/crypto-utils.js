const encoder = new TextEncoder();

const saltHashUtils = {

	generateSalt(length = 16) {
		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		return btoa(String.fromCharCode(...array));
	},


	async hashPassword(password) {
		const salt = this.generateSalt();
		const hash = await this.genHashPassword(password, salt);
		return { salt, hash };
	},

	async genHashPassword(password, salt) {
		const iterations = 100000;
		const keyMaterial = await crypto.subtle.importKey(
			'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
		);
		const bits = await crypto.subtle.deriveBits(
			{ name: 'PBKDF2', salt: encoder.encode(salt), iterations, hash: 'SHA-256' },
			keyMaterial, 256
		);
		const hash = Array.from(new Uint8Array(bits))
			.map(b => b.toString(16).padStart(2, '0')).join('');
		return `pbkdf2$${iterations}$${salt}$${hash}`;
	},

	async verifyPassword(inputPassword, salt, storedHash) {
		if (storedHash.startsWith('pbkdf2$')) {
			const newHash = await this.genHashPassword(inputPassword, salt);
			return newHash === storedHash;
		}
		// Old format: SHA-256 (for backward compatibility)
		const data = encoder.encode(salt + inputPassword);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const oldHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
		return oldHash === storedHash;
	},

	genRandomPwd(length = 8) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(array[i] % chars.length);
		}
		return result;
	}
};

export default saltHashUtils;
