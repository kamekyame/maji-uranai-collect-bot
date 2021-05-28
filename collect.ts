import { OAuth1Info } from "https://kamekyame.github.io/deno_tools/http/mod.ts";

import {
  changeRules,
  getRules,
  StreamTweet,
} from "../twitter_api_client/api_v2/tweets/filtered_stream.ts";
//} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";

import { statusUpdate } from "../twitter_api_client/api_v1/tweets/update.ts";
//} from "https://kamekyame.github.io/twitter_api_client/api_v1/tweets/update.ts";

import { TweetLogFileOp } from "./file.ts";

import { colors, zodiacSigns } from "./data.ts";

export default class {
  private readonly auth: OAuth1Info;
  private readonly bearerToken: string;

  private receiveUsername = "Hals_SC";

  private readonly tag = "maji-uranai-collectBOT";
  private readonly value = () => `from:${this.receiveUsername} "【定期】"⭐まぁじ占い⭐"`;

  constructor(auth: OAuth1Info, bearerToken: string) {
    this.auth = auth;
    this.bearerToken = bearerToken;
  }

  public setReceiveUsername(username: string) {
    this.receiveUsername = username;
  }

  public async checkRule() {
    const rules = await getRules(this.bearerToken);
    if (!rules.data?.some((d) => d.value === this.value())) {
      const aRules = await changeRules(this.bearerToken, {
        add: [{ value: this.value(), tag: this.tag }],
      });
    }
  }

  async callback(res: StreamTweet) {
    console.log(res);
    if (!res.matching_rules.some((e) => e.tag === this.tag)) return;
    const text = res.data.text;
    const match = text.match(/…(.+)！/);
    if (!match) return;
    const value = match[1];
    console.log(value);
    let badValue = "";

    let bodyText = "";
    if (text.indexOf("ラッキーカラー") !== -1) {
      const filteredColor = colors.filter((c) => c !== value);
      badValue =
        filteredColor[Math.floor(Math.random() * filteredColor.length)];
      bodyText = `今日のアンラッキーカラーは…${badValue}`;
    } else if (text.indexOf("運勢がいいのは") !== -1) {
      const filteredSigns = zodiacSigns.filter((c) => c !== value);
      badValue =
        filteredSigns[Math.floor(Math.random() * filteredSigns.length)];
      bodyText = `今日一番運勢が悪いのは…${badValue}`;
    }

    const getUser = () => {
      if (res.includes?.users && res.includes.users.length > 0) {
        return res.includes.users[0];
      }
    };
    const user = getUser();
    if (!user) return;

    let status = `
@${user.username}
${bodyText}
`;

    const tweetRes = await statusUpdate(this.auth, {
      status,
      in_reply_to_status_id: res.data.id,
    });

    console.log(`👍:${value}\t👎:${badValue}\ttweetId:${tweetRes.id}`);

    TweetLogFileOp.add(tweetRes);
  }
}
