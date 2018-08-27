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

* All pull requests should be sent to the `develop` branch, as the `master`
branch should always reflect the most recent release.
* Any merged changes will remain in the `develop` branch until the next
scheduled release.
* The only exception to this rule is for emergency hot fixes, in which case the
pull request can be sent to the `master` branch.
* A Github issue should also be created for any bug fix or feature, this helps
when generating the CHANGELOG.md file.
* All commits in a given pull request should start with the `Fixes #xxx - `
message for traceability purposes.

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

# Releasing

Collaborators with publish permissions should follow these steps.

There are two different workflows for publishing this project, one for scheduled
releases, and one for emergency hot fixes.

## Scheduled release

1. Create a release branch from the updated `develop` branch

```
git checkout develop
git pull upstream develop
git checkout -b release/vX.X.X
```

2. Send release PR to `master`

3. Wait to see that all tests pass and then merge with merge commit

4. Checkout and pull `master` locally

```
git checkout master && git pull upstream master
```

5. Update npm version

```
npm version patch|minor|major
```

6. Generate and commit dist files

```
gulp release
git add .
git commit -m "Build Files (auto-generated)"
```

7. Publish npm modules and push release tags

```
npm publish
git push && git push --tags
```

8. Generate changelog

github_changelog_generator (https://github.com/skywinder/github-changelog-generator)

9. Commit changelog and push to `master`

```
git add CHANGELOG.md
git commit -m "Updates CHANGELOG for vX.X.X"
git push
```

10. Sync `develop` with `master`

```
git checkout develop
git merge master
```

11. Do GitHub release using the pushed vX.X.X tag and the appropriate portion of
CHANGELOG.md

## Hot fix

1. Create a feature branch from `master` (assuming hot fix has already been
merged)

```
git checkout master
git pull upstream master
git checkout -b feature/fix_foo
```

2. Send a fix PR to `master`

3. Follow steps 3-11 of a scheduled release