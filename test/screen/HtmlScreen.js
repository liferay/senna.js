"use strict";

import dom from "metal-dom";
import globals from "../../src/globals/globals";
import HtmlScreen from "../../src/screen/HtmlScreen";
import Surface from "../../src/surface/Surface";
import utils from "../../src/utils/utils";
import Uri from "metal-uri";

describe("HtmlScreen", () => {
  beforeEach(() => {
    // Prevent log messages from showing up in test output.
    sinon.stub(console, "log");
    sinon.stub(window, "fetch");
  });

  afterEach(() => {
    console.log.restore();
    window.fetch.restore();
  });

  it("get title selector", () => {
    const screen = new HtmlScreen();
    assert.strictEqual("title", screen.getTitleSelector());
    screen.setTitleSelector("div.title");
    assert.strictEqual("div.title", screen.getTitleSelector());
  });

  it("returns loaded content", done => {
    const screen = new HtmlScreen();

    window.fetch.returns(
      Promise.resolve(new Response("content", { status: 200 }))
    );

    screen.load("/url").then(content => {
      assert.strictEqual("content", content);
      done();
    });
  });

  it("set title from response content", done => {
    const screen = new HtmlScreen();

    window.fetch.returns(
      Promise.resolve(new Response("<title>new</title>", { status: 200 }))
    );

    screen.load("/url").then(() => {
      assert.strictEqual("new", screen.getTitle());
      done();
    });
  });

  it("not set title from response content if not present", done => {
    const screen = new HtmlScreen();

    window.fetch.returns(Promise.resolve(new Response("", { status: 200 })));

    screen.load("/url").then(() => {
      assert.strictEqual(null, screen.getTitle());
      done();
    });
  });

  it("copy surface root node attributes from response content", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<html attributeA="valueA"><div id="surfaceId">surface</div></html>'
    );
    screen.flip([]).then(() => {
      assert.strictEqual(
        "valueA",
        document.documentElement.getAttribute("attributeA")
      );
      done();
    });
  });

  it("extract surface content from response content", () => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<div id="surfaceId">surface</div>'
    );
    assert.strictEqual("surface", screen.getSurfaceContent("surfaceId"));
    screen.allocateVirtualDocumentForContent(
      '<div id="surfaceId">surface</div>'
    );
    assert.strictEqual(undefined, screen.getSurfaceContent("surfaceIdInvalid"));
  });

  it("extract surface content from response content default child if present", () => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>'
    );
    assert.strictEqual("surface", screen.getSurfaceContent("surfaceId"));
    screen.allocateVirtualDocumentForContent(
      '<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>'
    );
    assert.strictEqual(undefined, screen.getSurfaceContent("surfaceIdInvalid"));
  });

  it("release virtual document after activate", () => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent("");
    assert.ok(screen.virtualDocument);
    screen.activate();
    assert.ok(!screen.virtualDocument);
  });

  it("set body id in virtual document to page body id", () => {
    const screen = new HtmlScreen();
    globals.document.body.id = "bodyAsSurface";
    screen.allocateVirtualDocumentForContent("<body>body</body>");
    screen.assertSameBodyIdInVirtualDocument();
    assert.strictEqual(
      "bodyAsSurface",
      screen.virtualDocument.querySelector("body").id
    );
  });

  it("set body id in virtual document to page body id even when it was already set", () => {
    const screen = new HtmlScreen();
    globals.document.body.id = "bodyAsSurface";
    screen.allocateVirtualDocumentForContent('<body id="serverId">body</body>');
    screen.assertSameBodyIdInVirtualDocument();
    assert.strictEqual(
      "bodyAsSurface",
      screen.virtualDocument.querySelector("body").id
    );
  });

  it("set body id in document and use the same in virtual document", () => {
    const screen = new HtmlScreen();
    globals.document.body.id = "";
    screen.allocateVirtualDocumentForContent("<body>body</body>");
    screen.assertSameBodyIdInVirtualDocument();
    assert.ok(globals.document.body.id);
    assert.strictEqual(
      globals.document.body.id,
      screen.virtualDocument.querySelector("body").id
    );
  });

  it("evaluate surface scripts", done => {
    enterDocumentSurfaceElement(
      "surfaceId",
      "<script>window.sentinel=true;</script>"
    );
    const surface = new Surface("surfaceId");
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent("");
    assert.ok(!window.sentinel);
    screen
      .evaluateScripts({
        surfaceId: surface
      })
      .then(() => {
        assert.ok(window.sentinel);
        delete window.sentinel;
        exitDocumentElement("surfaceId");
        done();
      });
  });

  it("evaluate surface styles", done => {
    enterDocumentSurfaceElement(
      "surfaceId",
      '<style id="temporaryStyle">body{background-color:rgb(0, 255, 0);}</style>'
    );
    const surface = new Surface("surfaceId");
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent("");
    screen
      .evaluateStyles({
        surfaceId: surface
      })
      .then(() => {
        assertComputedStyle("backgroundColor", "rgb(0, 255, 0)");
        exitDocumentElement("surfaceId");
        done();
      });
  });

  it("evaluate favicon", done => {
    enterDocumentSurfaceElement("surfaceId", "");
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<link rel="Shortcut Icon" href="/for/favicon.ico" />'
    );
    screen.evaluateFavicon_().then(() => {
      const element = document.querySelector('link[rel="Shortcut Icon"]');
      const uri = new Uri(element.href);
      assert.strictEqual("/for/favicon.ico", uri.getPathname());
      exitDocumentElement("surfaceId");
      done();
    });
  });

  it("always evaluate tracked favicon", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<link id="favicon" rel="Shortcut Icon" href="/for/favicon.ico" />'
    );
    screen.evaluateFavicon_().then(() => {
      assert.ok(document.querySelector('link[rel="Shortcut Icon"]'));
      screen.allocateVirtualDocumentForContent(
        '<link id="favicon" rel="Shortcut Icon" href="/bar/favicon.ico" />'
      );
      screen.evaluateFavicon_({}).then(() => {
        const element = document.querySelector('link[rel="Shortcut Icon"]');
        assert.ok(element);
        exitDocumentElement("favicon");
        done();
      });
    });
  });

  it("not force favicon to change whenever the href change when the browser is IE", done => {
    // This test will run only on IE
    if (!utils.isIe()) {
      done();
    } else {
      enterDocumentSurfaceElement(
        "surfaceId",
        '<link rel="Shortcut Icon" href="/bar/favicon.ico" />'
      );
      const screen = new HtmlScreen();
      screen.allocateVirtualDocumentForContent(
        '<link rel="Shortcut Icon" href="/for/favicon.ico" />'
      );
      screen.evaluateFavicon_().then(() => {
        const element = document.querySelector('link[rel="Shortcut Icon"]');
        const uri = new Uri(element.href);
        assert.strictEqual("/for/favicon.ico", uri.getPathname());
        assert.isTrue(uri.hasParameter("q") === false);
        exitDocumentElement("surfaceId");
        done();
      });
    }
  });

  it("force favicon to change whenever change the href when the browser is not IE", done => {
    // This test will run on all browsers except in IE
    if (utils.isIe()) {
      done();
    } else {
      enterDocumentSurfaceElement(
        "surfaceId",
        '<link rel="Shortcut Icon" href="/bar/favicon.ico" />'
      );
      const screen = new HtmlScreen();
      screen.allocateVirtualDocumentForContent(
        '<link rel="Shortcut Icon" href="/for/favicon.ico" />'
      );
      screen.evaluateFavicon_().then(() => {
        const element = document.querySelector('link[rel="Shortcut Icon"]');
        const uri = new Uri(element.href);
        assert.strictEqual("/for/favicon.ico", uri.getPathname());
        assert.isTrue(uri.hasParameter("q"));
        exitDocumentElement("surfaceId");
        done();
      });
    }
  });

  it("always evaluate tracked temporary scripts", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<script data-senna-track="temporary">window.sentinel=true;</script>'
    );
    assert.ok(!window.sentinel);
    screen.evaluateScripts({}).then(() => {
      assert.ok(window.sentinel);
      delete window.sentinel;
      screen.allocateVirtualDocumentForContent(
        '<script data-senna-track="temporary">window.sentinel=true;</script>'
      );
      screen.evaluateScripts({}).then(() => {
        assert.ok(window.sentinel);
        delete window.sentinel;
        done();
      });
    });
  });

  it("always evaluate tracked temporary styles", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>'
    );
    screen.evaluateStyles({}).then(() => {
      assertComputedStyle("backgroundColor", "rgb(0, 255, 0)");
      screen.allocateVirtualDocumentForContent(
        '<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(255, 0, 0);}</style>'
      );
      screen.evaluateStyles({}).then(() => {
        assertComputedStyle("backgroundColor", "rgb(255, 0, 0)");
        exitDocumentElement("temporaryStyle");
        done();
      });
    });
  });

  it("append existing teporary styles with id in the same place as the reference", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>'
    );
    screen.evaluateStyles({}).then(() => {
      document.head.appendChild(
        dom.buildFragment(
          '<style id="mainStyle">body{background-color:rgb(255, 255, 255);}</style>'
        )
      );
      assertComputedStyle("backgroundColor", "rgb(255, 255, 255)");
      screen.allocateVirtualDocumentForContent(
        '<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(255, 0, 0);}</style>'
      );
      screen.evaluateStyles({}).then(() => {
        assertComputedStyle("backgroundColor", "rgb(255, 255, 255)");
        exitDocumentElement("mainStyle");
        exitDocumentElement("temporaryStyle");
        done();
      });
    });
  });

  it("evaluate tracked permanent scripts only once", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<script id="permanentScriptKey" data-senna-track="permanent">window.sentinel=true;</script>'
    );
    assert.ok(!window.sentinel);
    screen.evaluateScripts({}).then(() => {
      assert.ok(window.sentinel);
      delete window.sentinel;
      screen.allocateVirtualDocumentForContent(
        '<script id="permanentScriptKey" data-senna-track="permanent">window.sentinel=true;</script>'
      );
      screen.evaluateScripts({}).then(() => {
        assert.ok(!window.sentinel);
        done();
      });
    });
  });

  it("evaluate tracked permanent styles only once", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(0, 255, 0);}</style>'
    );
    screen.evaluateStyles({}).then(() => {
      assertComputedStyle("backgroundColor", "rgb(0, 255, 0)");
      screen.allocateVirtualDocumentForContent(
        '<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(255, 0, 0);}</style>'
      );
      screen.evaluateStyles({}).then(() => {
        assertComputedStyle("backgroundColor", "rgb(0, 255, 0)");
        exitDocumentElement("permanentStyle");
        done();
      });
    });
  });

  it("remove from document tracked pending styles on screen dispose", done => {
    const screen = new HtmlScreen();
    document.head.appendChild(
      dom.buildFragment(
        '<style id="mainStyle">body{background-color:rgb(255, 255, 255);}</style>'
      )
    );
    screen.allocateVirtualDocumentForContent(
      '<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>'
    );
    screen.evaluateStyles({}).then(() => {
      assertComputedStyle("backgroundColor", "rgb(255, 255, 255)");
      exitDocumentElement("mainStyle");
      done();
    });
    screen.dispose();
  });

  it("clear pendingStyles after screen activates", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent(
      '<style id="temporaryStyle" data-senna-track="temporary"></style>'
    );
    screen.evaluateStyles({}).then(() => {
      assert.ok(!screen.pendingStyles);
      exitDocumentElement("temporaryStyle");
      done();
    });
    assert.ok(screen.pendingStyles);
    screen.activate();
  });

  it("mutate temporary style hrefs to be unique on ie browsers", done => {
    // This test will run only on IE
    if (!utils.isIe()) {
      done();
    } else {
      const screen = new HtmlScreen();

      window.fetch.returns(
        Promise.resolve(
          new Response(
            '<link id="testIEStlye" data-senna-track="temporary" rel="stylesheet" href="testIEStlye.css">',
            { status: 200 }
          )
        )
      );

      screen.load("/url").then(() => {
        screen.evaluateStyles({}).then(() => {
          assert.isTrue(
            document.getElementById("testIEStlye").href.indexOf("?zx=") > -1
          );
          done();
        });
        screen.activate();
      });
    }
  });

  it("link elements should only be loaded once in IE", done => {
    // This test will run only on IE
    if (!utils.isIe()) {
      done();
    } else {
      const screen = new HtmlScreen();
      window.sentinelLoadCount = 0;

      window.fetch.returns(
        Promise.resolve(
          new Response(
            '<link id="style" data-senna-track="temporary" rel="stylesheet" href="/base/src/senna.js">',
            { status: 200 }
          )
        )
      );

      screen.load("/url").then(() => {
        const style = screen.virtualQuerySelectorAll_("#style")[0];
        style.addEventListener("load", () => {
          window.sentinelLoadCount++;
        });
        style.addEventListener("error", () => {
          window.sentinelLoadCount++;
        });

        screen.evaluateStyles({}).then(() => {
          assert.strictEqual(1, window.sentinelLoadCount);
          delete window.sentinelLoadCount;
          done();
        });
        screen.activate();
      });
    }
  });

  it("have correct title", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent("<title>left</title>");
    screen.resolveTitleFromVirtualDocument();
    screen.flip([]).then(() => {
      assert.strictEqual("left", screen.getTitle());
      done();
    });
  });

  it("have correct title when the title contains html entities", done => {
    const screen = new HtmlScreen();
    screen.allocateVirtualDocumentForContent("<title>left &amp; right</title>");
    screen.resolveTitleFromVirtualDocument();
    screen.flip([]).then(() => {
      assert.strictEqual("left & right", screen.getTitle());
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

function exitDocumentElement(surfaceId) {
  return dom.exitDocument(document.getElementById(surfaceId));
}

function assertComputedStyle(property, value) {
  assert.strictEqual(
    value,
    window.getComputedStyle(document.body, null)[property]
  );
}
