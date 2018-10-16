# Change Log

## [Unreleased](https://github.com/liferay/senna.js/tree/HEAD)

[Full Changelog](https://github.com/liferay/senna.js/compare/v2.6.2...HEAD)

**Closed issues:**

- Version constant isn't available when loading by babel [\#284](https://github.com/liferay/senna.js/issues/284)

**Merged pull requests:**

- Makes version constraint be consistent [\#283](https://github.com/liferay/senna.js/pull/283) ([diegonvs](https://github.com/diegonvs))

## [v2.6.2](https://github.com/liferay/senna.js/tree/v2.6.2) (2018-09-20)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.6.1...v2.6.2)

**Closed issues:**

- On IE11, a data provider send twice in IE11 when load content [\#281](https://github.com/liferay/senna.js/issues/281)

**Merged pull requests:**

- Fixes \#281 | Use a contextual fragment to avoid updating node.innerHTML twice [\#282](https://github.com/liferay/senna.js/pull/282) ([diegonvs](https://github.com/diegonvs))
- Fixes "IE only" tests to run only on IE [\#277](https://github.com/liferay/senna.js/pull/277) ([diegonvs](https://github.com/diegonvs))

## [v2.6.1](https://github.com/liferay/senna.js/tree/v2.6.1) (2018-08-29)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.6.0...v2.6.1)

**Closed issues:**

- Remove the console.log when publishing [\#272](https://github.com/liferay/senna.js/issues/272)
- Different ports are considered same origin [\#254](https://github.com/liferay/senna.js/issues/254)

**Merged pull requests:**

- Remove the console.log when publishing [\#273](https://github.com/liferay/senna.js/pull/273) ([matuzalemsteles](https://github.com/matuzalemsteles))

## [v2.6.0](https://github.com/liferay/senna.js/tree/v2.6.0) (2018-08-27)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.6...v2.6.0)

**Closed issues:**

- Cancel navigation duplicates surfaces [\#262](https://github.com/liferay/senna.js/issues/262)

**Merged pull requests:**

- Add rule not to remove the screen being used in a pending navigation [\#271](https://github.com/liferay/senna.js/pull/271) ([matuzalemsteles](https://github.com/matuzalemsteles))
- Adds retries option to referrer flaky test [\#270](https://github.com/liferay/senna.js/pull/270) ([diegonvs](https://github.com/diegonvs))

## [v2.5.6](https://github.com/liferay/senna.js/tree/v2.5.6) (2018-06-12)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.5...v2.5.6)

**Merged pull requests:**

- Updating some dependencies [\#261](https://github.com/liferay/senna.js/pull/261) ([diegonvs](https://github.com/diegonvs))

## [v2.5.5](https://github.com/liferay/senna.js/tree/v2.5.5) (2018-06-09)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.3...v2.5.5)

**Closed issues:**

- examples on the home page don't seem to work? [\#255](https://github.com/liferay/senna.js/issues/255)

**Merged pull requests:**

- Fixing behaviour when submitting a form with XMLHttpRequest fails when the form has an empty file input element on Safari 11.1 [\#260](https://github.com/liferay/senna.js/pull/260) ([diegonvs](https://github.com/diegonvs))
- Fix issue where navigation breaks when Screen returns null history state [\#259](https://github.com/liferay/senna.js/pull/259) ([brunobasto](https://github.com/brunobasto))

## [v2.5.3](https://github.com/liferay/senna.js/tree/v2.5.3) (2018-03-28)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.2...v2.5.3)

## [v2.5.2](https://github.com/liferay/senna.js/tree/v2.5.2) (2018-03-28)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.1...v2.5.2)

## [v2.5.1](https://github.com/liferay/senna.js/tree/v2.5.1) (2018-03-26)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.5.0...v2.5.1)

**Fixed bugs:**

- document.referrer is not updated on navigation [\#238](https://github.com/liferay/senna.js/issues/238)

**Closed issues:**

- Customize loading bar color in Liferay DXP fixpack 36 [\#249](https://github.com/liferay/senna.js/issues/249)

**Merged pull requests:**

- Clarifies status and support of the project [\#258](https://github.com/liferay/senna.js/pull/258) ([jbalsas](https://github.com/jbalsas))
- Updating iphone supported version for saucelabs [\#257](https://github.com/liferay/senna.js/pull/257) ([diegonvs](https://github.com/diegonvs))
- canNavigate now check host instead hostname [\#256](https://github.com/liferay/senna.js/pull/256) ([diegonvs](https://github.com/diegonvs))
- Build files [\#252](https://github.com/liferay/senna.js/pull/252) ([brunobasto](https://github.com/brunobasto))
- Updating copyright year [\#248](https://github.com/liferay/senna.js/pull/248) ([diegonvs](https://github.com/diegonvs))
- Updates document.referrer after navigations [\#246](https://github.com/liferay/senna.js/pull/246) ([brunobasto](https://github.com/brunobasto))
- Updates document.referrer upon history update [\#240](https://github.com/liferay/senna.js/pull/240) ([brunobasto](https://github.com/brunobasto))

## [v2.5.0](https://github.com/liferay/senna.js/tree/v2.5.0) (2017-12-12)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.4.2...v2.5.0)

**Fixed bugs:**

- window.onbeforeunload not warning when navigating or on popstate [\#212](https://github.com/liferay/senna.js/issues/212)
- Issue that fragment is lost when navigating to different page with fragment \(\#hash\) [\#141](https://github.com/liferay/senna.js/issues/141)
- Navigation breaks when response is redirected to an external location [\#120](https://github.com/liferay/senna.js/issues/120)

**Closed issues:**

- Allow beforeDeactivate to return promise, and create similar lifecycle method for before activation [\#235](https://github.com/liferay/senna.js/issues/235)
- Uncaught TypeError: \_senna2.default.App is not a constructor [\#230](https://github.com/liferay/senna.js/issues/230)
- Broken Favicon with IE11 [\#228](https://github.com/liferay/senna.js/issues/228)
- Cannot redirect to a URL of different domain while SPA is enabled  [\#223](https://github.com/liferay/senna.js/issues/223)
- Anchor link offset are not calculated correctly [\#221](https://github.com/liferay/senna.js/issues/221)
- File size [\#158](https://github.com/liferay/senna.js/issues/158)
- Follow 301 redirects [\#151](https://github.com/liferay/senna.js/issues/151)

**Merged pull requests:**

- Allow beforeDeactivate to return a promise, add beforeActivate Screen lifecycle method [\#236](https://github.com/liferay/senna.js/pull/236) ([robframpton](https://github.com/robframpton))

## [v2.4.2](https://github.com/liferay/senna.js/tree/v2.4.2) (2017-08-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.4.1...v2.4.2)

## [v2.4.1](https://github.com/liferay/senna.js/tree/v2.4.1) (2017-08-10)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.3.4...v2.4.1)

**Merged pull requests:**

- Avoids breaking change on the error handling contract [\#226](https://github.com/liferay/senna.js/pull/226) ([brunobasto](https://github.com/brunobasto))

## [v2.3.4](https://github.com/liferay/senna.js/tree/v2.3.4) (2017-07-19)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.3.3...v2.3.4)

## [v2.3.3](https://github.com/liferay/senna.js/tree/v2.3.3) (2017-07-19)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.3.2...v2.3.3)

## [v2.3.2](https://github.com/liferay/senna.js/tree/v2.3.2) (2017-07-13)
[Full Changelog](https://github.com/liferay/senna.js/compare/rm...v2.3.2)

## [rm](https://github.com/liferay/senna.js/tree/rm) (2017-07-13)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.3.1...rm)

**Fixed bugs:**

- Cannot dispatch navigate for urls with fragments [\#167](https://github.com/liferay/senna.js/issues/167)

**Merged pull requests:**

- Anchor link offset are not calculated correctly [\#220](https://github.com/liferay/senna.js/pull/220) ([dacousalr](https://github.com/dacousalr))
- Suggestion: Makes a browser standard implementation private [\#219](https://github.com/liferay/senna.js/pull/219) ([fernandosouza](https://github.com/fernandosouza))
- Avoiding changing browser context by preventing that the target \_blank anchor navigate [\#218](https://github.com/liferay/senna.js/pull/218) ([fernandosouza](https://github.com/fernandosouza))

## [v2.3.1](https://github.com/liferay/senna.js/tree/v2.3.1) (2017-06-10)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.3.0...v2.3.1)

## [v2.3.0](https://github.com/liferay/senna.js/tree/v2.3.0) (2017-06-10)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.2.0...v2.3.0)

## [v2.2.0](https://github.com/liferay/senna.js/tree/v2.2.0) (2017-06-08)
[Full Changelog](https://github.com/liferay/senna.js/compare/2.1.10...v2.2.0)

**Merged pull requests:**

- Fixes some bugs by normalizing paths - Updated [\#215](https://github.com/liferay/senna.js/pull/215) ([fernandosouza](https://github.com/fernandosouza))

## [2.1.10](https://github.com/liferay/senna.js/tree/2.1.10) (2017-05-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.8...2.1.10)

## [v2.1.8](https://github.com/liferay/senna.js/tree/v2.1.8) (2017-05-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.7...v2.1.8)

## [v2.1.7](https://github.com/liferay/senna.js/tree/v2.1.7) (2017-05-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.6...v2.1.7)

## [v2.1.6](https://github.com/liferay/senna.js/tree/v2.1.6) (2017-05-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.5...v2.1.6)

**Fixed bugs:**

- Senna doesn't respect link target attribute [\#211](https://github.com/liferay/senna.js/issues/211)

**Closed issues:**

- Anchor links are dropped [\#207](https://github.com/liferay/senna.js/issues/207)
- examples are outdated [\#206](https://github.com/liferay/senna.js/issues/206)
- POST request from form submission missing certain input types [\#199](https://github.com/liferay/senna.js/issues/199)

**Merged pull requests:**

- Ignores links with target \_blank [\#217](https://github.com/liferay/senna.js/pull/217) ([fernandosouza](https://github.com/fernandosouza))
- Adds the latest versions of Safari, Chrome and Firefore 10 in supported browsers list [\#210](https://github.com/liferay/senna.js/pull/210) ([fernandosouza](https://github.com/fernandosouza))
- Make sure that the second back will be trigger before the navigation [\#209](https://github.com/liferay/senna.js/pull/209) ([fernandosouza](https://github.com/fernandosouza))

## [v2.1.5](https://github.com/liferay/senna.js/tree/v2.1.5) (2017-03-15)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.4...v2.1.5)

**Merged pull requests:**

- Updates dev dependencies [\#204](https://github.com/liferay/senna.js/pull/204) ([brunobasto](https://github.com/brunobasto))
- Includes submit button value into FormData [\#203](https://github.com/liferay/senna.js/pull/203) ([brunobasto](https://github.com/brunobasto))

## [v2.1.4](https://github.com/liferay/senna.js/tree/v2.1.4) (2017-03-10)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.3...v2.1.4)

**Closed issues:**

- Why does the build folder is not ignored by Git [\#194](https://github.com/liferay/senna.js/issues/194)
- How to handle response after form submit. [\#193](https://github.com/liferay/senna.js/issues/193)
- Meta tags [\#191](https://github.com/liferay/senna.js/issues/191)
- Review saucelabs connection [\#178](https://github.com/liferay/senna.js/issues/178)
- More advanced example [\#169](https://github.com/liferay/senna.js/issues/169)

**Merged pull requests:**

- Build [\#201](https://github.com/liferay/senna.js/pull/201) ([brunobasto](https://github.com/brunobasto))

## [v2.1.3](https://github.com/liferay/senna.js/tree/v2.1.3) (2017-01-06)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.2...v2.1.3)

**Closed issues:**

- Adds Saucelabs encripted key in .travis.yml file [\#187](https://github.com/liferay/senna.js/issues/187)
- If the HTML title contains character entities, the title bar / tab does not render correctly [\#185](https://github.com/liferay/senna.js/issues/185)
- SennaJS jumps to the top of page after navigation. [\#184](https://github.com/liferay/senna.js/issues/184)
- Senna Loading Bar CSS duplicate [\#181](https://github.com/liferay/senna.js/issues/181)

**Merged pull requests:**

- Adds jwt security. Closes \#187 [\#189](https://github.com/liferay/senna.js/pull/189) ([fernandosouza](https://github.com/fernandosouza))
- Uses title HTML tag whenever is possible to update the page title. Closes \#185 [\#186](https://github.com/liferay/senna.js/pull/186) ([fernandosouza](https://github.com/fernandosouza))

## [v2.1.2](https://github.com/liferay/senna.js/tree/v2.1.2) (2016-12-22)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.1...v2.1.2)

## [v2.1.1](https://github.com/liferay/senna.js/tree/v2.1.1) (2016-12-21)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.1.0...v2.1.1)

**Merged pull requests:**

- Adds check if window and document are defined before assigning to globals [\#182](https://github.com/liferay/senna.js/pull/182) ([pragmaticivan](https://github.com/pragmaticivan))

## [v2.1.0](https://github.com/liferay/senna.js/tree/v2.1.0) (2016-12-16)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.5...v2.1.0)

**Merged pull requests:**

- Passes original dom event object to beforeNavigate payload [\#179](https://github.com/liferay/senna.js/pull/179) ([mairatma](https://github.com/mairatma))
- Removes search \(query string\) from regex parser [\#177](https://github.com/liferay/senna.js/pull/177) ([pragmaticivan](https://github.com/pragmaticivan))

## [v2.0.5](https://github.com/liferay/senna.js/tree/v2.0.5) (2016-12-13)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.4...v2.0.5)

**Merged pull requests:**

- Allows external events access to http error codes [\#176](https://github.com/liferay/senna.js/pull/176) ([DrummerSi](https://github.com/DrummerSi))

## [v2.0.4](https://github.com/liferay/senna.js/tree/v2.0.4) (2016-10-19)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.3...v2.0.4)

**Closed issues:**

- Integrate with rollupjs [\#175](https://github.com/liferay/senna.js/issues/175)
- It's adding 2 assets when using wiredep  [\#174](https://github.com/liferay/senna.js/issues/174)

## [v2.0.3](https://github.com/liferay/senna.js/tree/v2.0.3) (2016-10-14)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.2...v2.0.3)

## [v2.0.2](https://github.com/liferay/senna.js/tree/v2.0.2) (2016-10-07)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.1...v2.0.2)

## [v2.0.1](https://github.com/liferay/senna.js/tree/v2.0.1) (2016-10-05)
[Full Changelog](https://github.com/liferay/senna.js/compare/v2.0.0...v2.0.1)

## [v2.0.0](https://github.com/liferay/senna.js/tree/v2.0.0) (2016-10-05)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.5.3...v2.0.0)

**Fixed bugs:**

- Image fails to show up when using senna with main route file that is not on the url's root [\#131](https://github.com/liferay/senna.js/issues/131)

**Closed issues:**

- Track url changes [\#173](https://github.com/liferay/senna.js/issues/173)
- When senna ready event [\#171](https://github.com/liferay/senna.js/issues/171)
- Regular expression not matched for manually created routes [\#168](https://github.com/liferay/senna.js/issues/168)

**Merged pull requests:**

- Fixes version of sinon to 1.17.2 [\#165](https://github.com/liferay/senna.js/pull/165) ([mairatma](https://github.com/mairatma))
- Updates Metal.js to v2.0.0 [\#164](https://github.com/liferay/senna.js/pull/164) ([mairatma](https://github.com/mairatma))
- update for issue \#136 [\#163](https://github.com/liferay/senna.js/pull/163) ([mjbradford89](https://github.com/mjbradford89))
- avoid using setTimeout and CDN in load test [\#162](https://github.com/liferay/senna.js/pull/162) ([mjbradford89](https://github.com/mjbradford89))

## [v1.5.3](https://github.com/liferay/senna.js/tree/v1.5.3) (2016-07-07)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.5.2...v1.5.3)

**Merged pull requests:**

- Revert changes related to issue \#136 [\#161](https://github.com/liferay/senna.js/pull/161) ([mjbradford89](https://github.com/mjbradford89))
- fix safari and chrome mobile test failures [\#160](https://github.com/liferay/senna.js/pull/160) ([mjbradford89](https://github.com/mjbradford89))
- Fix test failures [\#159](https://github.com/liferay/senna.js/pull/159) ([mjbradford89](https://github.com/mjbradford89))

## [v1.5.2](https://github.com/liferay/senna.js/tree/v1.5.2) (2016-07-07)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.5.1...v1.5.2)

**Fixed bugs:**

- SF [\#138](https://github.com/liferay/senna.js/pull/138) ([brunobasto](https://github.com/brunobasto))

## [v1.5.1](https://github.com/liferay/senna.js/tree/v1.5.1) (2016-07-02)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.5.0...v1.5.1)

## [v1.5.0](https://github.com/liferay/senna.js/tree/v1.5.0) (2016-07-01)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.4.0...v1.5.0)

**Closed issues:**

- Trackable resources aren't removing js files [\#153](https://github.com/liferay/senna.js/issues/153)
- Senna not working on HTTPS pages [\#152](https://github.com/liferay/senna.js/issues/152)
- IE11 -  Page can be flipped before resources have finished loading [\#148](https://github.com/liferay/senna.js/issues/148)

**Merged pull requests:**

- Senna not working on HTTPS pages \#152 [\#157](https://github.com/liferay/senna.js/pull/157) ([mjbradford89](https://github.com/mjbradford89))
- Uses babel-preset-metal instead of babel-preset-es2015 [\#154](https://github.com/liferay/senna.js/pull/154) ([mairatma](https://github.com/mairatma))

## [v1.4.0](https://github.com/liferay/senna.js/tree/v1.4.0) (2016-06-23)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.3.0...v1.4.0)

**Fixed bugs:**

- Fix blog demo [\#108](https://github.com/liferay/senna.js/issues/108)

## [v1.3.0](https://github.com/liferay/senna.js/tree/v1.3.0) (2016-06-20)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.2.0...v1.3.0)

**Fixed bugs:**

- Html tag attributes do not keep [\#130](https://github.com/liferay/senna.js/issues/130)
- Issue with default surface and turbolinks [\#111](https://github.com/liferay/senna.js/issues/111)

**Closed issues:**

- Document \[data-senna-track\] attribute [\#137](https://github.com/liferay/senna.js/issues/137)
- Getting senna working with custom paths \(wordpress\) [\#121](https://github.com/liferay/senna.js/issues/121)
- Your use of almost washed-out color Type on your web-site makes text unreadable [\#117](https://github.com/liferay/senna.js/issues/117)
- New website [\#116](https://github.com/liferay/senna.js/issues/116)
- Make Senna available in a CDN [\#103](https://github.com/liferay/senna.js/issues/103)
- Non-programmatically prefetching [\#67](https://github.com/liferay/senna.js/issues/67)
- Adds view source button on examples [\#43](https://github.com/liferay/senna.js/issues/43)

**Merged pull requests:**

- Uses default listeners from Metal.js [\#146](https://github.com/liferay/senna.js/pull/146) ([mairatma](https://github.com/mairatma))
- create amd basic example [\#144](https://github.com/liferay/senna.js/pull/144) ([mjbradford89](https://github.com/mjbradford89))
- rename tracked resources to trackable resources [\#143](https://github.com/liferay/senna.js/pull/143) ([mjbradford89](https://github.com/mjbradford89))
- Create tracked resources example [\#142](https://github.com/liferay/senna.js/pull/142) ([mjbradford89](https://github.com/mjbradford89))

## [v1.2.0](https://github.com/liferay/senna.js/tree/v1.2.0) (2016-05-25)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.1.2...v1.2.0)

## [v1.1.2](https://github.com/liferay/senna.js/tree/v1.1.2) (2016-05-17)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.1.0...v1.1.2)

**Merged pull requests:**

- Creates new entry file that exports most important senna modules [\#135](https://github.com/liferay/senna.js/pull/135) ([mairatma](https://github.com/mairatma))

## [v1.1.0](https://github.com/liferay/senna.js/tree/v1.1.0) (2016-05-17)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.4...v1.1.0)

**Merged pull requests:**

- Precompiles code to commonjs when published [\#134](https://github.com/liferay/senna.js/pull/134) ([mairatma](https://github.com/mairatma))

## [v1.0.4](https://github.com/liferay/senna.js/tree/v1.0.4) (2016-04-22)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.3...v1.0.4)

**Closed issues:**

- IE11/Edge form submit - 302 redirect to same page will serve cached content [\#126](https://github.com/liferay/senna.js/issues/126)

**Merged pull requests:**

- Build [\#129](https://github.com/liferay/senna.js/pull/129) ([brunobasto](https://github.com/brunobasto))

## [v1.0.3](https://github.com/liferay/senna.js/tree/v1.0.3) (2016-04-21)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.2...v1.0.3)

**Closed issues:**

- Senna.js doesn't work with route set to "/" when base path is set [\#127](https://github.com/liferay/senna.js/issues/127)
- IE11 does not apply temporary annotated style sheets after navigation [\#124](https://github.com/liferay/senna.js/issues/124)

**Merged pull requests:**

- Fixes bug with having "/" route with base path - Fixes \#127 [\#128](https://github.com/liferay/senna.js/pull/128) ([mairatma](https://github.com/mairatma))

## [v1.0.2](https://github.com/liferay/senna.js/tree/v1.0.2) (2016-04-13)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.1...v1.0.2)

**Closed issues:**

- updateScrollPosition not working [\#122](https://github.com/liferay/senna.js/issues/122)

**Merged pull requests:**

- Mutate styles hrefs to be unique for IE to prevent caching issues [\#125](https://github.com/liferay/senna.js/pull/125) ([mjbradford89](https://github.com/mjbradford89))
- Updates dependencies [\#123](https://github.com/liferay/senna.js/pull/123) ([mairatma](https://github.com/mairatma))

## [v1.0.1](https://github.com/liferay/senna.js/tree/v1.0.1) (2016-03-14)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0...v1.0.1)

**Merged pull requests:**

- Updates dependencies [\#119](https://github.com/liferay/senna.js/pull/119) ([mairatma](https://github.com/mairatma))

## [v1.0.0](https://github.com/liferay/senna.js/tree/v1.0.0) (2016-03-03)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.6...v1.0.0)

**Fixed bugs:**

- Swipe back gestureon IOs doesn't work [\#100](https://github.com/liferay/senna.js/issues/100)

**Closed issues:**

- RequestScreen getRequestPath doesn't work on IE [\#118](https://github.com/liferay/senna.js/issues/118)
- Improve surfaces behavior to not require default content only via "surface-default" element [\#102](https://github.com/liferay/senna.js/issues/102)
- Script load error: 404 with relative URLs [\#85](https://github.com/liferay/senna.js/issues/85)
- Use feature detection to disable senna when used in a unsupported browser environment [\#60](https://github.com/liferay/senna.js/issues/60)
- Make Senna.js work for form elements [\#59](https://github.com/liferay/senna.js/issues/59)

## [v1.0.0-alpha.6](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.6) (2016-02-25)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.5...v1.0.0-alpha.6)

## [v1.0.0-alpha.5](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.5) (2016-02-19)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.4...v1.0.0-alpha.5)

## [v1.0.0-alpha.4](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.4) (2016-02-18)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.3...v1.0.0-alpha.4)

**Closed issues:**

- Pull requests tests failing due to security restrictions on SauceLabs [\#110](https://github.com/liferay/senna.js/issues/110)
- Error with slug when used in some browsers [\#107](https://github.com/liferay/senna.js/issues/107)

## [v1.0.0-alpha.3](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.3) (2016-02-09)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.2...v1.0.0-alpha.3)

## [v1.0.0-alpha.2](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.2) (2016-02-03)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha.1...v1.0.0-alpha.2)

**Merged pull requests:**

- Adds build folder to the package.json files [\#114](https://github.com/liferay/senna.js/pull/114) ([mairatma](https://github.com/mairatma))
- Gets metal dependencies from npm instead of from bower [\#113](https://github.com/liferay/senna.js/pull/113) ([mairatma](https://github.com/mairatma))

## [v1.0.0-alpha.1](https://github.com/liferay/senna.js/tree/v1.0.0-alpha.1) (2016-01-25)
[Full Changelog](https://github.com/liferay/senna.js/compare/v1.0.0-alpha...v1.0.0-alpha.1)

## [v1.0.0-alpha](https://github.com/liferay/senna.js/tree/v1.0.0-alpha) (2016-01-11)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.4.2...v1.0.0-alpha)

**Closed issues:**

- Cache invalidation [\#68](https://github.com/liferay/senna.js/issues/68)

**Merged pull requests:**

- Adding Microsoft Edge on the SauceLabs capabilities matrix. [\#109](https://github.com/liferay/senna.js/pull/109) ([henvic](https://github.com/henvic))

## [v0.4.2](https://github.com/liferay/senna.js/tree/v0.4.2) (2015-12-22)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.4.1...v0.4.2)

**Closed issues:**

- \<link rel="senna-route"...\> not work for me [\#99](https://github.com/liferay/senna.js/issues/99)
- How i can run router handler after first page load  [\#98](https://github.com/liferay/senna.js/issues/98)
- Integrate appveyor for Windows based CI or find a way to test in Safari [\#94](https://github.com/liferay/senna.js/issues/94)
- Safari/Windows: '\[object MouseEventConstructor\]' is not a constructor \(evaluating 'new MouseEvent\(type, modifiers\)'\) [\#93](https://github.com/liferay/senna.js/issues/93)
- Safari/Windows: "endNavigate" event is not triggered in the test to remember the scroll position [\#92](https://github.com/liferay/senna.js/issues/92)
- Safari/Windows: Test for aborting the request is not working [\#91](https://github.com/liferay/senna.js/issues/91)
- The vertical height is not maintained after Surface flip [\#90](https://github.com/liferay/senna.js/issues/90)
- Blog example [\#83](https://github.com/liferay/senna.js/issues/83)
- Scroll position on the email demo [\#55](https://github.com/liferay/senna.js/issues/55)
- Adds browser stack or sauce labs integration [\#52](https://github.com/liferay/senna.js/issues/52)
- Adds point of interests on examples [\#44](https://github.com/liferay/senna.js/issues/44)
- Make the "table of contents" fixed  [\#33](https://github.com/liferay/senna.js/issues/33)
- Improve Blog responsive sidebar usability [\#29](https://github.com/liferay/senna.js/issues/29)
- Improve gallery demo usability [\#28](https://github.com/liferay/senna.js/issues/28)
- Adds web components [\#9](https://github.com/liferay/senna.js/issues/9)

## [v0.4.1](https://github.com/liferay/senna.js/tree/v0.4.1) (2015-06-03)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.4.0...v0.4.1)

**Closed issues:**

- Using .on\('startNavigate' doesn't allow me to update the event.path before the request is sent. [\#96](https://github.com/liferay/senna.js/issues/96)
- Rename project due to copyright violations [\#95](https://github.com/liferay/senna.js/issues/95)

## [v0.4.0](https://github.com/liferay/senna.js/tree/v0.4.0) (2015-04-28)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.3.1...v0.4.0)

**Closed issues:**

- Prevent click a link from jumping to top of page in jQuery [\#88](https://github.com/liferay/senna.js/issues/88)
- How to add screen deactivate transition? [\#87](https://github.com/liferay/senna.js/issues/87)
- Dynamic body id or class [\#86](https://github.com/liferay/senna.js/issues/86)
- Scripts being called twice [\#84](https://github.com/liferay/senna.js/issues/84)

**Merged pull requests:**

- Issue \#96 - Add resolvePath attribute to App [\#97](https://github.com/liferay/senna.js/pull/97) ([bryceosterhaus](https://github.com/bryceosterhaus))

## [v0.3.1](https://github.com/liferay/senna.js/tree/v0.3.1) (2014-12-09)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.3.0...v0.3.1)

**Closed issues:**

- Changes the main property in bower.json [\#81](https://github.com/liferay/senna.js/issues/81)

**Merged pull requests:**

- Changes the main property for more integration with rails [\#82](https://github.com/liferay/senna.js/pull/82) ([davidguilherme](https://github.com/davidguilherme))

## [v0.3.0](https://github.com/liferay/senna.js/tree/v0.3.0) (2014-12-01)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.2.1...v0.3.0)

**Fixed bugs:**

- No loading on scroll occurs if screen is bigger than content [\#49](https://github.com/liferay/senna.js/issues/49)

**Closed issues:**

- Implement ignore links [\#77](https://github.com/liferay/senna.js/issues/77)
- Would be able to use sennajs with angularjs? [\#70](https://github.com/liferay/senna.js/issues/70)
- Semantic way for loading styles [\#69](https://github.com/liferay/senna.js/issues/69)
- Senna's behavior for plain JS and Data Attributes [\#64](https://github.com/liferay/senna.js/issues/64)
- Add test case for firefox right mouse button triggering bug [\#61](https://github.com/liferay/senna.js/issues/61)
- Non-HTML5 support [\#34](https://github.com/liferay/senna.js/issues/34)

**Merged pull requests:**

- Adding more tests [\#78](https://github.com/liferay/senna.js/pull/78) ([henvic](https://github.com/henvic))
- Adding code coverage to route. [\#74](https://github.com/liferay/senna.js/pull/74) ([henvic](https://github.com/henvic))
- Add .project to .gitignore to play nice with Eclipse [\#65](https://github.com/liferay/senna.js/pull/65) ([FagnerMartinsBrack](https://github.com/FagnerMartinsBrack))
- Should check if attribute exists in order to throw Error [\#62](https://github.com/liferay/senna.js/pull/62) ([FagnerMartinsBrack](https://github.com/FagnerMartinsBrack))
- Firefox on Windows triggers the click event for the right mouse button [\#58](https://github.com/liferay/senna.js/pull/58) ([FagnerMartinsBrack](https://github.com/FagnerMartinsBrack))

## [v0.2.1](https://github.com/liferay/senna.js/tree/v0.2.1) (2014-09-10)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.2.0...v0.2.1)

**Closed issues:**

- Console thowing error when "gulp watch" [\#48](https://github.com/liferay/senna.js/issues/48)
- Reload bug [\#39](https://github.com/liferay/senna.js/issues/39)

## [v0.2.0](https://github.com/liferay/senna.js/tree/v0.2.0) (2014-09-03)
[Full Changelog](https://github.com/liferay/senna.js/compare/v0.1.0...v0.2.0)

**Closed issues:**

- Senna should not handle states that are not ours [\#51](https://github.com/liferay/senna.js/issues/51)
- Adds ability to handle xhr error status [\#50](https://github.com/liferay/senna.js/issues/50)
- Adds travis integration [\#45](https://github.com/liferay/senna.js/issues/45)
- Create a page "thanks for downloading" [\#32](https://github.com/liferay/senna.js/issues/32)
- Change repository link on the navigation [\#31](https://github.com/liferay/senna.js/issues/31)

**Merged pull requests:**

- Put author back to package.json to fix build [\#35](https://github.com/liferay/senna.js/pull/35) ([tadeuzagallo](https://github.com/tadeuzagallo))
- Correção da URL do exemplo do blog da McLaren [\#30](https://github.com/liferay/senna.js/pull/30) ([castroalves](https://github.com/castroalves))
- Fix url website repository [\#26](https://github.com/liferay/senna.js/pull/26) ([mateusortiz](https://github.com/mateusortiz))

## [v0.1.0](https://github.com/liferay/senna.js/tree/v0.1.0) (2014-08-21)
**Closed issues:**

- Adds data attribute handler to initialize senna.App [\#20](https://github.com/liferay/senna.js/issues/20)
- Fixes scroll history handling when back or forward pages doesn't have enough height to scroll to the history position [\#19](https://github.com/liferay/senna.js/issues/19)
- Cacheable screens are not caching the correct content [\#18](https://github.com/liferay/senna.js/issues/18)
- Allows surfaces to be created before domready [\#17](https://github.com/liferay/senna.js/issues/17)
- Adds Route utility [\#16](https://github.com/liferay/senna.js/issues/16)
- Adds EventEmitter utility [\#15](https://github.com/liferay/senna.js/issues/15)
- Adds Cacheable utility [\#14](https://github.com/liferay/senna.js/issues/14)
- Adds core utilities [\#13](https://github.com/liferay/senna.js/issues/13)
- Adds senna css utility [\#12](https://github.com/liferay/senna.js/issues/12)
- Register names [\#11](https://github.com/liferay/senna.js/issues/11)
- Adds tests [\#10](https://github.com/liferay/senna.js/issues/10)
- Adds HTMLScreen utility class [\#8](https://github.com/liferay/senna.js/issues/8)
- Adds Screen utility class [\#7](https://github.com/liferay/senna.js/issues/7)
- Adds Surface utility class [\#6](https://github.com/liferay/senna.js/issues/6)
- Adds App utility class [\#5](https://github.com/liferay/senna.js/issues/5)
- Adds inherits utility [\#4](https://github.com/liferay/senna.js/issues/4)
- Adds parse content utility [\#3](https://github.com/liferay/senna.js/issues/3)
- Adds promise layer [\#2](https://github.com/liferay/senna.js/issues/2)
- Adds transport layer [\#1](https://github.com/liferay/senna.js/issues/1)

**Merged pull requests:**

- Add missing surface data attribute to the email example [\#21](https://github.com/liferay/senna.js/pull/21) ([henvic](https://github.com/henvic))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*