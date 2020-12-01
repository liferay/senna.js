# Contributing Guidelines

If you wish to contribute to Senna.js these guidelines will be important for
you. They cover instructions for setup, information on how the repository is
organized, as well as contribution requirements.

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

## Pull requests & Github issues

* A Github issue should also be created for any bug fix or feature, this helps
when generating the CHANGELOG.md file.

## Tests

Any change (be it an improvement, a new feature or a bug fix) needs to include
a test, and all tests from the repo need to be passing. To run the tests you
can use our npm script:

```
gulp test
```

This will run the complete test suite on Chrome. For a full test pass, you can
add local browsers to the root `karma.js` file and re-run the command.

Additionally, you can also run the test suite via Saucelabs with the following
npm script:

```
gulp test:saucelabs
```

This last command is the one used by our CI integration.

## Formatting

TBD

## JS Docs

All methods should be documented, following [google's format](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler).

## Branch structure

- `master`: corresponds to the 2.x series of releases.
- `3.x`: corresponds to the 3.x series of prereleases.
