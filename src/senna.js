'use strict';

import utils from './utils/utils';
import dataAttributeHandler from './app/dataAttributeHandler';
import App from './app/App';
import HtmlScreen from './screen/HtmlScreen';
import RequestScreen from './screen/RequestScreen';
import Route from './route/Route';
import Screen from './screen/Screen';
import version from './app/version';

export default App;
export { dataAttributeHandler, utils, App, HtmlScreen, Route, RequestScreen, Screen, version };