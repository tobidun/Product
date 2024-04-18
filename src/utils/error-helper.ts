export function noPrivilegedHandler(message: string) {
  throw { status: 403, message };
}

export function unauthorizedUser(message: string) {
  throw { status: 401, message };
}
