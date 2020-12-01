> :warning: In the future, [the `senna` npm package](https://npmjs.com/package/senna) will be deprecated and this repo archived (ie. switched to read-only mode). Development continues in [the `liferay/liferay-portal` repo](https://github.com/liferay/liferay-portal) (more specifically, inside [the `frontend-js-spa-web` module](https://github.com/liferay/liferay-portal/tree/master/modules/apps/frontend-js/frontend-js-spa-web)), but not as an independent project, in order to better integrate with and serve the needs of Liferay DXP. At the time of writing, the last official release was [v2.7.9](https://github.com/liferay/senna.js/tree/v2.7.9), from the `2.x` series on the `master` branch, and it is still used by a number of pre-EOL versions of Liferay DXP, such as [7.0.x](https://github.com/liferay/liferay-portal/blob/6b14c8e0496926309a5fac347cb2d342d7412c1f/modules/apps/foundation/frontend-js/frontend-js-spa-web/package.json#L6), [7.1.x](https://github.com/liferay/liferay-portal/blob/d9a4b24bf1871d509c2bb12e38669bb8552db1a5/modules/apps/frontend-js/frontend-js-spa-web/package.json#L17), [7.2.x](https://github.com/liferay/liferay-portal/blob/ded0e9390637985231e962e4ad4cfa4639eabb26/modules/apps/frontend-js/frontend-js-spa-web/package.json#L6), and [7.3.x](https://github.com/liferay/liferay-portal/blob/c940e8fd455d59fe05fd2038410070412411947c/modules/apps/frontend-js/frontend-js-spa-web/package.json#L6).

---

# Senna.js

[![Build Status](http://img.shields.io/travis/liferay/senna.js/master.svg?style=flat)](https://travis-ci.org/liferay/senna.js)
[![Dependencies Status](http://img.shields.io/david/liferay/senna.js.svg?style=flat)](https://david-dm.org/liferay/senna.js#info=dependencies)
[![DevDependencies Status](http://img.shields.io/david/dev/liferay/senna.js.svg?style=flat)](https://david-dm.org/liferay/senna.js#info=devDependencies)

*Senna.js* is a blazing-fast single page application engine that provides several low-level APIs that allows you to build modern web-based applications with only ~15 KB of JavaScript without any dependency.

* [Official website](http://sennajs.com)
* [Website repository](https://github.com/liferay/sennajs.com)
* [Documentation](http://sennajs.com/docs/)
* [API Docs](http://sennajs.com/api/)

## Support and Project status

Senna.js is widely used and well maintained internally at Liferay but
does not currently have staffing to support the open source release.  As such
this project is mostly _internal_ and support is _minimal_.  For certain
issues, like build integration we are in an especially bad position to offer
support.

To get assistance you can use any of the following forums

1. Look through the [documentation](https://sennajs.com).
2. File an [issue on GitHub](https://github.com/liferay/senna.js/issues)

We will try our best, but keep in mind that given our support staffing, we may
not be able to help.

## Install

Install via [npm](https://www.npmjs.com/), [Bower](http://bower.io/), [CDN](http://www.jsdelivr.com/projects/senna.js) or
[download as a zip](https://github.com/liferay/senna.js/archive/master.zip):

```
npm install senna
```

## Examples

* **[Email Example](http://sennajs.com/examples/email):** *Enable Single Page Apps using only HTML5 data-attributes;*
* **[Gallery Example](http://sennajs.com/examples/gallery):** *Carousel app with history support and cacheable screens;*
* **[Blog Example](http://sennajs.com/examples/blog):** *Infinite scrolling pages done right with history support;*

## Setup

1. Install NodeJS >= [v0.12.0](http://nodejs.org/dist/v0.12.0/), if you don't have it yet.

2. Install global dependencies:

  ```
  [sudo] npm install -g gulp
  ```

3. Install local dependencies:

  ```
  npm install
  bower install
  ```

4. Build the code:

  ```
  gulp
  ```

  ```
  gulp server
  ```

5. Test the code:

  ```
  gulp test
  ```

  ```
  gulp test:coverage
  ```

## Contributing

Please, see our detailed [CONTRIBUTING](https://github.com/liferay/senna.js/blob/master/CONTRIBUTING.md) guide for all the information you need to contribute to the project!

## History

For detailed changelog, check [Releases](https://github.com/liferay/senna.js/releases).

## Credits

* Inspired by Daniel Pupius' [Surface project](https://github.com/dpup/surface)
* Demo layouts by [Pure CSS](http://purecss.io/)
* Icon made by [Freepik](http://www.freepik.com)

## Team

*Senna.js* was made with love by these people and a bunch of [awesome contributors](https://github.com/liferay/senna.js/graphs/contributors).

| Author | Maintainer |
|:-:|:-:|
| [![Eduardo Lundgren](https://avatars3.githubusercontent.com/u/113087?s=70)](https://github.com/eduardolundgren) | [![Bruno Basto](https://avatars1.githubusercontent.com/u/156388?s=70)](https://github.com/brunobasto) |
| [Eduardo Lundgren](https://github.com/eduardolundgren) | [Bruno Basto](https://github.com/brunobasto) |

## Browser Support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/senna.svg)](https://travis-ci.org/liferay/senna.js)

## License

[BSD License](https://github.com/liferay/senna.js/blob/master/LICENSE.md) © Liferay, Inc.
