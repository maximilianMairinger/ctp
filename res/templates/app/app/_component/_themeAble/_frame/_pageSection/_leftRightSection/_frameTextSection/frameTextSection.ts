import declareComponent from "../../../../../../lib/declareComponent"
import LeftRightSection from "../leftRightSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class _frameTextSection extends LeftRightSection {
  protected body: BodyTypes


  stl() {
    return super.stl() + require("./frameTextSection.css").toString()
  }
  pug() {
    return require("./frameTextSection.pug").default
  }
}

declareComponent("c-frame-text-section", _frameTextSection)
