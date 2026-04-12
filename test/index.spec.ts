import { describe } from 'mocha';
import { expect } from 'chai';
import { execSync } from 'node:child_process';
import getPrivileges from '../src/index.ts';

describe('getPrivileges', function() {
	let expected;
	
	before(function() {
		if (process.platform !== 'win32') {
			console.error("The tests for this package must be run in Windows");
			this.skip();
		}
	});

	before(async function() {
 		expected = execSync('whoami /priv /fo csv /nh', { encoding: 'utf8' })
 			.split('\n')
 			.map(line => line.split(','))
 			.filter(descriptor => /enabled/i.test(descriptor[2]))
 			.map(([ priv ]) => priv.slice(1, -1));
 		
 		expected = new Set(expected);
	});

	it('should have the correct privileges', function() {
		let actual = getPrivileges()		
			.filter(priv => priv.isEnabled())
			.map(priv => priv.name);
		actual = new Set(actual);

		expect(actual).to.deep.equal(expected);
	});

	it('should throw when called from a non-windows platform', function() {
		const _platform = Object.getOwnPropertyDescriptor(process, 'platform');
		try {
			Object.defineProperty(process, 'platform', { value: 'linux' });
			expect(getPrivileges).to.throw();
		} finally {
			Object.defineProperty(process, 'platform', _platform);
		}
	});
});