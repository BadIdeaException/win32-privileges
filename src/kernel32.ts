/**
 * Javascript wrappers for some kernel32 functions.
 */
import koffi from 'koffi';
import * as bindings from './bindings.js';
import WindowsError from './error.js';

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export function getLastError(): number {
	return bindings.GetLastError();
}

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-formatmessagew
 */
export function formatMessageW(code: number): string {
	const buffer = Buffer.alloc(1024);

	const len = bindings.FormatMessageW(
		bindings.FORMAT_MESSAGE_FROM_SYSTEM | bindings.FORMAT_MESSAGE_IGNORE_INSERTS, // [in] DWORD dwFlags
		null, // [in, optional] LPCVOID lpSource
		code, // [in] DWORD dwMessageId
		0, // [in] DWORD dwLanguageId
		buffer, // [out] LPWSTR lpBuffer
		buffer.length / 2, // [in] DWORD nSize
		null, // [in, optional] va_list *Arguments
	);

	// If FormatMessageW fails, len is 0.
	// Otherwise it contains the number of characters written to buffer
	if (len === 0) {
		throw new Error(`Unknown error ${code}`);
	}

	return buffer
		.slice(0, len * 2)
		.toString('utf16le')
		.trim();
}

export type Handle = typeof bindings.HANDLE;
export type ProcessHandle = Handle & { __kind: 'ProcessHandle' };

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocess
 */
export function getCurrentProcess(): ProcessHandle {
	return bindings.GetCurrentProcess();
}

/**
 * See https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 */
export function closeHandle(handle: Handle): void {
	const ok = bindings.CloseHandle(handle);
	if (!ok)
		throw WindowsError.from(getLastError());
}