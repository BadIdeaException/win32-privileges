import { formatMessageW } from './kernel32.js';

export default class WindowsError extends Error {
	code: number;

	constructor(code: number, message: string) {
		super(message);
		this.code = code;
	}

	static from(code: number): WindowsError {
		let msg: string;
		try {
			msg = formatMessageW(code);
		} catch {
			msg = '';
		}
		return new WindowsError(code, msg);
	}
}
