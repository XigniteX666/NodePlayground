const express = require('express');
var ClientOAuth2 = require('client-oauth2');
//var rp = require('request-promise');
var request = require('request');
require('request-debug')(request);

var strava_options = {
  clientId: '12447',
  clientSecret: 'ed03ec4d23aa39a78f94433d5d2c62bc25b2c44e',
  accessTokenUri: 'https://www.strava.com/oauth/token',
  authorizationUri: 'https://www.strava.com/oauth/authorize',
  redirectUri: 'http://localhost:8000/callback',
  scopes: ['view_private']
}

var githubAuth = new ClientOAuth2({
  clientId: '12447',
clientSecret: 'ed03ec4d23aa39a78f94433d5d2c62bc25b2c44e',
accessTokenUri: 'https://www.strava.com/oauth/token',
authorizationUri: 'https://www.strava.com/oauth/authorize',
redirectUri: 'http://localhost:8000/callback',
scopes: ['view_private']

})

const app = express();
var user;
// const authorizationUri = oauth2.authorizationCode.authorizeURL({
//   redirect_uri: 'http://localhost:8000/callBack',
// });


app.get('/callback', (req, res) => {

  request.post(strava_options.accessTokenUri,
  {form:
    {
      client_id: strava_options.clientId,
      client_secret : strava_options.clientSecret,
      code : req.query.code
  }},
  function (err, httpResponse, body) {
  if (err) {
    return console.error('Error:', err);
  }
    console.log('User:', body);
    user = body;
  });

    console.log('Outside callback');
    res.send("Logged in");
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  var uri = githubAuth.code.getUri();
  console.log(uri);
  res.redirect(uri)
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Strava</a>');
});

app.listen(8000, () => {
  console.log('Express server started on port 8000'); // eslint-disable-line
});
