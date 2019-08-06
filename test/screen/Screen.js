"use strict";

import dom from "metal-dom";
import Screen from "../../src/screen/Screen";
import Surface from "../../src/surface/Surface";

describe("Screen", () => {
  before(() => {
    // Prevent log messages from showing up in test output.
    sinon.stub(console, "log");
  });

  after(() => {
    console.log.restore();
  });

  it("expose lifecycle activate", () => {
    assert.doesNotThrow(() => {
      new Screen().activate();
    });
  });

  it("expose lifecycle deactivate", () => {
    assert.doesNotThrow(() => {
      new Screen().deactivate();
    });
  });

  it("expose lifecycle beforeActivate", () => {
    assert.doesNotThrow(() => {
      new Screen().beforeActivate();
    });
  });

  it("expose lifecycle beforeDeactivate", () => {
    assert.doesNotThrow(() => {
      new Screen().beforeDeactivate();
    });
  });

  it("expose lifecycle load", () => {
    assert.doesNotThrow(() => {
      new Screen().load();
    });
  });

  it("expose lifecycle getSurfaceContent", () => {
    assert.doesNotThrow(() => {
      new Screen().getSurfaceContent();
    });
  });

  it("expose lifecycle dispose", () => {
    assert.doesNotThrow(() => {
      new Screen().dispose();
    });
  });

  it("expose lifecycle flip", () => {
    assert.doesNotThrow(() => {
      new Screen().flip({});
    });
  });

  it("wait to flip all surfaces", done => {
    const surfaces = {
      surface1: new Surface("surface1"),
      surface2: new Surface("surface2")
    };
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    surfaces.surface1.show = () => {
      stub1();
      return Promise.resolve();
    };
    surfaces.surface2.show = () => {
      stub2();
      return Promise.resolve();
    };
    new Screen().flip(surfaces).then(() => {
      assert.strictEqual(1, stub1.callCount);
      assert.strictEqual(1, stub2.callCount);
      done();
    });
  });

  it("get screen id", () => {
    const screen = new Screen();
    assert.ok(screen.getId());
    screen.setId("otherId");
    assert.strictEqual("otherId", screen.getId());
  });

  it("get screen title", () => {
    const screen = new Screen();
    assert.strictEqual(null, screen.getTitle());
    screen.setTitle("other");
    assert.strictEqual("other", screen.getTitle());
  });

  it("check if object implements a screen", () => {
    assert.ok(Screen.isImplementedBy(new Screen()));
  });

  it("evaluate surface scripts", done => {
    enterDocumentSurfaceElement(
      "surfaceId",
      "<script>window.sentinel=true;</script>"
    );
    const surface = new Surface("surfaceId");
    const screen = new Screen();
    assert.ok(!window.sentinel);
    screen
      .evaluateScripts({
        surfaceId: surface
      })
      .then(() => {
        assert.ok(window.sentinel);
        delete window.sentinel;
        exitDocumentSurfaceElement("surfaceId");
        done();
      });
  });

  it("evaluate surface styles", done => {
    enterDocumentSurfaceElement(
      "surfaceId",
      "<style>body{background-color:rgb(0, 255, 0);}</style>"
    );
    const surface = new Surface("surfaceId");
    const screen = new Screen();
    screen
      .evaluateStyles({
        surfaceId: surface
      })
      .then(() => {
        assertComputedStyle("backgroundColor", "rgb(0, 255, 0)");
        exitDocumentSurfaceElement("surfaceId");
        done();
      });
  });
});

function enterDocumentSurfaceElement(surfaceId, opt_content) {
  dom.enterDocument(
    `<div id="${surfaceId}">${opt_content ? opt_content : ""}</div>`
  );
  return document.getElementById(surfaceId);
}

function exitDocumentSurfaceElement(surfaceId) {
  return dom.exitDocument(document.getElementById(surfaceId));
}

function assertComputedStyle(property, value) {
  assert.strictEqual(
    value,
    window.getComputedStyle(document.body, null)[property]
  );
}
