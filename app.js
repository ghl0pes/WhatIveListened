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
	spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 }).then(
		function (data) {
			let albums = data.body.items
				.filter((current) => {
					if (current.context.type === "album") {
						current.context.album = current.track.album;
						return current;
					}
				})
				.map((element) => element.context);

			let recent = [];
			albums.forEach((element, index) => {
				if (index === 0 || albums[index].uri != albums[index - 1].uri) {
					recent.push(element);
				}
			});
		},
		function (err) {
			app.call();
		},
	);
};

getMyRecentlyPlayedTracks();

app.use("/", router);
app.listen(process.env.SPOTIFY_LOCAL_PORT, function () {
	console.log("running");
});
