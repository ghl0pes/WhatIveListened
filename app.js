const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_LOCAL_SERVER + "/callback",
});

let token = process.env.SPOTIFY_USER_TOKEN;

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
	});
});
spotifyApi.setAccessToken(token);

const getMe = () => {
	spotifyApi.getMe().then(
		function (data) {
			console.log(data.body);
		},
		function (err) {
			console.log("Something went wrong!", err);
		},
	);
};

getMe();

// const getPlaylist = async () => {
// 	const data = await spotifyApi.getUserPlaylists("12159103962");
// 	console.log("data", data);
// };

// getPlaylist();

app.use("/", router);
app.listen(process.env.SPOTIFY_LOCAL_PORT, function () {
	console.log("running");
});
