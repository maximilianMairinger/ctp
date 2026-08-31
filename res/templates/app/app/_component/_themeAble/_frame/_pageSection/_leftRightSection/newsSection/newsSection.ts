import { Data } from "josm";
import declareComponent from "../../../../../../lib/declareComponent"
import UiButton from "../../../../_focusAble/_formUi/_rippleButton/rippleButton";
import NewsBubble from "../../../../newsBubble/newsBubble";
import LeftRightSection from "../leftRightSection"
import "./../../../../link/link"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { latestLatent } from "more-proms";
import delay from "tiny-delay";
import * as domain from "../../../../../../lib/domain";
import { ghostApi } from "../../../../../../lib/ghostApi";
import { getCurrentLoadRecord, overrideCurrentLoadRecord } from "../../../frame";
import { consumeNewsCalendarRequest, newsCalendarRequestToken } from "../../../../../../lib/newsSectionState"

const fallbackCalLink = "https://calendar.google.com/calendar/embed?src=c200c7471ca3504c37c84e44cc31b4c231795827d906c169d414da4202cef34d%40group.calendar.google.com&ctz=Europe%2FVienna"

const baseTag = "ko50"
const blogTag = "news"

export default class NewsSection extends LeftRightSection {
  protected body: BodyTypes

  private loadRecord = getCurrentLoadRecord()

  constructor() {
    super(1010)

    for (const btn of this.q("c-ripple-button", true)) {
      this.styleRippleButton(btn as UiButton)
    }

    
    const rm = this.body.switchBtn.click(() => {
      if (this.body.cal.failed) domain.set(fallbackCalLink)
      stateNewsOrTermine.set(!stateNewsOrTermine.get())
    })

    this.body.cal.failProm.then(() => {
      rm()
      this.body.switchBtn.link(fallbackCalLink)
    })
    

    const openCalendarInitially = consumeNewsCalendarRequest()
    const stateNewsOrTermine = new Data(!openCalendarInitially)

    newsCalendarRequestToken.get(() => {
      if (consumeNewsCalendarRequest()) {
        stateNewsOrTermine.set(false)
      }
    }, false)
    

    const switchToCal = latestLatent(async () => {
      this.body.switchBtn.content("Neues")

      this.body.newsScroll.css({pointerEvents: "none"})
      this.body.newsScroll.anim({opacity: 0})
      this.body.newsScroll.anim({marginBottom: 95, marginTop: 95})
      await delay(200)
    }).then(() => {
      this.body.cal.css({pointerEvents: "auto"})
      this.body.cal.anim({opacity: 1})
    })

    const switchToNews = latestLatent(async () => {
      this.body.switchBtn.content("Termine")

      this.body.cal.css({pointerEvents: "none"})
      this.body.cal.anim({opacity: 0})
      this.body.newsScroll.anim({marginBottom: 0, marginTop: 0})
      await delay(200)
    }).then(() => {
      this.body.newsScroll.css({pointerEvents: "auto"})
      this.body.newsScroll.anim({opacity: 1})
    })


    stateNewsOrTermine.get(latestLatent(showNews => {
      return showNews ? switchToNews() : switchToCal()
    }), false)



    const filter = `tag:${baseTag}+tag:${blogTag}`

    this.loadRecord.full.add(async () => {
      const blogs = await ghostApi.posts.browse({
        formats: "html",
        limit: 15,
        filter,
        include: "authors"
      })
      // console.log(blogs)
      return blogs
    }).then((blogs) => {
      this.body.newsScroll.innerHTML = ""

      const stopOverridingCurrentLoadRecord = overrideCurrentLoadRecord(this.loadRecord)
      let i = 0
      for (const blog of blogs) {
        i++
        const btn = new UiButton()
        const bubble = new NewsBubble()


        // c-ripple-button
        //   c-news-bubble(link="news/spanisch" number="1" heading="Spanisch als Unverbindliche Übung " content="¡Bienvenid@s a la clase de español! Heutzutage ist es fast unumgänglich, mindestens zwei Sprachen zu beherrschen, weshalb der Sprachenfokus unserer Schule seit kurzem um eine weitere Fremdsprache erweitert wurde! Die Schülerinnen und Schüler der 3. und 4. Klassen haben nun die Möglichkeit die unverbindliche Übung „Spanisch“ zu besuchen und somit")
        bubble.link(`news/${blog.slug}`)
        bubble.number(i + "")
        bubble.heading(blog.title)
        bubble.content(blog.excerpt)
        btn.link(`news/${blog.slug}`)

        btn.append(bubble)
        this.body.newsScroll.append(btn)
      }

      stopOverridingCurrentLoadRecord()
    })
  }

  styleRippleButton(btn: UiButton) {
    btn.userFeedbackMode({
      ripple: false,
      hover: false,
      focus: true,
      preHover: false
    })

    btn.button.on("focus", () => {
      this.body.newsScroll.scrollToElem(btn)
    })

    const bubble = btn.children[0] as NewsBubble

    bubble.body.link.noTabIndex()
    bubble.body.link.eventTarget(btn)
  }


  stl() {
    return super.stl() + require("./newsSection.css").toString()
  }
  pug() {
    return require("./newsSection.pug").default
  }
}

declareComponent("c-news-section", NewsSection)
