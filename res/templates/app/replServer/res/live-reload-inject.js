let stream = new EventSource(url);


stream.addEventListener("message", reload)
stream.addEventListener("error", reload)


async function reload() {
  console.log("Reloading...")
  let proms = []
  await navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("Unregistering the following sw", registrations)
    for(let registration of registrations) {
      proms.push(registration.unregister())
    }
  })

  await Promise.all(proms)

  location.reload()
}
