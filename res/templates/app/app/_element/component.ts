import interpolateHTMLWithLang from "../lib/interpolateHTMLWithLang";

export default abstract class Component extends HTMLElement {
  protected sr: ShadowRoot;
  protected componentBody: HTMLElement

  private mostInnerComponentbody: HTMLElement | ShadowRoot
  constructor(private componentBodyExtention?: HTMLElement | false) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    
    
    

    this.rerender()

    
  }

  protected rerender() {
    this.sr.html("")
    if (this.componentBodyExtention !== false) {
      this.componentBody = ce("component-body")
      if (this.componentBodyExtention === undefined) {
        this.mostInnerComponentbody = this.componentBody  
      }
      else {
        this.mostInnerComponentbody = this.componentBodyExtention
        this.componentBody.apd(this.mostInnerComponentbody)
      }

      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>")
      this.sr.append(this.componentBody)
      this.mostInnerComponentbody.innerHTML = interpolateHTMLWithLang(this.pug())
    }
    else {
      this.mostInnerComponentbody = this.sr
      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>" + interpolateHTMLWithLang(this.pug()))
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
import Component from "./../component";

export default class Example extends Component {
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
