# win32-privileges

A lightweight Node.js library for inspecting **Windows privileges for the current process** using native Windows APIs.

---

## Motivation

The privilege model for Windows differs quite a bit from that of Unix: Where in Unix there is a root user for elevation, the Windows security API relies on certain [privileges](https://learn.microsoft.com/en-us/windows/win32/SecGloss/p-gly) afforded to users:

> **privilege** 
> 
> The right of a user to perform various system-related operations, such as shutting down the system, loading device drivers, or changing the system time. A user's access token contains a list of the privileges held by either the user or the user's groups.

While Node offers a way to determine if running with elevated privileges in Unix, there is no way on Windows to check whether a process is elevated, much less what specific privileges it has. This library closes that gap.

---

## Installation

```
npm install win32-privileges
```

For obvious reasons, this library **only works on Windows**. Package managers will refuse installation on other platforms, and calling it will throw an error. 

If you are developing a cross-platform project, you should define it as an [optional dependency](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#optionaldependencies): 
```
npm install --save-optional win32-privileges
```

---

## Usage

```ts
import getPrivileges from 'win32-privileges';

const privileges = getPrivileges();

for (const privilege of privileges) {
  console.log(privilege.name, privilege.isEnabled());
}
```

---

## API

### `getPrivileges(): Privilege[]`

Returns a list of privileges associated with the current process.

### `Privilege` Class

Represents a single Windows privilege.

```ts
class Privilege {
  name: string;
  status: number;

  isEnabled(): boolean;
  isEnabledByDefault(): boolean;
  wasUsedForAccess(): boolean;
}
```

#### Methods

##### `isEnabled()`

Returns `true` if the privilege is currently enabled.

##### `isEnabledByDefault()`

Returns `true` if the privilege is enabled by default in the token.

##### `wasUsedForAccess()`

Returns `true` if the privilege was used during an access check.

---

## 🧠 How It Works

This library directly interfaces with the Windows API using a bridging mechanism called [Foreign Function Interfaces (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface). Specifically, it uses [`koffi`](koffi.dev), which comes pre-built for many platforms including Windows, so as to avoid a build step on install.