const app = require('express')();
const simpleOauthModule = require('simple-oauth2');
let config = require('./config.json');

const port = config.port;

// Set the configuration settings
const credentials = {
    client: {
        id: config.id,
        secret: config.secret
    },
    auth: {
        tokenHost: config.tokenHost,
        authorizePath: '/oauth/authorize',
        tokenPath: '/oauth/token'
    }
};


const createApplication = (cb) => {
    const callbackUrl = config.callbackUrl;

    app.listen(port, (err) => {
        if (err) return console.error(err);

        console.log(`Express server listening at http://localhost:${config.port}`);

        cb({
            app,
            callbackUrl,
        });
    });
};

createApplication(({ app, callbackUrl }) => {
    const oauth2 = simpleOauthModule.create(credentials);

    // Authorization uri definition
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: callbackUrl,
    });

    app.use(function (req, res, next) {
        //       res.header("Access-Control-Allow-Origin", "*");
        //       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Initial page redirecting to Github
    // make this call from my react app through proxy server
    app.get('/auth', (req, res) => {
        console.log("authorizationUri", authorizationUri);
        res.redirect(authorizationUri);
    });

    // Callback service parsing the authorization token and asking for the access token
    app.get('/token', async (req, res) => {
        const code = req.query.code;
        console.log("code:", code)
        const options = {
            code: code,
            client_id: "Rnp1L7DxqYPyTka5AR9h8Q7QLL2rGvqxwaEo6R6S",
            client_secret: "4TG03EH2VX5o0Yr631WjREsTkAEuonjlQy0kY4t7",
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000"
        };

        console.log(req.query)
        try {
            const result = await oauth2.authorizationCode.getToken(options);

            console.log('The resulting token: ', result);

            const token = oauth2.accessToken.create(result);

            return res.status(200).json(token)
        } catch (error) {
            console.error('Access Token Error', error.message);
            console.log(error);
            return res.status(500).json('Authentication failed');
        }
    });

    app.get('/', (req, res) => {
        res.send('Hello<br><a href="/auth">Log in with Clio</a>');
    });
});
