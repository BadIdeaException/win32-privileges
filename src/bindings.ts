/**
 * This file contains low-level bindings and type aliases for the Windows API.
 */
import koffi from 'koffi';

const kernel32 = koffi.load('Kernel32.dll');
const advapi32 = koffi.load('Advapi32.dll');

export const HANDLE = koffi.alias('HANDLE', 'uint64_t');
export const DWORD = koffi.alias('DWORD', 'uint32_t');
export const LONG = koffi.alias('LONG', 'int32_t');
export const BOOL = koffi.alias('BOOL', 'int32_t');

export const FORMAT_MESSAGE_FROM_SYSTEM = 0x00001000;
export const FORMAT_MESSAGE_IGNORE_INSERTS = 0x00000200;

export const GetLastError = kernel32.func('uint32 GetLastError()');
export const FormatMessageW = kernel32.func('uint32 FormatMessageW(uint32, void*, uint32, uint32, void*, uint32, void*)');
export const GetCurrentProcess = kernel32.func('HANDLE GetCurrentProcess()');
export const CloseHandle = kernel32.func('BOOL CloseHandle(HANDLE)');

export const STANDARD_RIGHTS_REQUIRED = 0x000F0000;
export const STANDARD_RIGHTS_READ = 0x00020000; // READ_CONTROL
export const STANDARD_RIGHTS_WRITE = 0x00020000;
export const STANDARD_RIGHTS_EXECUTE = 0x00020000;

export const TOKEN_ASSIGN_PRIMARY = 0x0001;
export const TOKEN_DUPLICATE = 0x0002;
export const TOKEN_IMPERSONATE = 0x0004;
export const TOKEN_QUERY_SOURCE = 0x0010;
export const TOKEN_ADJUST_PRIVILEGES = 0x0020;
export const TOKEN_ADJUST_GROUPS = 0x0040;
export const TOKEN_ADJUST_DEFAULT = 0x0080;
export const TOKEN_ADJUST_SESSIONID = 0x0100;
export const TOKEN_QUERY = 0x0008;
export const TOKEN_READ = STANDARD_RIGHTS_READ | TOKEN_QUERY;
export const TOKEN_WRITE = STANDARD_RIGHTS_WRITE | TOKEN_ADJUST_PRIVILEGES | TOKEN_ADJUST_GROUPS | TOKEN_ADJUST_DEFAULT;
export const TOKEN_EXECUTE = STANDARD_RIGHTS_EXECUTE | TOKEN_IMPERSONATE;

export const SE_PRIVILEGE_ENABLED_BY_DEFAULT = 0x00000001;
export const SE_PRIVILEGE_ENABLED = 0x00000002;
export const SE_PRIVILEGE_REMOVED = 0x00000004;
export const SE_PRIVILEGE_USED_FOR_ACCESS = 0x80000000;

export const TokenUser = 1;
export const TokenGroups = 2;
export const TokenPrivileges = 3;
export const TokenOwner = 4;
export const TokenPrimaryGroup = 5;
export const TokenDefaultDacl = 6;
export const TokenSource = 7;
export const TokenType = 8;
export const TokenImpersonationLevel = 9;
export const TokenStatistics = 10;
export const TokenRestrictedSids = 11;
export const TokenSessionId = 12;
export const TokenGroupsAndPrivileges = 13;
export const TokenSessionReference = 14;
export const TokenSandBoxInert = 15;
export const TokenAuditPolicy = 16;
export const TokenOrigin = 17;
export const TokenElevationType = 18;
export const TokenLinkedToken = 19;
export const TokenElevation = 20;
export const TokenHasRestrictions = 21;
export const TokenAccessInformation = 22;
export const TokenVirtualizationAllowed = 23;
export const TokenVirtualizationEnabled = 24;
export const TokenIntegrityLevel = 25;
export const TokenUIAccess = 26;
export const TokenMandatoryPolicy = 27;
export const TokenLogonSid = 28;
export const TokenIsAppContainer = 29;
export const TokenCapabilities = 30;
export const TokenAppContainerSid = 31;
export const TokenAppContainerNumber = 32;
export const TokenUserClaimAttributes = 33;
export const TokenDeviceClaimAttributes = 34;
export const TokenRestrictedUserClaimAttributes = 35;
export const TokenRestrictedDeviceClaimAttributes = 36;
export const TokenDeviceGroups = 37;
export const TokenRestrictedDeviceGroups = 38;
export const TokenSecurityAttributes = 39;
export const TokenIsRestricted = 40;
export const TokenProcessTrustLevel = 41;
export const TokenPrivateNameSpace = 42;
export const TokenSingletonAttributes = 43;
export const TokenBnoIsolation = 44;
export const TokenChildProcessFlags = 45;
export const TokenIsLessPrivilegedAppContainer = 46;
export const TokenIsSandboxed = 47;
export const TokenIsAppSilo = 48;
export const TokenLoggingInformation = 49;
export const TokenLearningMode = 50;
export const MaxTokenInfoClass = 51;

export const OpenProcessToken = advapi32.func('BOOL OpenProcessToken(HANDLE, DWORD, _Out_ HANDLE*)');
export const GetTokenInformation = advapi32.func('BOOL GetTokenInformation(HANDLE, uint32, _Out_ void*, DWORD, _Out_ DWORD*)');
export const LookupPrivilegeNameW = advapi32.func('BOOL LookupPrivilegeNameW(void*, void*, _Out_ void*, _Inout_ DWORD*)');

export const SE_CREATE_TOKEN_NAME = "SeCreateTokenPrivilege" as const;
export const SE_ASSIGNPRIMARYTOKEN_NAME = "SeAssignPrimaryTokenPrivilege" as const;
export const SE_LOCK_MEMORY_NAME = "SeLockMemoryPrivilege" as const;
export const SE_INCREASE_QUOTA_NAME = "SeIncreaseQuotaPrivilege" as const;
export const SE_UNSOLICITED_INPUT_NAME = "SeUnsolicitedInputPrivilege" as const;
export const SE_MACHINE_ACCOUNT_NAME = "SeMachineAccountPrivilege" as const;
export const SE_TCB_NAME = "SeTcbPrivilege" as const;
export const SE_SECURITY_NAME = "SeSecurityPrivilege" as const;
export const SE_TAKE_OWNERSHIP_NAME = "SeTakeOwnershipPrivilege" as const;
export const SE_LOAD_DRIVER_NAME = "SeLoadDriverPrivilege" as const;
export const SE_SYSTEM_PROFILE_NAME = "SeSystemProfilePrivilege" as const;
export const SE_SYSTEMTIME_NAME = "SeSystemtimePrivilege" as const;
export const SE_PROF_SINGLE_PROCESS_NAME = "SeProfileSingleProcessPrivilege" as const;
export const SE_INC_BASE_PRIORITY_NAME = "SeIncreaseBasePriorityPrivilege" as const;
export const SE_CREATE_PAGEFILE_NAME = "SeCreatePagefilePrivilege" as const;
export const SE_CREATE_PERMANENT_NAME = "SeCreatePermanentPrivilege" as const;
export const SE_BACKUP_NAME = "SeBackupPrivilege" as const;
export const SE_RESTORE_NAME = "SeRestorePrivilege" as const;
export const SE_SHUTDOWN_NAME = "SeShutdownPrivilege" as const;
export const SE_DEBUG_NAME = "SeDebugPrivilege" as const;
export const SE_AUDIT_NAME = "SeAuditPrivilege" as const;
export const SE_SYSTEM_ENVIRONMENT_NAME = "SeSystemEnvironmentPrivilege" as const;
export const SE_CHANGE_NOTIFY_NAME = "SeChangeNotifyPrivilege" as const;
export const SE_REMOTE_SHUTDOWN_NAME = "SeRemoteShutdownPrivilege" as const;
export const SE_UNDOCK_NAME = "SeUndockPrivilege" as const;
export const SE_SYNC_AGENT_NAME = "SeSyncAgentPrivilege" as const;
export const SE_ENABLE_DELEGATION_NAME = "SeEnableDelegationPrivilege" as const;
export const SE_MANAGE_VOLUME_NAME = "SeManageVolumePrivilege" as const;
export const SE_IMPERSONATE_NAME = "SeImpersonatePrivilege" as const;
export const SE_CREATE_GLOBAL_NAME = "SeCreateGlobalPrivilege" as const;
export const SE_TRUSTED_CREDMAN_ACCESS_NAME = "SeTrustedCredManAccessPrivilege" as const;
export const SE_RELABEL_NAME = "SeRelabelPrivilege" as const;
export const SE_INC_WORKING_SET_NAME = "SeIncreaseWorkingSetPrivilege" as const;
export const SE_TIME_ZONE_NAME = "SeTimeZonePrivilege" as const;
export const SE_CREATE_SYMBOLIC_LINK_NAME = "SeCreateSymbolicLinkPrivilege" as const;
export const SE_DELEGATE_SESSION_USER_IMPERSONATE_NAME = "SeDelegateSessionUserImpersonatePrivilege" as const;