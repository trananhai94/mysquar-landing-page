var fs = require('fs');
var path = require('path');
var url = require('url');

var mime = require('mime');

module.exports = {
  staticMiddleware: function(prefix, dir) {
    prefix = '/' + prefix + '/';
    return function staticMiddleware(req, res, next) {
      if (req.originalUrl.indexOf(prefix) === 0) {
        try {
          var pathname = !path.extname(req['_parsedUrl'].pathname) ? url.resolve(req['_parsedUrl'].pathname, 'index.html') : req['_parsedUrl'].pathname;
          pathname = path.resolve(dir, pathname.replace(prefix, ''));
          var data = fs.readFileSync(pathname);
          res.setHeader('Content-Type', mime.lookup(pathname));
          res.writeHead(200);
          return res.end(data);
        } catch (ex) {
          next();
        }
      }
      return next();
    };
  }
}

