const app = require('express')();
const simpleOauthModule = require('simple-oauth2');

const port = 3000;


// Set the configuration settings
const credentials = {
    client: {
        id: 'Rnp1L7DxqYPyTka5AR9h8Q7QLL2rGvqxwaEo6R6S ',
        secret: '4TG03EH2VX5o0Yr631WjREsTkAEuonjlQy0kY4t7'
    },
    auth: {
        tokenHost: 'https://app.clio.com/oauth/authorize'
    }
};


createApplication = (cb) => {
    const callbackUrl = 'http://localhost:3001/callback';

    app.listen(port, (err) => {
        if (err) return console.error(err);

        console.log(`Express server listening at http://localhost:${port}`);

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

    // Initial page redirecting to Github
    app.get('/auth', (req, res) => {
        console.log(authorizationUri);
        res.redirect(authorizationUri);
    });

    // Callback service parsing the authorization token and asking for the access token
    app.get('/callback', async (req, res) => {
        const code = req.query.code;
        const options = {
            code,
        };

        try {
            const result = await oauth2.authorizationCode.getToken(options);

            console.log('The resulting token: ', result);

            const token = oauth2.accessToken.create(result);

            return res.status(200).json(token)
        } catch (error) {
            console.error('Access Token Error', error.message);
            return res.status(500).json('Authentication failed');
        }
    });

    app.get('/', (req, res) => {
        res.send('Hello<br><a href="/auth">Log in with Clio</a>');
    });
});
