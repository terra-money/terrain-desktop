import TerrariumStore from "../public/store";

export {};
declare global {
  export interface Window {
    store: TerrariumStore
  }
}