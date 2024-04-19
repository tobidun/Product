export function unauthorizedUser(message: string) {
  throw { status: 401, message };
}
