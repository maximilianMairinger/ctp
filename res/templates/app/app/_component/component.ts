import "../global"
import lang from "./../lib/lang"
import { DataBase, Data } from "josm";
import { ElementList, ElementListOrElement, PrimElem, VariableLibrary } from "extended-dom";

type Token = string | string[]

export default abstract class Component<T extends HTMLElement | HTMLAnchorElement | false | never = HTMLElement> extends HTMLElement {
  protected sr: ShadowRoot;
  protected componentBody: T extends (HTMLElement | HTMLAnchorElement) ? T : T extends false ? ShadowRoot : HTMLElement


  constructor(bodyExtension?: T) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    
    if (bodyExtension !== false) {
      //@ts-ignore
      this.componentBody = bodyExtension === undefined ? ce("component-body") : bodyExtension


      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>")
      this.componentBody.html(this.pug(), lang)
      this.sr.append(this.componentBody as HTMLElement)
    }
    else {
      //@ts-ignore
      this.componentBody = this.sr
      this.sr.html("<!--General styles--><style>" + require('./component.css').toString() + "</style><!--Main styles--><style>" + this.stl() + "</style>").apd(this.pug(), lang)
    }
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    this[attrName](newVal)
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


  /**
   * Gets children matching given css-selector
   * @param selector css-selector filter childs similar to document.querySelector
   * @param alwaysReturnElementList when true, always return a ELementList instead of defaulting to a single instance when the query does only math once (defaults to false)
   */
  public q(selector: string, alwaysReturnElementList: true): ElementList<Element>
  /**
   * Gets children matching given css-selector
   * @param selector css-selector filter childs similar to document.querySelector
   * @param alwaysReturnElementList when true, always return a ELementList instead of defaulting to a single instance when the query does only math once (defaults to false)
   */
  public q(selector: string, alwaysReturnElementList?: boolean): ElementListOrElement
  public q(qs?: string, alwaysReturnElementList?: boolean) {
    return this.componentBody.childs(qs, alwaysReturnElementList)
  }
  public apd(...elems: PrimElem[]): this
  public apd(to: PrimElem | PrimElem[], library?: VariableLibrary, customTokens?: {open?: Token, close?: Token, escape?: Token}): this
  public apd(...a: any): this {
    this.componentBody.apd(...a)
    return this
  }

  protected parseJSONProp(prop: any) {
    if (typeof prop === "string") return JSON.parse(prop)
    else return prop
  }
}


/*
import Element from "../element"

export default class Example extends Element {

  constructor() {
    super()


  }

  stl() {
    return require("./example.css").toString()
  }
  pug() {
    return require("./example.pug").default
  }
}

window.customElements.define('c-example', Example);

*/
