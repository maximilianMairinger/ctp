import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import ICAL from "ical.js"
import { createCalendar, viewMonthGrid, viewMonthAgenda } from "@schedule-x/calendar"
import { createEventModalPlugin } from "@schedule-x/event-modal"

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  createViewList,
} from '@schedule-x/calendar'
import { ResablePromise } from "more-proms";






export default class ScheduleX extends Component {
  protected body: BodyTypes

  public calendar: any

  constructor() {
    super()

  }

  public failed = false
  public failProm = new ResablePromise()
  
  src(url: string) {
    return this.initCalendar(url);
  }

  async initCalendar(url: string) {
    // debugger
    try {
      // Fetch the raw iCal data from your proxy
      const response = await fetch(url);
      const icalData = await response.text();

      // Parse events
      const events = this.parseICal(icalData);
      
      this.calendar = createCalendar({
        views: [createViewMonthAgenda()],
        firstDayOfWeek: 1, // Monday
        timezone: 'Europe/Vienna',
        locale: 'de-DE',
        // defaultView: createViewList().name, // Agenda is better for phones
        events: events,
        // plugins: [createEventModalPlugin()],
        // isDark: false, // Set to true if your site is dark mode
        // callbacks: {
        //     onEventClick(event) {
        //         console.log('Event clicked:', event);
        //     }
        // }
      });

      
      const ogGetElById = document.getElementById;
      document.getElementById = (query: string) => {
        return this.shadowRoot.getElementById(query) || ogGetElById.call(document, query);
      }

      document.querySelector = (query: string) => {
        return this.shadowRoot.querySelector(query) || document.querySelector(query);
      }
      const ogAddEventListener = document.addEventListener;
      document.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        this.shadowRoot.addEventListener(type, listener, options);
        // document.addEventListener(type, listener, options);
      }

      document.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
        this.shadowRoot.removeEventListener(type, listener, options);
        // document.removeEventListener(type, listener, options);
      }

      // debugger

      // console.log(document.getElementById("sx-calendar-container"));


      this.calendar.render(this.body.calDiv);
      // document.addEventListener = ogAddEventListener
      // document.getElementById = ogGetElById; // Restore original method

    } catch (e) {
      console.error("Error loading calendar:", e);
      this.innerHTML = `<p>Error loading schedule. Please try again later.</p>`;

      this.failed = true;
      this.failProm.res()
    }
  }


  // A helper to turn standard iCal data into Schedule-X format
  parseICal(icalData) {
    if (!icalData || !icalData.includes('BEGIN:VCALENDAR')) return [];

    try {
        const jcal = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcal);
        
        // Map and Filter in one pass
        return comp.getAllSubcomponents('vevent').map((vevent, index) => {
            const event = new ICAL.Event(vevent);
            const s = event.startDate; // ICAL.Time object
            const e = event.endDate;   // ICAL.Time object

            // 1. Sanitize ID (Mandatory for Schedule-X)
            // Turns "user@google.com" -> "user_google_com"
            const safeId = String(event.uid || index).replace(/[^a-zA-Z0-9_-]/g, '_');

            let start, end;

            if (s.isDate) {
                // --- ALL DAY EVENT (Use Temporal.PlainDate) ---
                // Construct directly from integers (No string parsing)
                start = new Temporal.PlainDate(s.year, s.month, s.day);
                
                // Fix Google's exclusive end date (Subtract 1 day)
                // e.g. Google says Holiday is Jan 1 to Jan 2. We want Jan 1 to Jan 1.
                const rawEnd = new Temporal.PlainDate(e.year, e.month, e.day);
                end = rawEnd.subtract({ days: 1 });

            } else {
                // --- TIMED EVENT (Use Temporal.ZonedDateTime) ---
                // We use the Unix Epoch from the JS Date to bridge cleanly to Temporal
                // This handles timezones automatically (converts everything to UTC or System Zone)
                
                const timeZone = 'Europe/Vienna'; // Or use 'UTC' if you prefer
                
                // Convert ICAL.Time -> JS Date -> Temporal.Instant -> Temporal.ZonedDateTime
                start = Temporal.Instant
                    .fromEpochMilliseconds(s.toJSDate().getTime())
                    .toZonedDateTimeISO(timeZone);

                end = Temporal.Instant
                    .fromEpochMilliseconds(e.toJSDate().getTime())
                    .toZonedDateTimeISO(timeZone);
            }

            return {
                id: safeId,
                title: event.summary || "Untitled",
                description: event.description || "",
                location: event.location || "",
                start: start, // Native Temporal Object
                end: end      // Native Temporal Object
            };
        });

    } catch (err) {
        console.error("Calendar Parse Error:", err);
        return [];
    }
}

  stl() {
    return super.stl()
     + require("@schedule-x/theme-default/dist/index.css").toString()
    //  + require("@schedule-x/theme-shadcn/dist/index.css").toString()
     + require("./scheduleX.css").toString()
  }
  pug() {
    return require("./scheduleX.pug").default
  }
}

declareComponent("c-schedule-x", ScheduleX)


