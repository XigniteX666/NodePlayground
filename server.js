const express = require('express');
var ClientOAuth2 = require('client-oauth2');
var rp = require('request-promise');

// const oauth2 =simpleOauthModule.create({
//     client: {
//       id: '12447',
//       secret:'ed03ec4d23aa39a78f94433d5d2c62bc25b2c44e '
//     },
//     auth:{
//       tokenPath: '/token',
//       tokenHost:'https://www.strava.com/oauth',
//       authorizePath: '/authorize',
//     }
// });


var githubAuth = new ClientOAuth2({
  clientId: '12447',
  clientSecret: 'ed03ec4d23aa39a78f94433d5d2c62bc25b2c44e',
  accessTokenUri: 'https://www.strava.com/oauth/token',
  authorizationUri: 'https://www.strava.com/oauth/authorize',
  redirectUri: 'http://localhost:8000/callback',
  scopes: ['view_private']
})

const app = express();

// const authorizationUri = oauth2.authorizationCode.authorizeURL({
//   redirect_uri: 'http://localhost:8000/callBack',
// });

app.get('/api/search/:searchTerm', (req, res) =>{
  rp({
   uri: 'http://rest-dev.intertoys.nl/search/resources/productView/bySearchTerm',
   headers: {'apiKey': '7V6YCN9IBeKmyd1M0LRC1O35wWrPJ4E2'},
   qs: {
     profileName: 'Blokker_SearchBasicProduct',
     searchTerm: req.params.searchTerm
   }
 })
   .then((data) => {
     res.render('index', data)
   })
   .catch((err) => {
     console.log(err)
     res.render('error')
   })
})


app.get('/callback', (req, res) => {
  console.log(req.originalUrl)
  githubAuth.credentials.getToken(req.originalUrl)
  .then(function (user) {
    console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }
  })
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  var uri = githubAuth.code.getUri()
  res.redirect(uri)
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.listen(8000, () => {
  console.log('Express server started on port 8000'); // eslint-disable-line
});
