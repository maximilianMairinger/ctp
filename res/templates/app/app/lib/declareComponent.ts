import Component from "../_component/component";

/**
 * Declare new Component and append it to the customElementRegitry
 * @param name Name of the component, how it should be refelected in the dom (when not starting with "c-", "c-" will be prefixed) 
 * @param component The component class; observedAttributes will be injected automatically
 */
export function declareComponent<Comp>(name: string, component: Comp){
  //@ts-ignore
  if (!component.observedAttributes) {
    //Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(component).prototype))
    let attrbs = []
    let cur = component
    //@ts-ignore
    while (cur.prototype instanceof Component) {
      //@ts-ignore
      attrbs.add(...Object.getOwnPropertyNames(cur.prototype))
      cur = Object.getPrototypeOf(cur)
    }


    //@ts-ignore
    
    component.observedAttributes = attrbs.rmV("constructor", "stl", "pug")
  }

  if (!name.startsWith("c-")) name = "c-" + name
  //@ts-ignore
  window.customElements.define(name, component)

  return component as Comp
}

export default declareComponent
