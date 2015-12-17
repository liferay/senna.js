'use strict';

import globals from '../globals/globals';
import AppDataAttributeHandler from './AppDataAttributeHandler';

/**
 * Data attribute handler.
 * @type {AppDataAttributeHandler}
 */
var dataAttributeHandler = new AppDataAttributeHandler();

globals.document.addEventListener('DOMContentLoaded', function() {
	dataAttributeHandler.setBaseElement(globals.document.body);
	dataAttributeHandler.handle();
});

export default dataAttributeHandler;