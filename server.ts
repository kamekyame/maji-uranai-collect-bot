import { config } from "https://deno.land/x/dotenv/mod.ts";

import { pathResolver } from "https://kamekyame.github.io/deno_tools/path/mod.ts";
const resolve = pathResolver(import.meta);

//import { getBearerToken } from "https://kamekyame.github.io/twitter_api_client/auth/oauth2.ts";
import { getBearerToken } from "../twitter_api_client/auth/oauth2.ts";
import {
  connectStream,
} from "../twitter_api_client/api_v2/tweets/filtered_stream.ts";
//} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";

import Collect from "./mod.ts";

const env = config({
  path: resolve("./.env"),
  safe: true,
  example: resolve("./.env.example"),
});

const auth = {
  consumerKey: env["API_KEY"],
  consumerSecret: env["API_SECRETKEY"],
  token: env["TOKEN"],
  tokenSecret: env["TOKEN_SECRET"],
};

const bearerToken = await getBearerToken(auth.consumerKey, auth.consumerSecret);

const receiveUsername = "botTest46558316";
//const receiveUsername = "SuzuTomo2001";

const collect = new Collect(auth, bearerToken);
collect.setReceiveUsername(receiveUsername);
await collect.checkRule();

connectStream(bearerToken, (res) => {
  collect.callback(res);
}, {
  expansions: {
    author_id: true,
  },
  "user.fields": {
    username: true,
  },
});
