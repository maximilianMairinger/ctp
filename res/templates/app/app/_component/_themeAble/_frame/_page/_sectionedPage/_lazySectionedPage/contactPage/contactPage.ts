import declareComponent from "../../../../../../../lib/declareComponent"
import HighlightAbleIcon from "../../../../../_icon/_highlightAbleIcon/highlightAbleIcon";
import LazySectionedPage from "../lazySectionedPage"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { Import, ImportanceMap } from "../../../../../../../lib/lazyLoad"
import ThoughtBubbleIcon from "../../../../../_icon/_highlightAbleIcon/thoughtBubble/thoughtBubble"
import TeamIcon from "../../../../../_icon/_highlightAbleIcon/teamIcon/teamIcon"
import ContactIcon from "../../../../../_icon/_highlightAbleIcon/contact/contact"
import FooterSection from "../../../../_pageSection/footerSection/footerSection"

export default class ContactPage extends LazySectionedPage {
  public iconIndex: { [key: string]: HighlightAbleIcon; };
  protected body: BodyTypes

  constructor(baselink: string, sectionChangeCallback?: (section: string) => void) {
    super(new ImportanceMap<() => Promise<any>, any>(
      {
        key: new Import("contact", 1, (contactSection: any) =>
          new contactSection()
        ), val: () => import(/* webpackChunkName: "generalContactSection" */"../../../../_pageSection/generalContactSection/generalContactSection")
      },
      {
        key: new Import("footer", 1, (footerSection: typeof FooterSection) =>
          new footerSection()
        ), val: () => import(/* webpackChunkName: "footerSection" */"../../../../_pageSection/footerSection/footerSection")
      },
    ), baselink, sectionChangeCallback, undefined, {
      footer: "presse"
    })



    this.iconIndex = {
      praesidium: new ThoughtBubbleIcon(),
      presse: new TeamIcon(),
      contact: new ContactIcon()
    }


  }

  stl() {
    return super.stl() + require("./contactPage.css").toString()
  }
  pug() {
    return require("./contactPage.pug").default
  }
}

declareComponent("c-contact-page", ContactPage)
