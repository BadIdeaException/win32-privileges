import * as kernel32 from './kernel32.js';
import * as advapi32 from './advapi32.js';
import Privilege, { type PrivilegeName } from './privilege.js';
export { Privilege };


/**
 * Retrieves all privileges associated with the current process token, 
 * regardless of whether they are enabled or not. A privilege that is present
 * but disabled is potentially available to this process, i.e. within the scope
 * of permitted operations for the user owning the process. Only enabled privileges,
 * however, actually entitle the process to carry out the associated operations.
 * 
 * For example, a process may have the `SE_SHUTDOWN_PRIVILEGE` privilege present. This means
 * that it can potentially shut down the system, but it cannot do so currently (because the
 * privilege is disabled).
 * To actually shut down the system, the process requires an enabled `SE_SHUTDOWN_PRIVILEGE`. 
 * If the privilege is not present at all, the process can never shut down the system.
 * 
 * Use {@link getEnabledPrivileges} if you want to get a list of enabled privileges.
 * 
 * @returns {Privilege[]} An array of {@link Privilege} objects representing
 * all privileges assigned to the current process.
 * 
 * @throws {Error} If called on platform other than Windows.
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

/**
 * Checks whether the current process has a specific privilege assigned,
 * regardless of whether the privilege is enabled or not.
 *
 * See {@link getPrivileges} for details on present vs enabled privileges.
 * 
 * Use {@link hasEnabledPrivilege} instead if you want to check for enabled privileges.
 *
 * @param {PrivilegeName} privilege - The name of the privilege to check.
 * @returns {boolean} `true` if the privilege exists in the process token;
 * otherwise `false`.
 * @throws {Error} If called on platform other than Windows.
 */
export function hasPrivilege(privilege: PrivilegeName): boolean {
	return getPrivileges().some(priv => priv.name === privilege);
}

/**
 * Retrieves all enabled privileges associated with the current process token.
 * These privileges are active, i.e. entitle the process to carry out the associated
 * operations.
 *
 * See {@link getPrivileges} for details on present vs enabled privileges.
 * 
 * @returns {Privilege[]} An array of enabled {@link Privilege} objects.
 * @throws {Error} If called on platform other than Windows.
 */
export function getEnabledPrivileges(): Privilege[] {
	return getPrivileges().filter(priv => priv.isEnabled());
}

/**
 * Checks whether a specific privilege is present and enabled for the
 * current process.
 *
 * See {@link getPrivileges} for details on present vs enabled privileges.
 *
 * @param {PrivilegeName} privilege - The name of the privilege to check.
 * @returns {boolean} `true` if the privilege exists and is enabled;
 * otherwise `false`.
 * @throws {Error} If called on platform other than Windows.
 */
export function hasEnabledPrivilege(privilege: PrivilegeName): boolean {
	return getEnabledPrivileges().some(priv => priv.name === privilege);
}