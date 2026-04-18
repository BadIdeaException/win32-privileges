import { SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED, SE_PRIVILEGE_USED_FOR_ACCESS } from './advapi32.js'
import { SE_CREATE_TOKEN_NAME, SE_ASSIGNPRIMARYTOKEN_NAME, SE_LOCK_MEMORY_NAME, SE_INCREASE_QUOTA_NAME, SE_UNSOLICITED_INPUT_NAME, SE_MACHINE_ACCOUNT_NAME, SE_TCB_NAME, SE_SECURITY_NAME, SE_TAKE_OWNERSHIP_NAME, SE_LOAD_DRIVER_NAME, SE_SYSTEM_PROFILE_NAME, SE_SYSTEMTIME_NAME, SE_PROF_SINGLE_PROCESS_NAME, SE_INC_BASE_PRIORITY_NAME, SE_CREATE_PAGEFILE_NAME, SE_CREATE_PERMANENT_NAME, SE_BACKUP_NAME, SE_RESTORE_NAME, SE_SHUTDOWN_NAME, SE_DEBUG_NAME, SE_AUDIT_NAME, SE_SYSTEM_ENVIRONMENT_NAME, SE_CHANGE_NOTIFY_NAME, SE_REMOTE_SHUTDOWN_NAME, SE_UNDOCK_NAME, SE_SYNC_AGENT_NAME, SE_ENABLE_DELEGATION_NAME, SE_MANAGE_VOLUME_NAME, SE_IMPERSONATE_NAME, SE_CREATE_GLOBAL_NAME, SE_TRUSTED_CREDMAN_ACCESS_NAME, SE_RELABEL_NAME, SE_INC_WORKING_SET_NAME, SE_TIME_ZONE_NAME, SE_CREATE_SYMBOLIC_LINK_NAME, SE_DELEGATE_SESSION_USER_IMPERSONATE_NAME } from './advapi32.js';
import type { PrivilegeName } from './advapi32.js';
export { type PrivilegeName } from './advapi32.js';

/** 
 * Represents a single privilege. 
 *
 * A privilege is the right of a user to perform various system-related operations, such as shutting down the system, loading device drivers, or changing the system time. 
 * A user's access token contains a list of the privileges held by either the user or the user's groups. These privileges are inherited by processes owned by the user.
 *
 * A `Privilege` consists of the privilege's name, and its activation status.
 *
 * This class exposes all [privilege names](https://learn.microsoft.com/en-us/windows/win32/secauthz/privilege-constants) as static properties (e.g. `Privilege.SE_CREATE_TOKEN_NAME`).
 */
export default class Privilege {
	name: string;
	private _status: number;

	static SE_CREATE_TOKEN: PrivilegeName = SE_CREATE_TOKEN_NAME;
	static SE_ASSIGNPRIMARYTOKEN: PrivilegeName = SE_ASSIGNPRIMARYTOKEN_NAME;
	static SE_LOCK_MEMORY: PrivilegeName = SE_LOCK_MEMORY_NAME;
	static SE_INCREASE_QUOTA: PrivilegeName = SE_INCREASE_QUOTA_NAME;
	static SE_UNSOLICITED_INPUT: PrivilegeName = SE_UNSOLICITED_INPUT_NAME;
	static SE_MACHINE_ACCOUNT: PrivilegeName = SE_MACHINE_ACCOUNT_NAME;
	static SE_TCB: PrivilegeName = SE_TCB_NAME;
	static SE_SECURITY: PrivilegeName = SE_SECURITY_NAME;
	static SE_TAKE_OWNERSHIP: PrivilegeName = SE_TAKE_OWNERSHIP_NAME;
	static SE_LOAD_DRIVER: PrivilegeName = SE_LOAD_DRIVER_NAME;
	static SE_SYSTEM_PROFILE: PrivilegeName = SE_SYSTEM_PROFILE_NAME;
	static SE_SYSTEMTIME: PrivilegeName = SE_SYSTEMTIME_NAME;
	static SE_PROF_SINGLE_PROCESS: PrivilegeName = SE_PROF_SINGLE_PROCESS_NAME;
	static SE_INC_BASE_PRIORITY: PrivilegeName = SE_INC_BASE_PRIORITY_NAME;
	static SE_CREATE_PAGEFILE: PrivilegeName = SE_CREATE_PAGEFILE_NAME;
	static SE_CREATE_PERMANENT: PrivilegeName = SE_CREATE_PERMANENT_NAME;
	static SE_BACKUP: PrivilegeName = SE_BACKUP_NAME;
	static SE_RESTORE: PrivilegeName = SE_RESTORE_NAME;
	static SE_SHUTDOWN: PrivilegeName = SE_SHUTDOWN_NAME;
	static SE_DEBUG: PrivilegeName = SE_DEBUG_NAME;
	static SE_AUDIT: PrivilegeName = SE_AUDIT_NAME;
	static SE_SYSTEM_ENVIRONMENT: PrivilegeName = SE_SYSTEM_ENVIRONMENT_NAME;
	static SE_CHANGE_NOTIFY: PrivilegeName = SE_CHANGE_NOTIFY_NAME;
	static SE_REMOTE_SHUTDOWN: PrivilegeName = SE_REMOTE_SHUTDOWN_NAME;
	static SE_UNDOCK: PrivilegeName = SE_UNDOCK_NAME;
	static SE_SYNC_AGENT: PrivilegeName = SE_SYNC_AGENT_NAME;
	static SE_ENABLE_DELEGATION: PrivilegeName = SE_ENABLE_DELEGATION_NAME;
	static SE_MANAGE_VOLUME: PrivilegeName = SE_MANAGE_VOLUME_NAME;
	static SE_IMPERSONATE: PrivilegeName = SE_IMPERSONATE_NAME;
	static SE_CREATE_GLOBAL: PrivilegeName = SE_CREATE_GLOBAL_NAME;
	static SE_TRUSTED_CREDMAN_ACCESS: PrivilegeName = SE_TRUSTED_CREDMAN_ACCESS_NAME;
	static SE_RELABEL: PrivilegeName = SE_RELABEL_NAME;
	static SE_INC_WORKING_SET: PrivilegeName = SE_INC_WORKING_SET_NAME;
	static SE_TIME_ZONE: PrivilegeName = SE_TIME_ZONE_NAME;
	static SE_CREATE_SYMBOLIC_LINK: PrivilegeName = SE_CREATE_SYMBOLIC_LINK_NAME;
	static SE_DELEGATE_SESSION_USER_IMPERSONATE: PrivilegeName = SE_DELEGATE_SESSION_USER_IMPERSONATE_NAME;

	constructor(name: PrivilegeName, status: number) {
		this.name = name;
		this._status = status;
	}

	/**
	 * Whether this privilege is currently enabled.
	 *
	 * Only enabled privileges entitle the process to carry out the associated operations.
	 */
	isEnabled(): boolean {
		return Boolean(this._status & SE_PRIVILEGE_ENABLED);
	}

	/**
	 * Whether this privilege is enabled by default when the token is created.
	 *
	 * A privilege that is enabled by default may still be disabled later.
	 */
	isEnabledByDefault(): boolean {
		return Boolean(this._status & SE_PRIVILEGE_ENABLED_BY_DEFAULT);
	}

	/**
	 * Whether this privilege has actually been used. 
	 * (Specifically, whether it has contributed to at least one
	 * successful access check.)
	 */
	wasUsedForAccess(): boolean {
		return Boolean(this._status & SE_PRIVILEGE_USED_FOR_ACCESS);
	}
}