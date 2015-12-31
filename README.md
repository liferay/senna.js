# Senna.js
[![Build Status](http://img.shields.io/travis/liferay/senna.js/master.svg?style=flat)](https://travis-ci.org/liferay/senna.js)

*Senna.js* is a blazing-fast single page application engine that provides several low-level APIs that allows you to build modern web-based applications with only ~12 KB of JavaScript without any dependency.

* [Official website](http://sennajs.com)
* [Website repository](https://github.com/liferay/sennajs.com)
* [Documentation](http://sennajs.com/docs/)
* [API Docs](http://sennajs.com/api/)

## Install

Install via [Bower](http://bower.io/), [npm](https://www.npmjs.com/) or
[download as a zip](https://github.com/liferay/senna.js/archive/master.zip):

```
bower install senna
```

```
npm install senna
```

## Examples

* **[Email Example](http://sennajs.com/examples/email):** *Enable Single Page Apps using only HTML5 data-attributes;*
* **[Gallery Example](http://sennajs.com/examples/gallery):** *Carousel app with history support and cacheable screens;*
* **[Blog Example](http://sennajs.com/examples/blog):** *Infinite scrolling pages done right with history support;*

## Browser Support
      
[![Sauce Test Status](https://saucelabs.com/browser-matrix/senna.svg)](https://travis-ci.org/liferay/senna.js)

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

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/liferay/senna.js/releases).

## Credits

* Inspired by Daniel Pupius' [Surface project](https://github.com/dpup/surface)
* Demo layouts by [Pure CSS](http://purecss.io/)
* Icon made by [Freepik](http://www.freepik.com)

## Team

*Senna.js* is maintained by these people and a bunch of awesome [contributors](https://github.com/liferay/senna.js/graphs/contributors).

[![Eduardo Lundgren](https://2.gravatar.com/avatar/42327de520e674a6d1686845b30778d0)](https://github.com/eduardolundgren) | [![Iliyan Peychev](https://2.gravatar.com/avatar/c2a0cb9ed0d19196b7fe061055c18838)](https://github.com/ipeychev) | [![Pedro Marques](https://2.gravatar.com/avatar/1cf95bc9cee05a0bba25f7529bcdb888)](https://github.com/pedromarks) | [![Zeno Rocha](https://2.gravatar.com/avatar/e190023b66e2b8aa73a842b106920c93)](https://github.com/zenorocha)
--- | --- | --- | --- | ---
[Eduardo Lundgren](https://github.com/eduardolundgren) | [Iliyan Peychev](https://github.com/ipeychev) | [Pedro Marques](https://github.com/pedromarks) | [Zeno Rocha](https://github.com/zenorocha)

## License

[BSD License](https://github.com/liferay/senna.js/blob/master/LICENSE) © Eduardo Lundgren
