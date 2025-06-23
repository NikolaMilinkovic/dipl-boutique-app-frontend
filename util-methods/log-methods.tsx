export function betterConsoleLog(message: string, log: any) {
  console.log(message, JSON.stringify(log, null, 2));
}
export function betterErrorLog(message: string, log: any) {
  console.error(message, JSON.stringify(log, null, 2));
  console.error(log);
}
