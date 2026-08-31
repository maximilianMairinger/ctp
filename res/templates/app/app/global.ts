import polyfill from "extended-dom"
import "xrray"


export default async function() {
  await polyfill()

  // import "temporal-polyfill"
  if (!("Temporal" in global)) {
    await import("temporal-polyfill")
  }

  //@ts-ignore
  global.log = console.log
  //@ts-ignore
  global.ce = document.createElement.bind(document)
}

type Temporal = typeof import("temporal-polyfill").Temporal

declare global {
  
  const Temporal: Temporal
  function log(...msg: any[]): void
  
  function ce<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) : HTMLElementTagNameMap[K];
  function ce(name: string) : HTMLElement;
}



