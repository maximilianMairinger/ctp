import declareComponent from "../../../../../../../lib/declareComponent"
import { Import, ImportanceMap } from "../../../../../../../lib/lazyLoad"
import LandingSection from "../../../../_pageSection/landingSection/landingSection"
import FooterSection from "../../../../_pageSection/footerSection/footerSection"

import LazySectionedPage from "../lazySectionedPage"
import HightlightAbleIcon from "../../../../../_icon/_highlightAbleIcon/highlightAbleIcon"
import ThoughtBubbleIcon from "../../../../../_icon/_highlightAbleIcon/thoughtBubble/thoughtBubble"
import RocketIcon from "../../../../../_icon/_highlightAbleIcon/rocket/rocket"
import TeamIcon from "../../../../../_icon/_highlightAbleIcon/teamIcon/teamIcon"
import ContactIcon from "../../../../../_icon/_highlightAbleIcon/contact/contact"



export default class HomePage extends LazySectionedPage {

  public iconIndex: {[key: string]: HightlightAbleIcon}

  constructor(baselink: string, sectionChangeCallback?: (section: string) => void) {

    super(new ImportanceMap<() => Promise<any>, any>(
      {
        key: new Import("", 1, (landingSection: typeof LandingSection) =>
          new landingSection()
        ), val: () => import(/* webpackChunkName: "landingSection" */"../../../../_pageSection/landingSection/landingSection")
      },
      {
        key: new Import("contact", 1, (footerSection: typeof FooterSection) =>
          new footerSection()
        ), val: () => import(/* webpackChunkName: "footerSection" */"../../../../_pageSection/footerSection/footerSection")
      },
    ), baselink, sectionChangeCallback, undefined, {
      footer: "team"
    })



    this.iconIndex = {
      services: new RocketIcon(),
      team: new TeamIcon(),
      contact: new ContactIcon()
    }
  }

  stl() {
    return super.stl() + require("./homepage.css").toString()
  }
  pug() {
    return require("./homepage.pug").default
  }
}

declareComponent("home-page", HomePage)
