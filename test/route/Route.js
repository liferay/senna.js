"use strict";

import { core } from "metal";
import Route from "../../src/route/Route";

describe("Route", () => {
  describe("Constructor", () => {
    it("throws an error when path and handler not specified", () => {
      assert.throws(() => {
        new Route();
      }, Error);
    });

    it("throws an error when path is null", () => {
      assert.throws(() => {
        new Route(null, core.nullFunction);
      }, Error);
    });

    it("throws an error when path is undefined", () => {
      assert.throws(() => {
        new Route(undefined, core.nullFunction);
      }, Error);
    });

    it("throws an error when handler not specified", () => {
      assert.throws(() => {
        new Route("/path");
      }, Error);
    });

    it("throws an error when handler not a function", () => {
      assert.throws(() => {
        new Route("/path", {});
      }, Error);
    });

    it("not throws an error when handler is a function", () => {
      assert.doesNotThrow(() => {
        new Route("/path", core.nullFunction);
      });
    });

    it("set path and handler from constructor", () => {
      const route = new Route("/path", core.nullFunction);
      assert.strictEqual("/path", route.getPath());
      assert.strictEqual(core.nullFunction, route.getHandler());
    });
  });

  describe("Matching", () => {
    it("match route by string path", () => {
      const route = new Route("/path", core.nullFunction);
      assert.ok(route.matchesPath("/path"));
    });

    it("match route by string path with params", () => {
      const route = new Route("/path/:foo(\\d+)", core.nullFunction);
      assert.ok(route.matchesPath("/path/10"));
      assert.ok(route.matchesPath("/path/10/"));
      assert.ok(!route.matchesPath("/path/abc"));
      assert.ok(!route.matchesPath("/path"));
    });

    it("match route by regex path", () => {
      const route = new Route(/\/path/, core.nullFunction);
      assert.ok(route.matchesPath("/path"));
    });

    it("match route by function path", () => {
      const route = new Route(path => path === "/path", core.nullFunction);
      assert.ok(route.matchesPath("/path"));
    });

    it("not match any route", () => {
      const route = new Route("/path", core.nullFunction);
      assert.ok(!route.matchesPath("/invalid"));
    });

    it("not match any route for invalid path", () => {
      const route = new Route({}, core.nullFunction);
      assert.ok(!route.matchesPath("/invalid"));
    });
  });

  describe("Extracting params", () => {
    it("extract params from path matching route", () => {
      const route = new Route("/path/:foo(\\d+)/:bar(\\w+)", core.nullFunction);
      const params = route.extractParams("/path/123/abc");
      const expected = {
        foo: "123",
        bar: "abc"
      };
      assert.deepEqual(expected, params);
    });

    it("returns null if try to extract params from non matching route", () => {
      const route = new Route("/path/:foo(\\d+)/:bar(\\w+)", core.nullFunction);
      const params = route.extractParams("/path/abc/123");
      assert.strictEqual(null, params);
    });

    it("returns an empty object if trying to extract params from path given as function", () => {
      const route = new Route(core.nullFunction, core.nullFunction);
      const params = route.extractParams("/path/123/abc");
      assert.deepEqual({}, params);
    });
  });
});
