const app = require('express')();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
const LicenseServer = require('./licenseServer');
const config = require('../config.json');

/*
// use express to handle incomming request
// use simple-oauth2 for oauth
// use axios for passing api requests to app.clio.com
// store tokens on the server so they do not leak on client apps
// handle license key generation and storage
// in memory DB for fast access to already retrieved data
*/
const credentials = {
    client: {
        id: config.id,
        secret: config.secrect
    },
    auth: {
        tokenHost: config.tokenHost
    }
};
const oauth2 = require('simple-oauth2').create(credentials);

app.get('/login/:user', (req, res) => {
    console.log("login");
    LicenseServer.getLicense(req.params.user);
    res.redirect(`http://localhost:${config.expressPort}/todo`);
});

app.get('/oauth/response', async (req, res) => {
    console.log("oauth/response: ", req.query.code);
    const tokenConfig = {
        client_id: config.id,
        client_secret: config.secrect,
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: config.redirectUri,
    };
    // Save the access token
    try {
        const result = await oauth2.authorizationCode.getToken(tokenConfig)
        console.log("result:", result);
        const accessToken = oauth2.accessToken.create(result);
        console.log("accessToken:", accessToken);

        // redirect to the application home page
        res.redirect(`http://localhost:${config.expressPort}/login/user1`);

    } catch (error) {
        console.log('Access Token Error', error);
    }
});

app.get('/oauth', (req, res) => {
    console.log("oauth");

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: config.redirectUri,
    });
    res.redirect(authorizationUri);
});
app.get('/api/v4/*', (req, res) => {
    console.log("redirecting to clio API");
    apiProxy.web(req, res, { target: config.apiHost });
})

app.get('/*', (req, res) => {
    console.log("redirecting to app", `http://localhost:${config.webpackPort}` + req.originalUrl);
    apiProxy.web(req, res, { target: `http://localhost:${config.webpackPort}` });
})

app.listen(config.expressPort, () => {
    console.log(`Listening on localhost:${config.expressPort}`)
});

