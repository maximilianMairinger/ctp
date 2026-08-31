import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import blurEverythingInBackground from "../../lib/blurBackground"
import getScrollParent from "../../lib/scrollParent"
import RippleButton from "../_themeAble/_focusAble/_formUi/_rippleButton/rippleButton"
import ChevronIcon from "../_icon/chevronIcon/chevronIcon"
import { latestLatent } from "more-proms"

const maxWidthPaddingDesktop = 56
const maxHeightPaddingDesktop = 36
const maxWidthPaddingMobile = 18
const maxHeightPaddingMobile = 18
const focusZIndex = 112

type RectLike = { top: number, left: number, width: number, height: number }

export default class EnlargeAble extends Component<false> {
  private isOpen = false
  private isAnimating = false
  private pendingClose = false
  private isInternalMove = false
  private placeholder?: HTMLElement
  private openRect?: RectLike
  private frameHandle?: number
  private openScrollParent?: HTMLElement
  private backdropDonePromise?: Promise<any>
  private resolveBackdropClose?: () => void
  private keyboardListener?: (ev: KeyboardEvent) => void
  private galleryPeers: EnlargeAble[] = []
  private galleryIndex = -1
  private prevBtn?: HTMLElement
  private nextBtn?: HTMLElement
  private pendingGallerySwitchDir?: -1 | 1
  private pendingSwitchOutDir?: -1 | 1

  private queueTargetOpen = latestLatent(async (target: EnlargeAble, waitForClose: boolean) => {
    if (waitForClose) {
      await this.waitUntilClosed()
    }
    else {
      await new Promise<void>((res) => setTimeout(res, 32))
    }

    target.tryOpen()
  })

  private runSwitchInAnim = latestLatent(async (dir: -1 | 1) => {
    const targetRect = this.getTargetRect()
    if (!targetRect) {
      await this.animateExponentialTo(() => this.getTargetRect(), true)
      return
    }

    const offsetPx = dir * 26
    this.applyRect(targetRect)
    this.style.opacity = "0"
    this.style.transform = `translateX(${offsetPx}px) scale(0.985) translateZ(0)`
    await this.anim([
      { opacity: 0, transform: `translateX(${offsetPx}px) scale(0.985) translateZ(0)` },
      { opacity: 1, transform: "translateX(0px) scale(1) translateZ(0)" }
    ], 260)
  })

  private runSwitchOutAnim = latestLatent(async (dir: -1 | 1) => {
    const placeholder = this.placeholder as any
    if (placeholder) {
      placeholder.css({
        opacity: 0,
        background: "rgba(255, 255, 255, 0.16)",
        borderRadius: this.style.borderRadius || "inherit"
      })
      placeholder.anim([
        { opacity: 0, transform: "scale(0.985)" },
        { opacity: 0.22, transform: "scale(1)" },
        { opacity: 0, transform: "scale(1.01)" }
      ], 200)
    }

    const outOffset = -dir * 20
    this.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)"
    await this.anim([
      { opacity: 1, transform: "translateX(0px) scale(1) translateZ(0)" },
      { opacity: 0, transform: `translateX(${outOffset}px) scale(0.99) translateZ(0)` }
    ], 220)
  })

  private hasVisibleRadius(radius: string) {
    return radius.split(" ").some((part) => parseFloat(part) > 0)
  }

  private applyOpenVisualStyles() {
    const firstChild = this.firstElementChild as HTMLElement | null
    const ownRadius = window.getComputedStyle(this).borderRadius
    const parentRadius = this.parentElement ? window.getComputedStyle(this.parentElement as HTMLElement).borderRadius : "0px"
    const childRadius = firstChild ? window.getComputedStyle(firstChild).borderRadius : "0px"

    const finalRadius = this.hasVisibleRadius(ownRadius)
      ? ownRadius
      : this.hasVisibleRadius(parentRadius)
        ? parentRadius
        : childRadius

    this.style.borderRadius = finalRadius
    this.style.overflow = "hidden"
  }

  constructor(el?: HTMLElement) {
    super(false)

    this.on("click", () => {
      this.tryOpen()
    })

    this.on("wheel", (ev: WheelEvent) => {
      if (!this.isOpen || !this.openScrollParent) return

      this.openScrollParent.scrollTop += ev.deltaY
      this.openScrollParent.scrollLeft += ev.deltaX
      ev.preventDefault()
    }, { passive: false })

    if (el !== undefined) {
      this.append(el)
    }
  }

  connectedCallback() {
    this.ensureNavControls()
  }

  private ensureNavControls() {
    if (this.prevBtn && this.nextBtn) return

    const prevBtn = new RippleButton() as any as HTMLElement
    prevBtn.className = "gallery-nav gallery-nav-prev"
    prevBtn.setAttribute("aria-label", "Previous image")
    const prevChevronContainer = document.createElement("chevron-container")
    prevChevronContainer.appendChild(new ChevronIcon())
    prevBtn.appendChild(prevChevronContainer)

    const nextBtn = new RippleButton() as any as HTMLElement
    nextBtn.className = "gallery-nav gallery-nav-next"
    nextBtn.setAttribute("aria-label", "Next image")
    const nextChevronContainer = document.createElement("chevron-container")
    nextChevronContainer.appendChild(new ChevronIcon())
    nextBtn.appendChild(nextChevronContainer)

    prevBtn.addEventListener("click", (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      console.log("[enlargeAble] prev button trigger")
      this.navigateGallery(-1)
    })

    nextBtn.addEventListener("click", (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      console.log("[enlargeAble] next button trigger")
      this.navigateGallery(1)
    })

    this.prevBtn = prevBtn
    this.nextBtn = nextBtn
    this.sr.append(prevBtn, nextBtn)
  }

  private resetGalleryClasses() {
    this.removeClass("in-gallery")
    this.removeClass("has-prev")
    this.removeClass("has-next")
  }

  private refreshGalleryContext() {
    const container = this.placeholder?.parentElement?.closest(".kg-gallery-container") as HTMLElement | null
    console.log("[enlargeAble] refreshGalleryContext", {
      hasPlaceholder: !!this.placeholder,
      placeholderParentTag: this.placeholder?.parentElement?.tagName,
      foundGalleryContainer: !!container
    })
    if (!container) {
      this.galleryPeers = []
      this.galleryIndex = -1
      this.resetGalleryClasses()
      console.log("[enlargeAble] not in gallery")
      return
    }

    this.galleryPeers = this.getGalleryOrder(container)
    this.galleryIndex = this.galleryPeers.indexOf(this)

    const hasGallery = this.galleryPeers.length > 1 && this.galleryIndex !== -1
    if (!hasGallery) {
      this.resetGalleryClasses()
      console.log("[enlargeAble] gallery found but unusable", {
        galleryLength: this.galleryPeers.length,
        galleryIndex: this.galleryIndex
      })
      return
    }

    this.addClass("in-gallery")
    if (this.galleryIndex > 0) this.addClass("has-prev")
    else this.removeClass("has-prev")

    if (this.galleryIndex < this.galleryPeers.length - 1) this.addClass("has-next")
    else this.removeClass("has-next")

    console.log("[enlargeAble] gallery active", {
      galleryLength: this.galleryPeers.length,
      galleryIndex: this.galleryIndex,
      hasPrev: this.galleryIndex > 0,
      hasNext: this.galleryIndex < this.galleryPeers.length - 1,
      classes: this.className
    })
  }

  private setupKeyboardNavigation() {
    if (this.keyboardListener) {
      window.removeEventListener("keydown", this.keyboardListener)
    }
    this.keyboardListener = undefined

    if (!this.hasClass("in-gallery")) {
      console.log("[enlargeAble] keyboard nav skipped (not in-gallery)")
      return
    }

    this.keyboardListener = (ev: KeyboardEvent) => {
      if (!this.isOpen) return
      if (ev.key === "ArrowLeft") {
        ev.preventDefault()
        console.log("[enlargeAble] keyboard trigger", ev.key)
        this.navigateGallery(-1)
      }
      else if (ev.key === "ArrowRight") {
        ev.preventDefault()
        console.log("[enlargeAble] keyboard trigger", ev.key)
        this.navigateGallery(1)
      }
    }
    window.addEventListener("keydown", this.keyboardListener)
    console.log("[enlargeAble] keyboard nav attached")
  }

  private getLiveGalleryOrder() {
    const container = this.placeholder?.parentElement?.closest(".kg-gallery-container") as HTMLElement | null
    if (!container) return { items: [] as EnlargeAble[], currentIndex: -1 }

    const items = this.getGalleryOrder(container)

    return {
      items,
      currentIndex: items.indexOf(this)
    }
  }

  private getGalleryOrder(container: HTMLElement) {
    const mixedNodes = Array.from(container.querySelectorAll("c-enlarge-able, enlarge-able-placeholder")) as HTMLElement[]
    const items = [] as EnlargeAble[]
    const seen = new Set<EnlargeAble>()

    const addIfNew = (item?: EnlargeAble) => {
      if (!item || seen.has(item)) return
      seen.add(item)
      items.push(item)
    }

    for (const node of mixedNodes) {
      if (node.tagName === "C-ENLARGE-ABLE") {
        addIfNew(node as any as EnlargeAble)
        continue
      }

      const owner = (node as any).__enlargeOwner as EnlargeAble | undefined
      addIfNew(owner)
    }

    return items
  }

  private async waitUntilClosed(maxWaitMs = 2200) {
    const start = performance.now()

    await new Promise<void>((res) => {
      const tick = () => {
        if (!this.isOpen && !this.isAnimating) {
          res()
          return
        }

        if (performance.now() - start >= maxWaitMs) {
          res()
          return
        }

        requestAnimationFrame(tick)
      }

      tick()
    })
  }

  private navigateGallery(dir: -1 | 1) {
    const live = this.getLiveGalleryOrder()
    const liveIndex = live.currentIndex
    const liveLength = live.items.length

    console.log("[enlargeAble] navigateGallery called", {
      dir,
      isOpen: this.isOpen,
      isAnimating: this.isAnimating,
      inGallery: this.hasClass("in-gallery"),
      galleryIndex: this.galleryIndex,
      galleryLength: this.galleryPeers.length,
      liveIndex,
      liveLength
    })
    if (!this.isOpen) return
    if (this.isAnimating) return
    if (!this.hasClass("in-gallery")) return

    const currentIndex = liveIndex !== -1 ? liveIndex : this.galleryIndex
    const items = liveLength > 0 ? live.items : this.galleryPeers

    const targetIndex = currentIndex + dir
    if (targetIndex < 0 || targetIndex >= items.length) return

    const target = items[targetIndex]
    if (!target || target === this) return
    if (target.isOpen || target.isAnimating) return

    target.pendingGallerySwitchDir = dir
    this.pendingSwitchOutDir = dir

    const doneProm = this.backdropDonePromise
    if (this.resolveBackdropClose) this.resolveBackdropClose()

    if (doneProm) {
      doneProm.then(async () => {
        await this.queueTargetOpen(target, false)
      })
      return
    }

    this.close()
    this.queueTargetOpen(target, true)
  }

  private getCurrentRect() {
    const rect = this.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  }

  private applyRect(rect: RectLike) {
    this.style.top = `${rect.top}px`
    this.style.left = `${rect.left}px`
    this.style.width = `${rect.width}px`
    this.style.height = `${rect.height}px`
  }

  private readInlineRect(): RectLike {
    return {
      top: parseFloat(this.style.top || "0"),
      left: parseFloat(this.style.left || "0"),
      width: parseFloat(this.style.width || "0"),
      height: parseFloat(this.style.height || "0")
    }
  }

  private async animateExponentialTo(getTarget: () => RectLike | undefined, toOpenState: boolean) {
    const easingFactor = toOpenState ? 0.18 : 0.22
    const minStepPx = toOpenState ? 0.45 : 0.65
    const epsilonPx = 0.9
    const maxRuntimeMs = 1400

    const startTime = performance.now()
    let current = this.readInlineRect()

    await new Promise<void>((res) => {
      const tick = () => {
        const target = getTarget()
        if (!target) {
          res()
          return
        }

        let done = true
        const next = { ...current }

        ;(["top", "left", "width", "height"] as const).forEach((key) => {
          const delta = target[key] - current[key]
          if (Math.abs(delta) <= epsilonPx) {
            next[key] = target[key]
            return
          }

          done = false
          let step = delta * easingFactor
          const absStep = Math.abs(step)
          const absDelta = Math.abs(delta)

          if (absStep < minStepPx) {
            step = Math.sign(delta) * Math.min(minStepPx, absDelta)
          }

          next[key] = current[key] + step
        })

        current = next
        this.applyRect(current)

        const elapsed = performance.now() - startTime
        if (done || elapsed >= maxRuntimeMs) {
          this.applyRect(target)
          res()
          return
        }

        this.frameHandle = requestAnimationFrame(tick)
      }

      this.frameHandle = requestAnimationFrame(tick)
    })
  }

  private getTargetRect() {
    const sourceRect = this.openRect
    if (!sourceRect) return undefined

    const isMobile = window.innerWidth < 700
    const padW = isMobile ? maxWidthPaddingMobile : maxWidthPaddingDesktop
    const padH = isMobile ? maxHeightPaddingMobile : maxHeightPaddingDesktop

    const maxWidth = Math.max(window.innerWidth - padW * 2, 50)
    const maxHeight = Math.max(window.innerHeight - padH * 2, 50)

    const aspectRatio = sourceRect.width / sourceRect.height
    if (!isFinite(aspectRatio) || aspectRatio <= 0) return undefined

    let width = maxWidth
    let height = width / aspectRatio

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return {
      width,
      height,
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2
    }
  }

  private createPlaceholder() {
    if (!this.parentElement) return

    const computed = window.getComputedStyle(this)
    const rect = this.getBoundingClientRect()

    const placeholder = ce("enlarge-able-placeholder")
    placeholder.css({
      display: computed.display === "inline" ? "inline-block" : computed.display,
      width: rect.width,
      height: rect.height,
      marginTop: computed.marginTop,
      marginRight: computed.marginRight,
      marginBottom: computed.marginBottom,
      marginLeft: computed.marginLeft,
      pointerEvents: "none"
    })

    this.parentElement.insertBefore(placeholder, this)
    ;(placeholder as any).__enlargeOwner = this
    this.placeholder = placeholder
  }

  private moveToBody() {
    this.isInternalMove = true
    document.body.append(this)
    this.isInternalMove = false
  }

  private restoreFromPlaceholder() {
    const parent = this.placeholder?.parentNode
    if (!parent) return

    this.isInternalMove = true
    parent.insertBefore(this, this.placeholder as Node)
    this.isInternalMove = false
  }

  private clearInlineOpenStyles() {
    if (this.frameHandle !== undefined) {
      cancelAnimationFrame(this.frameHandle)
      this.frameHandle = undefined
    }
    this.style.removeProperty("position")
    this.style.removeProperty("top")
    this.style.removeProperty("left")
    this.style.removeProperty("width")
    this.style.removeProperty("height")
    this.style.removeProperty("max-width")
    this.style.removeProperty("max-height")
    this.style.removeProperty("margin")
    this.style.removeProperty("z-index")
    this.style.removeProperty("box-shadow")
    this.style.removeProperty("border-radius")
    this.style.removeProperty("overflow")
    this.style.removeProperty("opacity")
    this.style.removeProperty("will-change")
    this.style.removeProperty("transform")
    this.openScrollParent = undefined
    this.backdropDonePromise = undefined
    this.resolveBackdropClose = undefined
    if (this.keyboardListener) {
      window.removeEventListener("keydown", this.keyboardListener)
    }
    this.keyboardListener = undefined
    this.galleryPeers = []
    this.galleryIndex = -1
    this.pendingClose = false
    this.removeClass("closing")
    this.resetGalleryClasses()
  }

  private async tryOpen() {
    if (this.isOpen || this.isAnimating) return
    console.log("[enlargeAble] tryOpen")
    this.ensureNavControls()

    const sourceRect = this.getCurrentRect()
    if (sourceRect.width <= 0 || sourceRect.height <= 0) return

    let closeClickListener: any
    const closeByClick = new Promise<void>((res) => {
      this.resolveBackdropClose = res
      closeClickListener = this.on("mousedown", (e) => {
        if (!this.isOpen) return
        const composedPath = (e as any).composedPath?.() as any[]
        if (Array.isArray(composedPath) && composedPath.some((node) => node instanceof HTMLElement && node.classList?.contains("gallery-nav"))) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        closeClickListener.deactivate()
        res()
      })
    })

    const blurRes = blurEverythingInBackground(this, closeByClick, focusZIndex - 1, focusZIndex, 1, false)
    if (!blurRes.canOpen) return

    this.isOpen = true
    this.isAnimating = true
    this.openRect = sourceRect
    this.openScrollParent = getScrollParent(this) as HTMLElement
    this.createPlaceholder()
    this.refreshGalleryContext()
    this.setupKeyboardNavigation()
    this.applyOpenVisualStyles()
    this.moveToBody()
    this.addClass("open")

    this.css({
      position: "fixed",
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      margin: 0,
      zIndex: focusZIndex
    })
    this.style.setProperty("z-index", `${focusZIndex}`, "important")
    this.style.willChange = "top, left, width, height, box-shadow"
    this.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)"
    this.style.transform = "translateZ(0)"

    console.log("[enlargeAble] post-open setup", {
      className: this.className,
      galleryLength: this.galleryPeers.length,
      galleryIndex: this.galleryIndex
    })

    const switchDir = this.pendingGallerySwitchDir
    this.pendingGallerySwitchDir = undefined

    if (switchDir !== undefined) {
      await this.runSwitchInAnim(switchDir)
    }
    else {
      await this.animateExponentialTo(() => this.getTargetRect(), true)
    }
    this.style.boxShadow = "0 24px 80px rgba(0, 0, 0, 0.35)"

    this.isAnimating = false

    if (this.pendingClose) {
      this.close()
      return
    }

    this.backdropDonePromise = blurRes.done
    blurRes.done.then(() => {
      if (closeClickListener) closeClickListener.deactivate()
      this.close()
    })
  }

  private async close() {
    if (!this.isOpen) return
    if (this.isAnimating) {
      this.pendingClose = true
      return
    }

    this.pendingClose = false
    this.isAnimating = true
    this.addClass("closing")

    const switchOutDir = this.pendingSwitchOutDir
    this.pendingSwitchOutDir = undefined

    if (switchOutDir !== undefined) {
      await this.runSwitchOutAnim(switchOutDir)
    }
    else {
      this.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)"
      await this.animateExponentialTo(() => {
        const rect = this.placeholder?.getBoundingClientRect()
        if (!rect) return undefined
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      }, false)
    }

    this.restoreFromPlaceholder()
    this.placeholder?.remove()
    this.placeholder = undefined
    this.openRect = undefined
    this.removeClass("open")
    this.removeClass("closing")
    this.clearInlineOpenStyles()
    this.isOpen = false
    this.isAnimating = false
  }

  disconnectedCallback() {
    if (this.isInternalMove) return

    this.placeholder?.remove()
    this.placeholder = undefined
    this.openRect = undefined
    this.removeClass("open")
    this.removeClass("closing")
    this.clearInlineOpenStyles()
    this.isOpen = false
    this.isAnimating = false
  }

  stl() {
    return super.stl() + require("./enlargeAble.css").toString()
  }

  pug() {
    return require("./enlargeAble.pug").default
  }
}

declareComponent("c-enlarge-able", EnlargeAble)
