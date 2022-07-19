const Twit = require("twit");

require("dotenv").config();

const Bot = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET_KEY,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000,
});

function botInit() {}
