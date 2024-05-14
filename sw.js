/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-85877d4d95ba4a3ec557.js"
  },
  {
    "url": "framework-36843be780ebe64c92e8.js"
  },
  {
    "url": "styles.805f96c7d4bfb80978df.css"
  },
  {
    "url": "1bfc9850-a725ccadc4b3573eb084.js"
  },
  {
    "url": "ad7f724d-10f2a8f3e2deb6ddd603.js"
  },
  {
    "url": "cfc6b023-c3582647336a4c8bb37e.js"
  },
  {
    "url": "ea683af8-0c0caca5331edcff1b88.js"
  },
  {
    "url": "c4169ad2-5df802bc4528722b12a3.js"
  },
  {
    "url": "43a99af2-924120bf4e25c1b69082.js"
  },
  {
    "url": "fc20e1c4-6825e39c18871dde84ea.js"
  },
  {
    "url": "8edc3fe5-0271604a3e2e6026cd20.js"
  },
  {
    "url": "ebc5ba27-30cc5e73e9dc122ff4d6.js"
  },
  {
    "url": "315606f0-7e01a1943a710b468a88.js"
  },
  {
    "url": "10bf5a56-b3ca83d3a00e1254595f.js"
  },
  {
    "url": "ce8576ea-2d50c231ede60c67e4d1.js"
  },
  {
    "url": "98397353-79706a3397f0efd16515.js"
  },
  {
    "url": "b85045ab-d0168d5492a8bd2346c3.js"
  },
  {
    "url": "c2ec1d10-e3aa8306216231b2ec52.js"
  },
  {
    "url": "8f19d780-bd85d98f54b85ad85e2d.js"
  },
  {
    "url": "5ca00d41-4076ae626fb425c3d60a.js"
  },
  {
    "url": "b16bd182-5c101bb785fab2fbfcdb.js"
  },
  {
    "url": "42e09a2c-3a799dd7f11b1cea446c.js"
  },
  {
    "url": "6e92790c-49c9214f9cc73323bcf1.js"
  },
  {
    "url": "a45cf4d1-097b9d1f8d609236e9c4.js"
  },
  {
    "url": "5f6bb6fb-6ef6972df0016780dbfd.js"
  },
  {
    "url": "79eb02f1-0130e31f8183a81bf3eb.js"
  },
  {
    "url": "3c128e86-755cd3568a48fbd1286f.js"
  },
  {
    "url": "ebd65826-6d5936b55c413cbc8eff.js"
  },
  {
    "url": "2f37a77d-65888c7849e42119996c.js"
  },
  {
    "url": "23420901-263f7a263c882d55c141.js"
  },
  {
    "url": "da011f70-f89323504793b756e150.js"
  },
  {
    "url": "262b3caa-e3122fabbb4a80729618.js"
  },
  {
    "url": "0e6451da-9a48c80f7456a0a67d33.js"
  },
  {
    "url": "4119064d-0666644f757f27dc477a.js"
  },
  {
    "url": "e51a3977-59571adc0d3a13de748f.js"
  },
  {
    "url": "6e2d9d0a-0cdc9898b782062faed3.js"
  },
  {
    "url": "761cb607-27c7047e45dee80a366a.js"
  },
  {
    "url": "439716bf-b81cef2d7be393b9d7df.js"
  },
  {
    "url": "2fb713ed-333a2fe1619c9ad485a9.js"
  },
  {
    "url": "1c920f04-f95e9e951c405960416a.js"
  },
  {
    "url": "9a679482-a561d08ba52eb88c50cd.js"
  },
  {
    "url": "app-59f084f453f547782c9e.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "d32a64f03f64e507f5959e569251fa8b"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "a4591e3d58183e3cc46bab9cf2d03b4d"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())

    // We detected compilation hash mismatch
    // we should clear runtime cache as data
    // files might be out of sync and we should
    // do fresh fetches for them
    event.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (key && key.includes(`runtime`)) {
              return caches.delete(key)
            }

            return Promise.resolve()
          })
        )
      })
    )
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-59f084f453f547782c9e.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
