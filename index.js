'use strict';
const initStream = require('./lib/logStream');
/**
* The plugin will pipe all thorin.js logs to loglet.io
* */

module.exports = function(thorin, opt, pluginName) {
  opt = thorin.util.extend({
    logger: pluginName || 'loglet',
    id: thorin.id,  // the process id
    enabled: true,
    boot: true,   // send the boot event?
    ignore: [], // array of loggers to ignore.
    gateway: process.env.LOGLET_GATEWAY || null,
    key: process.env.LOGLET_KEY,
    secret: process.env.LOGLET_SECRET
  }, opt);
  const streamObj = initStream(thorin, opt);
  const logObj = {};
  thorin.logger.pipe(streamObj.pipe());

  /* Enable/disable the stream */
  logObj.enable = function() {
    streamObj.enable();
    return logObj;
  }
  logObj.disable = function() {
    streamObj.disable();
    return logObj;
  }

  /*
  *  Initialize the connection BEFORE we call the run fn.
  *  */
  logObj.run = function(done) {
    streamObj.start(done);
  }

  logObj.options = opt;
  return logObj;
}
module.exports.publicName = 'loglet';