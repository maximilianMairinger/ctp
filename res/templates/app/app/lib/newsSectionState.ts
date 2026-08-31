import { Data } from "josm"

export const newsCalendarRequestToken = new Data(0)

let consumedRequestToken = 0

export function requestNewsCalendarMode() {
  const token = newsCalendarRequestToken.get() + 1
  newsCalendarRequestToken.set(token)
}

export function consumeNewsCalendarRequest() {
  const token = newsCalendarRequestToken.get()
  const hasRequest = token > consumedRequestToken
  if (hasRequest) consumedRequestToken = token
  return hasRequest
}
