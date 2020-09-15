import lang from "./../lib/lang"
import { DataBase, Data } from "josm";

type PrimElem = string | number | boolean | Element
type Token = string | string[]

const compCss = require('./component.css')


export default abstract class Component extends HTMLElement {
  protected sr: ShadowRoot;
  protected componentBody: HTMLElement

  constructor(componentBodyExtention?: HTMLElement | false) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    let thisStl = this.stl()
    let thisPug = this.pug() as any
    if (typeof thisPug === "object") {
      if (typeof thisPug.default === "string") thisPug = thisPug.default
      else thisPug = thisPug.toString()
    }

    
    if (componentBodyExtention !== false) {
      if (componentBodyExtention !== undefined) {
        //@ts-ignore
        this.componentBody = componentBodyExtention
      }
      else this.componentBody = ce("component-body")


      this.sr.html("<!--General styles--><style>" + compCss + "</style><!--Main styles--><style>" + thisStl + "</style>")
      this.sr.append(this.componentBody)
      this.componentBody.html(thisPug, lang)
    }
    else {
      //@ts-ignore
      this.componentBody = this.sr
      this.sr.html("<!--General styles--><style>" + compCss + "</style><!--Main styles--><style>" + thisStl + "</style>").apd(thisPug, lang)
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


  public stl?(): string;
  public pug?(): string | object;
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
