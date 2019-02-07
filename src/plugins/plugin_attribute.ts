export function odata(token: string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      odata = token;
    }
  }
}