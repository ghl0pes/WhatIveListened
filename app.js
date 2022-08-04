const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
const router = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./scratch");
require("dotenv").config();

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_LOCAL_SERVER + "/callback",
});

router.get("/", function (require, response, next) {
	response.redirect(
		spotifyApi.createAuthorizeURL([
			"user-read-recently-played",
			"user-read-playback-position",
			"user-read-playback-state",
			"user-top-read",
			"user-library-read",
			"playlist-read-private",
		]),
	);
});

router.get("/callback", function (require, response, next) {
	spotifyApi.authorizationCodeGrant(require.query.code).then((res) => {
		response.send(JSON.stringify(res));
		localStorage.setItem("accessToken", res.body.access_token);
	});
});
spotifyApi.setAccessToken(localStorage.getItem("accessToken"));

const getMyRecentlyPlayedTracks = () => {
	spotifyApi
		.getMyRecentlyPlayedTracks({
			limit: 20,
		})
		.then(
			function (data) {
				// Output items
				console.log("Your 20 most recently played tracks are:");
				data.body.items.forEach((item) => console.log(item.track));
			},
			function (err) {
				console.log("Something went wrong!", err);
			},
		);
};

getMyRecentlyPlayedTracks();

app.use("/", router);
app.listen(process.env.SPOTIFY_LOCAL_PORT, function () {
	console.log("running");
});
