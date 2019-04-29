const app = require('express')();
const LicenseServer = require('./licenseServer');
const OAuthServerServer = require('./oauthServer');

/*
// use express to handle incomming request
// and axios for oauth and passing requests to app.clio.com, i.e. proxy server
// store tokens on the server so they do not leak on client apps
// handle license key generation and storage
// in memory DB for fast access to already retrieved data
*/

app.get('/login/:user', (req, res) => {
    console.log("login");
    LicenseServer.getLicense(req.params.user);
});

app.get('/oauth/:user', (req, res) => {
    console.log("oauth");
    OAuthServerServer.authenticate(req.params.user)
});

app.listen(3001, () => {
    console.log('Listening on localhost:3001')
});

