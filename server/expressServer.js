const app = require('express')();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
const LicenseServer = require('./licenseServer');

const credentials = {
    client: {
        id: 'Rnp1L7DxqYPyTka5AR9h8Q7QLL2rGvqxwaEo6R6S',
        secret: '4TG03EH2VX5o0Yr631WjREsTkAEuonjlQy0kY4t7'
    },
    auth: {
        tokenHost: 'https://app.clio.com'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);

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
    res.redirect("http://localhost:3001/todo");
});

app.get('/oauth/response', async (req, res) => {
    console.log("oauth/response: ", req.query.code);
    const tokenConfig = {
        client_id: "Rnp1L7DxqYPyTka5AR9h8Q7QLL2rGvqxwaEo6R6S",
        client_secret: "4TG03EH2VX5o0Yr631WjREsTkAEuonjlQy0kY4t7",
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: 'http://localhost:3001/oauth/response',
    };
    // Save the access token
    try {
        const result = await oauth2.authorizationCode.getToken(tokenConfig)
        console.log("result:", result);
        const accessToken = oauth2.accessToken.create(result);
        console.log("accessToken:", accessToken);

        // redirect to the application home page
        res.redirect("http://localhost:3001/login/user1");

    } catch (error) {
        console.log('Access Token Error', error);
    }
});

app.get('/oauth', (req, res) => {
    console.log("oauth");

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: 'http://localhost:3001/oauth/response'
    });
    res.redirect(authorizationUri);
});
app.get('/api/v4/*', (req, res) => {
    console.log("redirecting to clio API");
    apiProxy.web(req, res, { target: "https://app.clio.com" });
})

app.get('/*', (req, res) => {
    console.log("redirecting to app", "http://localhost:3000" + req.originalUrl);
    apiProxy.web(req, res, { target: "http://localhost:3000" });
})

app.listen(3001, () => {
    console.log('Listening on localhost:3001')
});
