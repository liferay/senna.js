/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: MIT
 */
"use strict";

import Cacheable from "../../src/cacheable/Cacheable";

describe("Cacheable", () => {
  it("cannot be cacheable by default", () => {
    assert.isTrue(!new Cacheable().isCacheable());
  });

  it("be cacheable", () => {
    const cacheable = new Cacheable();
    cacheable.setCacheable(true);
    assert.isTrue(cacheable.isCacheable());
  });

  it("clear cache when toggle cacheable state", () => {
    const cacheable = new Cacheable();
    cacheable.setCacheable(true);
    cacheable.addCache("data");
    assert.strictEqual("data", cacheable.getCache());
    cacheable.setCacheable(false);
    assert.strictEqual(null, cacheable.getCache());
  });

  it("clear cache on dispose", () => {
    const cacheable = new Cacheable();
    cacheable.setCacheable(true);
    cacheable.addCache("data");
    cacheable.dispose();
    assert.strictEqual(null, cacheable.getCache());
  });
});
