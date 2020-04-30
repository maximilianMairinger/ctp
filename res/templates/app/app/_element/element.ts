import interpolateHTMLWithLang from "../lib/interpolateHTMLWithLang";

export default abstract class Component extends HTMLElement {
  protected sr: ShadowRoot;
  protected elementBody: HTMLElement

  private mostInnerComponentbody: HTMLElement | ShadowRoot
  constructor(private elementBodyExtention?: HTMLElement | false) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    
    
    

    this.rerender()

    
  }

  protected rerender() {
    this.sr.html("")
    if (this.elementBodyExtention !== false) {
      this.elementBody = ce("element-body")
      if (this.elementBodyExtention === undefined) {
        this.mostInnerComponentbody = this.elementBody  
      }
      else {
        this.mostInnerComponentbody = this.elementBodyExtention
        this.elementBody.apd(this.mostInnerComponentbody)
      }

      this.sr.html("<!--General styles--><style>" + require('./element.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>")
      this.sr.append(this.elementBody)
      this.mostInnerComponentbody.innerHTML = interpolateHTMLWithLang(this.pug())
    }
    else {
      this.mostInnerComponentbody = this.sr
      this.sr.html("<!--General styles--><style>" + require('./element.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>" + interpolateHTMLWithLang(this.pug()))
    }
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    this[attrName] = newVal
  }

  public abstract stl(): string;
  public abstract pug(): string;
  /**
   * Appends to ShadowRoot
   */
  public sra(...elems: HTMLElement[]): void {
    elems.ea((e) => {
      this.sr.append(e);
    });
  }

  public q(qs?: string) {
    return this.mostInnerComponentbody.childs(qs)
  }
  public apd(...elems: Element[]) {
    this.mostInnerComponentbody.append(...elems)
    return this
  }
}


/*
import Element from "./../element";

export default class Example extends Element {
  constructor() {
    super()

  }
  stl() {
    return require("./example.css").toString()
  }
  pug() {
    return require("./example.pug").toString()
  }
}

window.customElements.define('c-example', Example);

*/
