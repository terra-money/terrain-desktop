import store from 'electron-store';

export {};
declare global {
  export interface Window {
    store: store
  }
}