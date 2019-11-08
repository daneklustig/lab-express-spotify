require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, // To avoid making our API keys public, we use a package named dotenv
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });




app.get('/', (req, res, next) => {
    res.render('index');
});


app.get("/artists", (req, res) => {
    // input from the form in the index.hbs
    const searchString = req.query.q;

    spotifyApi
        .searchArtists(searchString)
        .then(data => {
            const items = data.body.artists.items
            console.log("The received data from the API: ", data.body);
            // res.send(items)
            res.render("artists", {
                artists: items
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});


app.get("/albums/:artistId", (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const items = data.body.items
            // res.send(items)
            res.render("albums", {
                albums: items
            })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        });

});

app.get("/tracks/:trackId", (req, res, next) => {

    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            res.send(data.body)
            // res.render("albums", {
            //     albums: items
            // })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        });

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));