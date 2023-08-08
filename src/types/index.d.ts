declare global {
  interface Window {
    AraleQRCode: any;
  }
  const chrome: any;
}

export type AnyFunc = (...args: unknown[]) => any;

export type AnyObj = {
  [key: string]: unknown;
};
