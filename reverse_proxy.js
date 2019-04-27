var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:3000',
    serverTwo = 'http://localhost:3001',
    serverThree = 'https://app.clio.com';

app.all("/auth", function (req, res) {
    console.log('redirecting to authentication');
    apiProxy.web(req, res, { target: serverOne });
});

app.all("/callback", function (req, res) {
    console.log('callback');
    apiProxy.web(req, res, { target: serverTwo });
});

app.all("/api/v4/*", function (req, res) {
    console.log('redirecting api requests');
    apiProxy.web(req, res, { target: serverThree });
});

app.all("*", function (req, res) {
    console.log('redirecting all other requests');
    apiProxy.web(req, res, { target: serverTwo });
});

app.listen(2000);
