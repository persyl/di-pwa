const fs = require("fs");
const http = require("http");
const http2 = require("http2");
//const path = require('path');

const express = require("express");

const app = express();

// Make HTTP2 work with Express (this must be before any other middleware)
require("express-http2-workaround")({
  express: express,
  http2: http2,
  app: app
});

// See documentations at http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
// https://www.openssl.org/docs/man1.0.2/apps/x509v3_config.html#Subject-Alternative-Name
//(and maybe: https://www.akadia.com/services/ssh_test_certificate.html)
// https://stackoverflow.com/questions/30957793/nodejs-ssl-bad-password-read
const httpsOptions = {
  key: fs.readFileSync(__dirname + "/key.pem"),
  cert: fs.readFileSync(__dirname + "/cert.pem"),
  passphrase: '1234'
};

const http2Server = http2.createServer(httpsOptions, app);
http2Server.listen(5555, () => {
  console.log("Express HTTP/2 server started. Serving on port 5555.");
});

app.use(express.static('public'));


// ------- Routes -------

app.get("/", function(req, res) {
  const html = `<html><head>
  <link rel="manifest" href="/manifest.json"><title>Di Progressive Web App</title>
  <script src="/index.js" type="application/javascript"></script>
  <style>
    body {
      margin: 40px 20px 20px;
      padding: 0;
      color: #555;
      background: #f7eae4;
      font-family: Georgia, Times, serif;
      transition: padding 100ms ease-out;
    }

    body.is-offline {
      padding: 80px 20px 20px;
    }

    .is-offline .is-cached {
      opacity: 1;
    }

    h1, h2 {
      font-family: 'PublicoBanner-Bold-Web', sans-serif;
      margin: 20px 0 20px;
      font-weight: 400;
      font-style: normal;
      font-stretch: normal;
      font-size: 4vh;
      color: rgb(34, 34, 34);
    }

    p {
      margin: 0 0 15px;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    a {
      color: #000;
      text-decoration: none;
    }

    a:visited {
      color: #999;
    }

    a:visited .figure {
      opacity: 0.9;
      filter: grayscale(100%)
    }

  </style>
  </head>
  <body>
  Ok, site is running over HTTP2!
  `;

  // for demo, prevent cache to display client side cache
  res.header('Cache-Control', 'no-cache, no-store');
  res.send(html);
});
