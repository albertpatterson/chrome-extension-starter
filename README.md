# Chrome-Extension-Starter

![Social Preview](https://raw.githubusercontent.com/albertpatterson/chrome-extension-starter/master/docs/social_preview2.png)

[Chrome-Extension-Starter](https://github.com/albertpatterson/chrome-extension-starter) is a starter project for a [Chrome Browser Extension](https://developer.chrome.com/docs/extensions/) including a framework and build system.

[![Maintenance](https://img.shields.io/maintenance/yes/2022)](https://github.com/albertpatterson/chrome-extension-starter/graphs/commit-activity) [![GitHub license](https://img.shields.io/github/license/albertpatterson/chrome-extension-starter)](https://github.com/albertpatterson/chrome-extension-starter/blob/master/LICENSE) [![Open Issues](https://img.shields.io/github/issues/albertpatterson/chrome-extension-starter)](https://github.com/albertpatterson/chrome-extension-starter/issues)

It facilitates rapid development and creation of optimized assets for deployment - ideal for developing complex extensions. This project also offers file watching and automatic reloading to narrow development cycles. It utilized many familiar tools for web development (Webpack, Babel, Typescript etc) to create unpacked assets for local development as well as a zip file for deployment to the web store.

## Usage

Create extension resources automatically via npx

`npx create-extension [new directory name]`

- options
  - -j or --javascript=true to use javascript instead of typescript
  - -i or --install=true to automatically install
  - -y or --yes=true to accept defaults (create in a 'browser_extension" directory with typscript and automatically install)

## Development

Once the extension resources are created, the following scripts are available to build the code.

- build the project (prod mode): `npm run build`
- build the project (dev mode): `npm run build-dev`
- build the project in dev mode, watch for changes and automatically rebuild and reload the extension. `npm run watch`
  - Note that the extension should be loaded AFTER running this command for automatic reloading to work correctly.
- Typical first steps include
  - Update the package.json and src/manifest.json with the details for your project and configuration for your extension.
  - update the files under src to build your application

Once the code is built, the unpacked extension will be available in dist/unpacked and one can directly [Load an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) into the browser.

![Load an unpacked extension](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=571)

If built in production mode, a zip file will be created to up load to the Web Store.

## Directories

- <b>src</b>: The location of src files composing the extension

  - <b>manifest.json</b>: the [Manifest file](https://developer.chrome.com/docs/extensions/mv3/manifest/)
  - <b>background</b>: files that run in the background and compose the [service worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
  - <b>injected</b>: files that get injected into web pages via [content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
  - <b>popup</b>: files that build the [popup](https://developer.chrome.com/docs/extensions/reference/action/#popup).
    - Reminder: The action.onClicked event will not be dispatched if the extension action has specified a popup to show on click on the current tab.
  - <b>util</b>: Utils for use throughout the extension
  - <b>messaging</b>: Simplilfied messaging utils which provide type safety and simplify [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

    - To extend this with arbitrary message types, copy the contents of src/messaging/message_systems/simple_request and create the following

      - <b>message_system.ts</b>: a message system that facilitates straightforward message passing
      - <b>handle_async_in_service_worker.ts</b>: defines how the service worker response to a particular type of message
      - <b>handle_async_in_tab</b>: defines how the the tab response to a particular type of message

    - Add the new message system to the list of registered message systems in src/messaging/message_systems.ts
    - Available with typescript template only
    - Loaded into both the injected scripts and the service worker, so may cause increased package size

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
