
var phantom = require('phantom');
var fs = require('fs');
var Promise = require('bluebird');

var PageLoader = {
  load: function(req, res, next) {
    // console.log(req.body('url'));
    var url = req.query.url;
    // var width = req.query.width || 800;
    // var height = req.query.height || 600;
    var width = 1000;
    var height = 800;
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.set('viewportSize', { width: width, height: height }, function (result) {
        console.log("Viewport set to: " + result.width + "x" + result.height)
        })

        page.open(url, function(status) {
          if (status === "success") {
            res.writeHead(200, {'Content-Type': 'image/png' });
            var render = Promise.promisify(page.render);

            render('./server/image.png', 1).then(function() {
              var path = __dirname + '/image.png';
              fs.readFile(path, function(err, data) {
                if(err) console.log(err);
                res.write(data, 'binary');
                res.end();
                ph.exit();
              });
            });

          } else {
            console.error('status: ' + status);
            res.status(404).send('Not found');
          }
        });
      });
    });
  }
};
module.exports = PageLoader; 