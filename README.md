# Create-Extension

![Social Preview](https://raw.githubusercontent.com/albertpatterson/chrome-extension-starter/master/docs/social_preview2.png)

[Chrome-Extension-Starter](https://github.com/albertpatterson/chrome-extension-starter) start a project for a [Chrome Browser Extension](https://developer.chrome.com/docs/extensions/) including a framework and build system.

[![Maintenance](https://img.shields.io/maintenance/yes/2022)](https://github.com/albertpatterson/chrome-extension-starter/graphs/commit-activity) [![GitHub license](https://img.shields.io/github/license/albertpatterson/chrome-extension-starter)](https://github.com/albertpatterson/chrome-extension-starter/blob/master/LICENSE) [![Open Issues](https://img.shields.io/github/issues/albertpatterson/chrome-extension-starter)](https://github.com/albertpatterson/chrome-extension-starter/issues)

It facilitates fast setup, rapid development, and creation of optimized assets for deployment - ideal for developing complex extensions. This project also offers file watching and automatic reloading to narrow development cycles. It utilized many familiar tools for web development (Webpack, Babel, Typescript etc) to create unpacked assets for local development as well as a zip file for deployment to the web store.

## Author

[Albert Patterson](mailto:albert.patterson.code@gmail.com)

- [Linkedin](https://www.linkedin.com/in/apattersoncmu/)
- [Github](https://github.com/albertpatterson)
- [npm](https://www.npmjs.com/~apatterson189)
- [Youtube](https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw)
- [Medium](https://medium.com/@albert.patterson.code)

## Usage

Create extension resources automatically via npx

`npx create-extension [new directory name]`

- options
  - -j or --javascript=true to use javascript instead of typescript
  - -i or --install=true to automatically install
  - -y or --yes=true to accept defaults (create in a 'browser_extension" directory with typscript and automatically install)

## Examples

- [Simple Screenshotter](https://github.com/albertpatterson/simple-screenshotter)
- [Actions](https://github.com/albertpatterson/actions)

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
    - src/background/service_worker.[tj]s is the main file for the service worker
    - additional files to concatenate with with service worker in dev mode should be placed in src/background/dev_mode_only
      - currently two files are concatenated in dev mode
        - chromereload.[tj]s which reloads the extension while running watch
        - keep_active.[tj]s which keeps the service worker active so that it can be reloaded
        - additional files added in this directory will be included automatically
  - <b>injected</b>: files that get injected into web pages via [content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
    - Each script should be defined in it's own folder containing an index.[tj]s file. For example the all_pages content script is defined in src/injected/all_pages/index.[tj]s.
    - New scripts with the same structure will be included automatically.
  - <b>popup</b>: files that build the [popup](https://developer.chrome.com/docs/extensions/reference/action/#popup).
    - Reminder: The action.onClicked event will not be dispatched if the extension action has specified a popup to show on click on the current tab.
  - <b>options</b>: files that build the [options page](https://developer.chrome.com/docs/extensions/mv3/options/).
  - <b>util</b>: Utils for use throughout the extension
  - <b>messaging</b>: Simplilfied messaging utils which provide type safety and simplify [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

    - To extend the message system with newm, arbitrary types of messages

      - copy the contents of src/messaging/message_systems/simple_request and create the following
        - <b>types.ts</b>: defines the types passed between request and response
        - <b>handle_async_in_service_worker.ts</b>: defines how the service worker response to a particular type of message
        - <b>handle_async_in_tab</b>: defines how the the tab response to a particular type of message
        - <b>message_system.ts</b>: combines the previous modules into a message system that facilitates straightforward message passing. This file likely will not require modification.
      - Add the new message system in /src/messaging/message_systems/message_systems.ts
      - Create messages with src/messaging/message_systems/[Request]:createRequest
      - Send messages in the tab with src/messaging/message_systems/[Request]:sendInTab.
      - Send messages in the service worker with src/messaging/message_systems/[Request]:sendInServiceWorker.

    - Add the new message system to the list of registered message systems in src/messaging/message_systems.ts
    - Available with typescript template only
    - At build time the following modules will be replaces with noop modules to avoid bloating the built artifacts with ununsed code
      - in the injected scripts message_systems/\*/handle_async_in_service_worker.ts -> message_systems/noops/handle_async_in_service_worker.ts
      - in the service worker message_systems/\*/handle_async_in_tab.ts -> message_systems/noops/handle_async_in_tab.ts

- <b>build</b>: The utilities for building the extension from the source files.
  - Adding new features will likely require some update to the build process or the webpack config
    - build/webpack/get.webpack.config.script can be used to build scripts, for example it is used for building the content scripts
    - build/webpack/get.webpack.config.page can be used to build pages, for example it is used for building the popup page.
    - these should be used as a starting points for new config factories

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
