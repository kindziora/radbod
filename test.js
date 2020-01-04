

import browserEnv from 'browser-env';
browserEnv();


import {testDomHandler} from './test/domHandler.js';

new testDomHandler();


import {testEventHandler} from './test/eventHandler.js';

new testEventHandler();