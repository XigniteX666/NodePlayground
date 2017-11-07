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


var lastfm_options = {
  apiKey: '97b910efa3b6de54c58d9ea79ca823c3',
  sharedSecret: '24c30f80a251817eae6290bdf8bb6637',
  baseUri: 'http://ws.audioscrobbler.com/2.0/'
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
let user;


//Last fm routes
app.get('/api/lastfm/chart', (req,res) =>{
  request.get({
    uri: lastfm_options.baseUri,
    qs:{
      method: 'user.getweeklyartistchart',
      user: 'oskaralbers',
      api_key: lastfm_options.apiKey,
      format: 'json'
    }
  }, function (err, httpResponse, body){
    res.json(JSON.parse(body))
  })
})

app.get('/api/lastfm/search/artist/:searchTerm', (req, res) =>{
  request.get({
    uri: lastfm_options.baseUri,
    qs: {
      method: 'artist.search',
      artist: req.params.searchTerm,
      api_key: lastfm_options.apiKey,
      format: 'json'
    }

  }).pipe(res);
})

app.get('/api/lastfm/artist/:artistId', (req, res) =>{
  request.get({
    uri: lastfm_options.baseUri,
    qs: {
      method: 'artist.getInfo',
      mbid: req.params.artistId,
      api_key: lastfm_options.apiKey,
      format: 'json'
    }

  }, function(err, httpResponse, body){
        res.json(JSON.parse(convertArtist(JSON.parse(body))))
  })
})

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
    user = JSON.parse(body);
  });

    console.log('Outside callback');
    res.sendfile('./public/index.html');
});

app.get('/api/strava/user', function(req, res){
    request.get({
        uri: 'https://www.strava.com/api/v3/athlete',
        headers: {
          'Authorization': user.token_type + " " + user.access_token
        },
    }).pipe(res)
})
-
app.get('/api/strava/activities', function(req, res) {
  request.get({
    uri: 'https://www.strava.com/api/v3/athlete/activities',
    headers: {
      'Authorization': user.token_type + " " + user.access_token
    },
  }).pipe(res);
})




// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  var uri = githubAuth.code.getUri();
  console.log(uri);
  res.redirect(uri)
});

app.get('/login', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Strava</a>');
});

app.use(express.static('public'))

//html
app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
})



app.listen(8000, () => {
  console.log('Express server started on port 8000'); // eslint-disable-line
});


function convertArtist(artistInput) {

     var thumbNail = artistInput.artist.image[0];
     var image2 = artistInput.artist.image[1];

    var artist = new Object();
     artist.name = artistInput.artist.name;
     artist.id = artistInput.artist.mbid;
     artist.summary  = artistInput.artist.bio.summary;
     artist.description  = artistInput.artist.bio.content;
     artist.tags = artistInput.artist.tags.tag;
     artist.thumbNail = thumbNail['#text'];
     artist.image = image2['#text'];

    //return JSON.stringify(artistInput);
  return  JSON.stringify(artist);

}
