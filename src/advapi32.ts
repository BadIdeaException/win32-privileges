/**
 * Javascript wrappers for some kernel32 functions.
 */
import koffi from 'koffi';
import * as bindings from './bindings.js';
import { type Handle, getLastError, ProcessHandle } from './kernel32.js';
import WindowsError from './error.js';

/**
 * Convenience function to throw the last error.
 */
function throwLastError(): never {
	const error = getLastError();
	throw WindowsError.from(error);
}

export type TokenHandle = Handle & { __kind: 'TokenHandle' };

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function openProcessToken(processHandle: ProcessHandle, desiredAccess: number): TokenHandle {
	const pTokenHandle = Buffer.alloc(koffi.sizeof(bindings.HANDLE), 0);

	const ok = bindings.OpenProcessToken(processHandle, bindings.TOKEN_QUERY, pTokenHandle);
	if (!ok)
		throwLastError();

	return koffi.decode(pTokenHandle, 'HANDLE');
}

export type LUID = bigint;
export type TokenPrivilegeInformation = {
	luid: LUID;
	attributes: number;
}
export type TokenInformationClass = typeof bindings.TokenUser 
	| typeof bindings.TokenGroups 
	| typeof bindings.TokenPrivileges 
	| typeof bindings.TokenOwner 
	| typeof bindings.TokenPrimaryGroup 
	| typeof bindings.TokenDefaultDacl 
	| typeof bindings.TokenSource 
	| typeof bindings.TokenType 
	| typeof bindings.TokenImpersonationLevel 
	| typeof bindings.TokenStatistics 
	| typeof bindings.TokenRestrictedSids 
	| typeof bindings.TokenSessionId 
	| typeof bindings.TokenGroupsAndPrivileges 
	| typeof bindings.TokenSessionReference 
	| typeof bindings.TokenSandBoxInert 
	| typeof bindings.TokenAuditPolicy 
	| typeof bindings.TokenOrigin 
	| typeof bindings.TokenElevationType 
	| typeof bindings.TokenLinkedToken 
	| typeof bindings.TokenElevation 
	| typeof bindings.TokenHasRestrictions 
	| typeof bindings.TokenAccessInformation 
	| typeof bindings.TokenVirtualizationAllowed 
	| typeof bindings.TokenVirtualizationEnabled 
	| typeof bindings.TokenIntegrityLevel 
	| typeof bindings.TokenUIAccess 
	| typeof bindings.TokenMandatoryPolicy 
	| typeof bindings.TokenLogonSid 
	| typeof bindings.TokenIsAppContainer 
	| typeof bindings.TokenCapabilities 
	| typeof bindings.TokenAppContainerSid 
	| typeof bindings.TokenAppContainerNumber 
	| typeof bindings.TokenUserClaimAttributes 
	| typeof bindings.TokenDeviceClaimAttributes 
	| typeof bindings.TokenRestrictedUserClaimAttributes 
	| typeof bindings.TokenRestrictedDeviceClaimAttributes 
	| typeof bindings.TokenDeviceGroups 
	| typeof bindings.TokenRestrictedDeviceGroups 
	| typeof bindings.TokenSecurityAttributes 
	| typeof bindings.TokenIsRestricted 
	| typeof bindings.TokenProcessTrustLevel 
	| typeof bindings.TokenPrivateNameSpace 
	| typeof bindings.TokenSingletonAttributes 
	| typeof bindings.TokenBnoIsolation 
	| typeof bindings.TokenChildProcessFlags 
	| typeof bindings.TokenIsLessPrivilegedAppContainer 
	| typeof bindings.TokenIsSandboxed 
	| typeof bindings.TokenIsAppSilo 
	| typeof bindings.TokenLoggingInformation 
	| typeof bindings.TokenLearningMode 
	| typeof bindings.MaxTokenInfoClass;

export type PrivilegeName = typeof bindings.SE_CREATE_TOKEN_NAME
	| typeof bindings.SE_ASSIGNPRIMARYTOKEN_NAME
	| typeof bindings.SE_LOCK_MEMORY_NAME
	| typeof bindings.SE_INCREASE_QUOTA_NAME
	| typeof bindings.SE_UNSOLICITED_INPUT_NAME
	| typeof bindings.SE_MACHINE_ACCOUNT_NAME
	| typeof bindings.SE_TCB_NAME
	| typeof bindings.SE_SECURITY_NAME
	| typeof bindings.SE_TAKE_OWNERSHIP_NAME
	| typeof bindings.SE_LOAD_DRIVER_NAME
	| typeof bindings.SE_SYSTEM_PROFILE_NAME
	| typeof bindings.SE_SYSTEMTIME_NAME
	| typeof bindings.SE_PROF_SINGLE_PROCESS_NAME
	| typeof bindings.SE_INC_BASE_PRIORITY_NAME
	| typeof bindings.SE_CREATE_PAGEFILE_NAME
	| typeof bindings.SE_CREATE_PERMANENT_NAME
	| typeof bindings.SE_BACKUP_NAME
	| typeof bindings.SE_RESTORE_NAME
	| typeof bindings.SE_SHUTDOWN_NAME
	| typeof bindings.SE_DEBUG_NAME
	| typeof bindings.SE_AUDIT_NAME
	| typeof bindings.SE_SYSTEM_ENVIRONMENT_NAME
	| typeof bindings.SE_CHANGE_NOTIFY_NAME
	| typeof bindings.SE_REMOTE_SHUTDOWN_NAME
	| typeof bindings.SE_UNDOCK_NAME
	| typeof bindings.SE_SYNC_AGENT_NAME
	| typeof bindings.SE_ENABLE_DELEGATION_NAME
	| typeof bindings.SE_MANAGE_VOLUME_NAME
	| typeof bindings.SE_IMPERSONATE_NAME
	| typeof bindings.SE_CREATE_GLOBAL_NAME
	| typeof bindings.SE_TRUSTED_CREDMAN_ACCESS_NAME
	| typeof bindings.SE_RELABEL_NAME
	| typeof bindings.SE_INC_WORKING_SET_NAME
	| typeof bindings.SE_TIME_ZONE_NAME
	| typeof bindings.SE_CREATE_SYMBOLIC_LINK_NAME
	| typeof bindings.SE_DELEGATE_SESSION_USER_IMPERSONATE_NAME

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function getTokenInformation(tokenHandle: TokenHandle, tokenInformationClass: TokenInformationClass): TokenPrivilegeInformation[] {
	if (tokenInformationClass !== bindings.TokenPrivileges)
		throw new Error(`Requested token information class is not implemented. Currently only TokenPrivileges is implemented`);

	// Execute dummy call to ask for size
	const pReturnLength = Buffer.alloc(koffi.sizeof(bindings.DWORD), 0);

	let ok = bindings.GetTokenInformation(tokenHandle, bindings.TokenPrivileges, null, 0, pReturnLength);
	// This call is expected to fail with error 122 (ERROR_INSUFFICIENT_BUFFER)
	if (!ok && getLastError() !== 122) 
		throwLastError();
	

	const tokenInformationLength = pReturnLength.readUInt32LE(0);
	const pTokenInformation = koffi.alloc('uint8', tokenInformationLength);

	ok = bindings.GetTokenInformation(tokenHandle, bindings.TokenPrivileges, pTokenInformation, tokenInformationLength, pReturnLength);
	if (!ok)
		throwLastError();

	const view = Buffer.from(koffi.view(pTokenInformation, tokenInformationLength));
	const count = view.readUInt32LE(0);
	if (12 * count + 4 !== tokenInformationLength)
		throw new Error(`Invalid TOKEN_PRIVILEGES size. Expected ${4 + count * 12} but got ${tokenInformationLength}`);

	const privileges = [];
	for (let i = 0; i < count; i++) {
		privileges.push({
			luid: view.readBigUInt64LE(12*i+4), // Don't care about signedness, we just want a 64 bit number 			
			attributes: view.readUInt32LE(12*i + 12),
		});
	}
	return privileges;
}

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegenamew
 */
export function lookupPrivilegeNameW(luid: LUID): PrivilegeName {
	// Rather than do a double call each and every time, try optimistically with a 32 char buffer and only
	// grow when necessary
	const initialSize = 32;
	let cchName = Buffer.alloc(4);
	cchName.writeUint32LE(initialSize);
	let lpName = Buffer.alloc(2 * (initialSize + 1), 0);
	const pLuid = Buffer.alloc(8);
	pLuid.writeBigUint64LE(luid);
	
	let ok = bindings.LookupPrivilegeNameW(null, pLuid, lpName, cchName);
	if (!ok && getLastError() !== 122)
		throwLastError();

	// From the Windows API docs for LookupPrivilegeNameW:
	// "When the function returns, this parameter contains the length of the privilege name, not including the terminating null character. 
	// If the buffer pointed to by the lpName parameter is too small, this variable contains the required size."
	// 
	// That means two things: 
	// 1. If the initial buffer was too small, cchName will now contain a uint32 with the required buffer size - i.e. INCLUDING THE NULL TERMINATOR 
	// 2. If the initial buffer was large enough, cchName will NOT contain the null terminator
	let size = cchName.readUint32LE();
	if (size > initialSize) {
		// Allocate larger string buffer as per required size
		lpName = Buffer.alloc(2 * size, 0);
		// Not sure why, but cchName seems to become invalidated after reading, so remake it
		// cchName = Buffer.alloc(4, size+1);
		ok = bindings.LookupPrivilegeNameW(null, pLuid, lpName, cchName);
		if (!ok)
			throwLastError();

		// Need to exclude the null terminator
		size--;
	}

	return lpName.toString('utf16le').slice(0, size) as PrivilegeName;
}

export { STANDARD_RIGHTS_REQUIRED, STANDARD_RIGHTS_READ, STANDARD_RIGHTS_WRITE, STANDARD_RIGHTS_EXECUTE } from './bindings.js';
export { TOKEN_ASSIGN_PRIMARY, TOKEN_DUPLICATE, TOKEN_IMPERSONATE, TOKEN_QUERY_SOURCE, TOKEN_ADJUST_PRIVILEGES, TOKEN_ADJUST_GROUPS, TOKEN_ADJUST_DEFAULT, TOKEN_ADJUST_SESSIONID, TOKEN_QUERY, TOKEN_READ, TOKEN_WRITE, TOKEN_EXECUTE } from './bindings.js';
export { SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED, SE_PRIVILEGE_REMOVED, SE_PRIVILEGE_USED_FOR_ACCESS } from './bindings.js';
export { TokenUser, TokenGroups, TokenPrivileges, TokenOwner, TokenPrimaryGroup, TokenDefaultDacl, TokenSource, TokenType, TokenImpersonationLevel, TokenStatistics, TokenRestrictedSids, TokenSessionId, TokenGroupsAndPrivileges, TokenSessionReference, TokenSandBoxInert, TokenAuditPolicy, TokenOrigin, TokenElevationType, TokenLinkedToken, TokenElevation, TokenHasRestrictions, TokenAccessInformation, TokenVirtualizationAllowed, TokenVirtualizationEnabled, TokenIntegrityLevel, TokenUIAccess, TokenMandatoryPolicy, TokenLogonSid, TokenIsAppContainer, TokenCapabilities, TokenAppContainerSid, TokenAppContainerNumber, TokenUserClaimAttributes, TokenDeviceClaimAttributes, TokenRestrictedUserClaimAttributes, TokenRestrictedDeviceClaimAttributes, TokenDeviceGroups, TokenRestrictedDeviceGroups, TokenSecurityAttributes, TokenIsRestricted, TokenProcessTrustLevel, TokenPrivateNameSpace, TokenSingletonAttributes, TokenBnoIsolation, TokenChildProcessFlags, TokenIsLessPrivilegedAppContainer, TokenIsSandboxed, TokenIsAppSilo, TokenLoggingInformation, TokenLearningMode, MaxTokenInfoClass } from './bindings.js';
export { SE_CREATE_TOKEN_NAME, SE_ASSIGNPRIMARYTOKEN_NAME, SE_LOCK_MEMORY_NAME, SE_INCREASE_QUOTA_NAME, SE_UNSOLICITED_INPUT_NAME, SE_MACHINE_ACCOUNT_NAME, SE_TCB_NAME, SE_SECURITY_NAME, SE_TAKE_OWNERSHIP_NAME, SE_LOAD_DRIVER_NAME, SE_SYSTEM_PROFILE_NAME, SE_SYSTEMTIME_NAME, SE_PROF_SINGLE_PROCESS_NAME, SE_INC_BASE_PRIORITY_NAME, SE_CREATE_PAGEFILE_NAME, SE_CREATE_PERMANENT_NAME, SE_BACKUP_NAME, SE_RESTORE_NAME, SE_SHUTDOWN_NAME, SE_DEBUG_NAME, SE_AUDIT_NAME, SE_SYSTEM_ENVIRONMENT_NAME, SE_CHANGE_NOTIFY_NAME, SE_REMOTE_SHUTDOWN_NAME, SE_UNDOCK_NAME, SE_SYNC_AGENT_NAME, SE_ENABLE_DELEGATION_NAME, SE_MANAGE_VOLUME_NAME, SE_IMPERSONATE_NAME, SE_CREATE_GLOBAL_NAME, SE_TRUSTED_CREDMAN_ACCESS_NAME, SE_RELABEL_NAME, SE_INC_WORKING_SET_NAME, SE_TIME_ZONE_NAME, SE_CREATE_SYMBOLIC_LINK_NAME, SE_DELEGATE_SESSION_USER_IMPERSONATE_NAME } from './bindings.js';