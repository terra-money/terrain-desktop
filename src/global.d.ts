import TerrariumStore from '../public/utils/store';

export {};
declare global {
  export interface Window {
    store: TerrariumStore
  }
}
