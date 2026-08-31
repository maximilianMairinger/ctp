import Manager from "../manager";
import {ImportanceMap, Import} from "../../../../../lib/lazyLoad"
import NotFoundPage from "../../_page/notFound/notFound"
import HomePage from "../../_page/_sectionedPage/_lazySectionedPage/homepage/homepage";
import { declareComponent } from "../../../../../lib/declareComponent"
import HighlightAbleIcon from "../../../_icon/_highlightAbleIcon/highlightAbleIcon";
import BlogPage from "../../_page/blogPage/blogPage";
import GhostBlogSection from "../../_pageSection/blogSection/ghostBlogSection/ghostBlogSection";





export default class PageManager extends Manager {
  constructor(pageChangeCallback?: (page: string, sectiones: {[link: string]: HighlightAbleIcon}[], domainLevel: number) => void, sectionChangeCallback?: (section: string) => void, onScroll?: (scrollProgress: number) => void, onUserScroll?: (scrollProgress: number, userInited: boolean) => void) {

    super(new ImportanceMap<() => Promise<any>, any>(
      
      {
        key: new Import("", 10, (homepage: typeof HomePage) =>
            new homepage("", sectionChangeCallback)
        ), val: () => import(/* webpackChunkName: "homepage" */"../../_page/_sectionedPage/_lazySectionedPage/homepage/homepage")
      },
      {
        key: new Import<string, [BlogPage, GhostBlogSection]>("blog/*", 10, ([blogPage, ghostBlogSection]) =>
            new blogPage(new ghostBlogSection())
        ), val: () => Promise.all([import("../../_page/blogPage/blogPage"), import("../../_pageSection/blogSection/ghostBlogSection/ghostBlogSection")])
      },
      {
        key: new Import("", 60, (notFoundPage: typeof NotFoundPage) =>
          new notFoundPage()
        ), val: () => import(/* webpackChunkName: "notFoundPage" */"../../_page/notFound/notFound")
      }
    ), 0, pageChangeCallback, true, onScroll, onUserScroll)
  }


  stl() {
    return super.stl() + require("./pageManager.css").toString()
  }
  pug() {
    return "";
  }
}


declareComponent("page-manager", PageManager)