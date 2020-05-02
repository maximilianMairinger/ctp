import "xrray"


declare global {
  function log(...msg: any[]): void
  const ce: {
    <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) : HTMLElementTagNameMap[K];
    (name: string) : HTMLElement;
  };



  type Options = {destination: string, [key: string]: any}

  type GenericObject<T = any> = {[key: string]: T}


}



