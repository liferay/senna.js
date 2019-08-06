/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: MIT
 */
"use strict";

import globals from "../globals/globals";
import AppDataAttributeHandler from "./AppDataAttributeHandler";

/**
 * Data attribute handler.
 * @type {AppDataAttributeHandler}
 */
const dataAttributeHandler = new AppDataAttributeHandler();

globals.document.addEventListener("DOMContentLoaded", () => {
  dataAttributeHandler.setBaseElement(globals.document.body);
  dataAttributeHandler.handle();
});

export default dataAttributeHandler;
