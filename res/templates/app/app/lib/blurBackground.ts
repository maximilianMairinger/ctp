import keyIndex from "key-index"
import { latestLatent } from "more-proms"
import { oneOfTheseOnce } from "./onOfTheseEvents"
import getScrollParent from "./scrollParent"


const zIndex = 50
const initZIndexStore = keyIndex((el: Element) => {
  const inlineZ = (el as HTMLElement).style?.zIndex
  return inlineZ === "" || inlineZ == null ? undefined : inlineZ
}, WeakMap)
function mkBlurElem(zIndex: number) {
  const blurElem = ce("blur-elem")
  blurElem.css({
    position: "absolute",
    display: "block",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex,
    opacity: 0,
    pointerEvents: "all",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)"
  })
  blurElem.style.setProperty("z-index", `${zIndex}`, "important")
  return blurElem
}




const activeBlurs = new Set()

const _blurEverythingInBackground = latestLatent(function blurEverythingInBackground<T>(except?: Element, end: Promise<T> = new Promise(() => {}), zIndex: number = 50, zIndexExcept: number = zIndex + 1, closeAfterEventCount = 2, includeResizeEvent = true) {
  return new Promise<{doneWithAnim: Promise<void>, except: Element | undefined, blurElem: Element, e: Event | T | void}>((res) => {
    if (except) {
      const exceptEl = except as HTMLElement
      initZIndexStore(except)
      exceptEl.style.setProperty("z-index", `${zIndexExcept}`, "important")
    }
    
    const parent = except ? getScrollParent(except) : document.body
    const blurElem = mkBlurElem(zIndex)
    parent.apd(blurElem)
    blurElem.anim({opacity: 1})



    // default is 2 because one resize event may fire on popup open in some flows.
    // callers can override this for deterministic programmatic close paths.
    const closeTriggers = [
      end as Promise<unknown>, 
      blurElem.on("mousedown"), 
      parent.on("scroll", undefined, { velocity: true }), // Vel here is needed for popup to determine in which direction to fade on close
      new Promise<void>((res) => {
        const ls = document.body.on("keydown", ({key}) => {
          if (key === "Escape") {
            res()
            ls.deactivate()
          } 
        })
      })
    ] as any[]

    if (includeResizeEvent) {
      closeTriggers.push(document.body.on("resize"))
    }

    oneOfTheseOnce(closeTriggers, closeAfterEventCount).then((e: Event | T | void) => {
      if (e instanceof Event) {
        e.stopPropagation()
        e.preventDefault()
      }

      // Never keep intercepting clicks while fading out.
      ;(blurElem as HTMLElement).style.pointerEvents = "none"
      
      const doneWithAnim = Promise.resolve(blurElem.anim({opacity: 0}) as any)
        .catch(() => undefined)
        .then(() => undefined)
      res({doneWithAnim, except, blurElem, e})
    }) 
  })
})

export function blurEverythingInBackground<T>(except?: Element, end?: Promise<T>, zIndex?: number, zIndexExcept?: number, closeAfterEventCount?: number, includeResizeEvent?: boolean): {canOpen: false} | {canOpen: true, done: Promise<Event | T>} {
  let myActiveBlursKey = except ? except : undefined
  if (activeBlurs.has(myActiveBlursKey)) return {canOpen: false}
  activeBlurs.add(myActiveBlursKey)
  return {canOpen: true, done: (async () => {
    const {doneWithAnim, e, blurElem} = await _blurEverythingInBackground(except, end, zIndex, zIndexExcept, closeAfterEventCount, includeResizeEvent)
    doneWithAnim.finally(() => {
      if (except) {
        const exceptEl = except as HTMLElement
        const oldZ = initZIndexStore(except)
        if (oldZ == null) exceptEl.style.removeProperty("z-index")
        else exceptEl.style.setProperty("z-index", oldZ)
      }

      blurElem.remove()
      activeBlurs.delete(myActiveBlursKey)
    })
    return e as any
  })()}
  
}

export default blurEverythingInBackground