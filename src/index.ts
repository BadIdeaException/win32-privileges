import * as kernel32 from './kernel32.js';
import * as advapi32 from './advapi32.js';
import Privilege, { type PrivilegeName } from './privilege.js';

/**
 * Queries the kernel for the privileges assigned to the current process. 
 * @returns An array of `Privilege` objects
 * @throws When called from an OS other than Windows 
 */
export function getPrivileges(): Privilege[] {
	if (process?.platform !== 'win32') 
		throw new Error(`getPrivileges can only be called from Windows`);

	const processHandle: kernel32.ProcessHandle = kernel32.getCurrentProcess();
	const tokenHandle: advapi32.TokenHandle = advapi32.openProcessToken(processHandle, advapi32.TOKEN_READ);
	try {
		const tokenInformation: advapi32.TokenPrivilegeInformation[] = advapi32.getTokenInformation(tokenHandle, advapi32.TokenPrivileges);
		const privileges: Privilege[] = tokenInformation.map(({ luid, attributes }) => new Privilege(advapi32.lookupPrivilegeNameW(luid), attributes));
		return privileges;
	} finally {
		kernel32.closeHandle(tokenHandle);
	}
}

export function hasPrivilege(privilege: PrivilegeName): boolean {
	return getPrivileges().some(priv => priv.name === privilege);
}

export function getEnabledPrivileges(): Privilege[] {
	return getPrivileges().filter(priv => priv.isEnabled());
}

export function hasEnabledPrivilege(privilege: PrivilegeName): boolean {
	return getEnabledPrivileges().some(priv => priv.name === privilege);
}