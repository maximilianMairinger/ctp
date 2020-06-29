import interpolateHTMLWithLang from "../lib/interpolateHTMLWithLang";
import lang from "./../lib/lang"
import { DataBase, Data } from "josm";

type PrimElem = string | number | boolean | Element
type Token = string | string[]


export default abstract class Component extends HTMLElement {
  protected sr: ShadowRoot;
  protected componentBody: HTMLElement

  constructor(componentBodyExtention?: HTMLElement | false) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    
    if (componentBodyExtention !== false) {
      //@ts-ignore
      let realElementBody = this.elementBody = ce("component-body")
      if (componentBodyExtention !== undefined) {
        //@ts-ignore
        this.elementBody = componentBodyExtention
        //@ts-ignore
        realElementBody.apd(componentBodyExtention)
      }


      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>")
      this.sr.append(realElementBody)
      this.componentBody.html(this.pug(), lang)
    }
    else {
      //@ts-ignore
      this.elementBody = this.sr
      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>").apd(this.pug(), lang)
    }

  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    this[attrName](newVal)
  }

  public q(qs?: string) {
    return this.componentBody.childs(qs)
  }


  public apd(...elems: PrimElem[]): this
  public apd(to: PrimElem | PrimElem[], library?: {[key in string]: string | Data<string>;} | DataBase, customTokens?: {open?: Token; close?: Token; escape?: Token;}): this
  public apd(...a: any): this {
    this.componentBody.apd(...a)
    return this
  }


  public abstract stl(): string;
  public abstract pug(): string;
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
