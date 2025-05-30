/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-c5a33c51'], (function (workbox) { 'use strict';

  importScripts("fallback-HHvl8p9ThhYWcLHQFvYkm.js");
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "/_next/static/HHvl8p9ThhYWcLHQFvYkm/_buildManifest.js",
    "revision": "8061e49870aae8b6a65d1af7c7a0e624"
  }, {
    "url": "/_next/static/HHvl8p9ThhYWcLHQFvYkm/_ssgManifest.js",
    "revision": "b6652df95db52feb4daf4eca35380933"
  }, {
    "url": "/_next/static/chunks/294.e72d2554be082393.js",
    "revision": "e72d2554be082393"
  }, {
    "url": "/_next/static/chunks/36-a92f46ae763e36b6.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/4bd1b696-a4b9de495e836315.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/51-1104baed32aa55d1.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/684-5228f6b4b4698ab7.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/app/_not-found/page-7b137d85f9de4771.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/app/dashboard/page-5096a7024482b77b.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/app/layout-c74e7cb478caf4f9.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/app/login/page-43ccc5954eca6a83.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/app/page-2e89521aba1e8f60.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/framework-f593a28cde54158e.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/main-64f573080d2f9d5b.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/main-app-161964fb0ff1f646.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/pages/_app-da15c11dea942c36.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/chunks/polyfills-42372ed130431b0a.js",
    "revision": "846118c33b2c0e922d7b3a7676f81f6f"
  }, {
    "url": "/_next/static/chunks/webpack-9ab448d02aa9cfcf.js",
    "revision": "HHvl8p9ThhYWcLHQFvYkm"
  }, {
    "url": "/_next/static/css/1ae6d812a39ee604.css",
    "revision": "1ae6d812a39ee604"
  }, {
    "url": "/_next/static/css/6efce39025ed77ed.css",
    "revision": "6efce39025ed77ed"
  }, {
    "url": "/_next/static/media/412b5a45a1485802-s.p.ttf",
    "revision": "3fe31931783b0fa86cfc98a833779ed3"
  }, {
    "url": "/_next/static/media/569ce4b8f30dc480-s.p.woff2",
    "revision": "ef6cefb32024deac234e82f932a95cbd"
  }, {
    "url": "/_next/static/media/747892c23ea88013-s.woff2",
    "revision": "a0761690ccf4441ace5cec893b82d4ab"
  }, {
    "url": "/_next/static/media/76ab8b296368a459-s.p.ttf",
    "revision": "f73f59c08690dbd7be3c612c43487bab"
  }, {
    "url": "/_next/static/media/8d697b304b401681-s.woff2",
    "revision": "cc728f6c0adb04da0dfcb0fc436a8ae5"
  }, {
    "url": "/_next/static/media/93f479601ee12b01-s.p.woff2",
    "revision": "da83d5f06d825c5ae65b7cca706cb312"
  }, {
    "url": "/_next/static/media/9610d9e46709d722-s.woff2",
    "revision": "7b7c0ef93df188a852344fc272fc096b"
  }, {
    "url": "/_next/static/media/ba015fad6dcf6784-s.woff2",
    "revision": "8ea4f719af3312a055caf09f34c89a77"
  }, {
    "url": "/_next/static/media/fe05483fa773983d-s.p.ttf",
    "revision": "e8f47a72dddf523096a21b4a93f56f89"
  }, {
    "url": "/icons/Tlogo_192x192.png",
    "revision": "3d16e1486b5271f8157867b47f4ceb1b"
  }, {
    "url": "/icons/Tlogo_512x512.png",
    "revision": "6b92ecaf3117169b8a7133d01cd0094b"
  }, {
    "url": "/icons/logo.png",
    "revision": "1e7191ffe7a510dd61ec539b4fa2a526"
  }, {
    "url": "/icons/logo_192x192.png",
    "revision": "b4658ab738c1a2f78e96650cf6e94387"
  }, {
    "url": "/icons/logo_512x512.png",
    "revision": "4cd5d287fb75a63180a28d99b99e498a"
  }, {
    "url": "/manifest.json",
    "revision": "3b892f1e7521ed1e5e8653d09ec798f2"
  }, {
    "url": "/offline.html",
    "revision": "645aff66bbc0baebc880655302e47ee0"
  }], {
    "ignoreURLParametersMatching": []
  });
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }, {
      handlerDidError: async ({
        request
      }) => self.fallback(request)
    }]
  }), 'GET');
  workbox.registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/, new workbox.StaleWhileRevalidate({
    "cacheName": "images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }), {
      handlerDidError: async ({
        request
      }) => self.fallback(request)
    }]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 30,
      maxAgeSeconds: 31536000
    }), {
      handlerDidError: async ({
        request
      }) => self.fallback(request)
    }]
  }), 'GET');
  workbox.registerRoute(/\.(?:js|css|woff2?|ttf|otf)$/, new workbox.StaleWhileRevalidate({
    "cacheName": "static-resources",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    }), {
      handlerDidError: async ({
        request
      }) => self.fallback(request)
    }]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/.*\/api\/.*$/i, new workbox.NetworkFirst({
    "cacheName": "api-cache",
    "networkTimeoutSeconds": 10,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 300
    }), {
      handlerDidError: async ({
        request
      }) => self.fallback(request)
    }]
  }), 'GET');

}));
