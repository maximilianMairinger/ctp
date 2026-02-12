import delay from "tiny-delay";
import declareComponent from "../../../../../../../lib/declareComponent"
import { loadRecord } from "../../../../frame";
import Section from "../frameTextSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"


export default class ContactSection extends Section {
  protected body: BodyTypes

  constructor() {
    super(1000)

    this.componentBody.addClass("mobileInverse")

    
    const loadGoogleMaps = () => {
      return new Promise<void>((res, rej) => {
        // we cannot really check iframe status here :(. Because of Iframe sandboxing
        this.body.iframe.addEventListener("load", () => {
          if (this.body.iframe.contentWindow) {
            res()
          }

          if (!this.body.iframe.contentWindow) {
            rej()
          }
        })
        this.body.iframe.addEventListener("error", () => {
          rej()
        })

        this.body.iframe.src = `https://www.google.com/maps/embed/v1/place?q=place_id:ChIJB50pUC4BbUcRkFK7Z8SWxrY&key=${process.env.GOOGLE_MAPS_API_KEY}`
      })
    }

    this.body.consentMaps.click(async () => {
      // await delay(300000)
      return await loadGoogleMaps().then(() => {
        return () => {
          this.body.iframe.css({pointerEvents: "auto"})
          this.body.iframe.anim({opacity: 1})
          const placeholder = this.componentBody.childs(".mapsPlaceholder")
          placeholder.css({pointerEvents: "none"})
          this.componentBody.childs("image-overlay").anim({opacity: 0})
        }
      }).catch((e) => {
        console.error(e)
        // alert("Fehler beim Laden der Karte. Bitte versuchen sie es später erneut.")
      })
    })
  }
  

  stl() {
    return super.stl() + require("./contactSection.css").toString()
  }
  pug() {
    return require("./contactSection.pug").default
  }
}

declareComponent("c-contact-section", ContactSection)



