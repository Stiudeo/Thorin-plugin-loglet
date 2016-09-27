'use strict';
const loglet = require('loglet.io'),
  util = require('util');
module.exports = function(thorin, opt) {
  const logger = thorin.logger(opt.logger),
    LOG_IGNORES = {};
  for (let i = 0; i < opt.ignore.length; i++) {
    LOG_IGNORES[opt.ignore[i]] = true;
  }
  let appId = opt.id || thorin.id || thorin.app;
  const stream = {
    enabled: opt.enabled
  };

  /* Send out the BOOT event */
  if (opt.boot && stream.enabled) {
    loglet.send({
      name: appId,
      namespace: 'boot',
      level: 'info',
      tags: ['launch'],
      message: `[LAUNCH] Application ${thorin.app} version ${thorin.version}`
    });
  }

  /* Enable/Disable the stream */
  stream.disable = function() {
    stream.enabled = false;
  };
  stream.enable = function() {
    stream.enabled = true;
  };

  /* Pipe messages from the thorin logger */
  stream.pipe = function onThorinLog() {
    return function logItem(item) {
      if (!stream.enabled || LOG_IGNORES[item.name]) return;
      let data = {
        name: appId,
        namespace: item.name,
        message: item.message,
        level: item.level
      };
      let errors = [],
        tags = [],
        datas = [];
      for (let i = 0; i < item.args.length; i++) {
        let arg = item.args[i];
        if (arg instanceof Error) {
          errors.push(arg);
          continue;
        }
        if (typeof arg === 'object' && arg) {
          if (typeof arg.tags === 'string' && arg.tags) {
            tags.push(arg.tags);
            continue;
          }
          if (arg.tags instanceof Array) {
            tags = tags.concat(arg.tags);
            continue;
          }
          datas.push(arg);
        }
      }
      if(tags.length > 0) {
        data.tags = tags;
      }
      if(errors.length > 0) {
        data.error = (errors.length === 1 ? errors[0] : errors);
      }
      if(datas.length > 0) {
        data.data = (datas.length === 1 ? datas[0] : datas);
      }
      loglet.send(data);
    }
  };

  /*
   * Start the stream
   * */
  stream.start = function initLoglet(done) {
    loglet({
      key: opt.key,
      secret: opt.secret
    }, (err) => {
      if (err) {
        logger.error(`Could not connect to loglet.io `, err);
        return done(err);
      }
      done();
    });
  }

  return stream;
};