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
import { getPrivileges } from 'win32-privileges';

const privileges = getPrivileges();

for (const privilege of privileges) {
  console.log(privilege.name, privilege.isEnabled());
}
```

---

## API

### `getPrivileges(): Privilege[]`

Retrieves all privileges associated with the current process token, 
regardless of whether they are enabled or not. A privilege that is present
but disabled is potentially available to this process, i.e. within the scope
of permitted operations for the user owning the process. Only enabled privileges,
however, actually entitle the process to carry out the associated operations.

For example, a process may have the `SE_SHUTDOWN_PRIVILEGE` privilege present. This means
that it can potentially shut down the system, but it cannot do so currently (because the
privilege is disabled).
To actually shut down the system, the process requires an enabled `SE_SHUTDOWN_PRIVILEGE`. 
If the privilege is not present at all, the process can never shut down the system.

Use [`getEnabledPrivileges`](#getenabledprivileges-privilege) if you want to get a list of enabled privileges.

*Returns* {[`Privilege[]`](#class-privilege)} An array of `Privilege` objects representing
all privileges assigned to the current process.

*Throws* `Error` If called on platform other than Windows.

### `hasPrivilege(privilege: string): boolean`

Checks whether the current process has a specific privilege assigned,
regardless of whether the privilege is enabled or not.

See [`getPrivileges`](#getprivileges-privilege) for details on present vs enabled privileges.
 
Use [`hasEnabledPrivilege`]() instead if you want to check for enabled privileges.

*Parameters*

* `string` privilege - The name of the privilege to check.
 
*Returns*  `boolean` `true` if the privilege exists in the process token; otherwise `false`.

*Throws* `Error` If called on platform other than Windows.
 
### `getEnabledPrivileges(): Privilege[]`

Retrieves all enabled privileges associated with the current process token.
These privileges are active, i.e. entitle the process to carry out the associated
operations.

See [`getPrivileges`](#getprivileges-privilege) for details on present vs enabled privileges.

*Returns* `Privilege[]` An array of enabled `Privilege` objects. 

*Throws* `Error` If called on platform other than Windows.

### `hasEnabledPrivilege(privilege: string): boolean`

Checks whether a specific privilege is present and enabled for the current process.

See [`getPrivileges`](#getprivileges-privilege) for details on present vs enabled privileges.
 
*Parameters*

* `string` privilege - The name of the privilege to check.
 
*Returns*  `boolean` `true` if the privilege exists in the process token and is enabled; otherwise `false`.

*Throws* `Error` If called on platform other than Windows.

### Class `Privilege` 

Represents a single privilege. 

A privilege is the right of a user to perform various system-related operations, such as shutting down the system, loading device drivers, or changing the system time. 
A user's access token contains a list of the privileges held by either the user or the user's groups. These privileges are inherited by processes owned by the user.

A `Privilege` consists of the privilege's name, and its activation status.

This class exposes all [privilege names](https://learn.microsoft.com/en-us/windows/win32/secauthz/privilege-constants) as static properties, while dropping the `_NAME` suffix (so e.g. `Privilege.SE_CREATE_TOKEN`).

#### Properties

* `string` name The name of this privilege. This is the value of one of the privilege name constants.

#### Methods

###### `isEnabled(): boolean`

Whether this privilege is currently enabled.

Only enabled privileges entitle the process to carry out the associated operations.

*Returns* `boolean` `true` is this privilege is enabled, `false` otherwise.

##### `isEnabledByDefault(): boolean`

Whether this privilege is enabled by default when the token is created.

A privilege that is enabled by default may still be disabled later.

*Returns* `boolean` `true` if this privilege is enabled by default, `false` otherwise.

##### `wasUsedforAccess(): boolean`

Whether this privilege has actually been used. 
(Specifically, whether it has contributed to at least one successful access check.)

*Returns*  `boolean` `true` if this privilege has been used by the process, `false` otherwise.

---

## How It Works

This library directly interfaces with the Windows API using a bridging mechanism called [Foreign Function Interfaces (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface). Specifically, it uses [`koffi`](koffi.dev), which comes pre-built for many platforms including Windows, so as to avoid a build step on install.