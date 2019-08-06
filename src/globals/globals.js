"use strict";
const globals = globals || {};

if (typeof window !== "undefined") {
  globals.window = window;
}

if (typeof document !== "undefined") {
  globals.document = document;
}

export default globals;
