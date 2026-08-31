import declareComponent from "../../../../../lib/declareComponent"
import PageSection from "../pageSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { requestNewsCalendarMode } from "../../../../../lib/newsSectionState"

export default class FooterSection extends PageSection {
  protected body: BodyTypes

  constructor() {
    super()

    this.addClass("bgBox")

    const calendarLink = this.q("c-link[footer-calendar-link]") as HTMLElement | null
    if (!calendarLink) return

    const setCalendarMode = () => {
      requestNewsCalendarMode()
    }

    calendarLink.addEventListener("mousedown", setCalendarMode)
    calendarLink.addEventListener("touchstart", setCalendarMode, { passive: true })
    calendarLink.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === "Enter" || ev.key === " ") setCalendarMode()
    })
  }

  stl() {
    return super.stl() + require("./footerSection.css").toString()
  }
  pug() {
    return require("./footerSection.pug").default
  }
}

declareComponent("c-footer-section", FooterSection)
