import { OAuth1Info } from "https://kamekyame.github.io/deno_tools/http/mod.ts";

import {
  StreamParam,
  StreamTweet,
} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";

import { statusUpdate } from "https://kamekyame.github.io/twitter_api_client/api_v1/tweets/update.ts";

import { FortuneFileOp, TweetLogFileOp } from "./file.ts";

const colorsFile = new FortuneFileOp("colors");
const zodiacSignsFile = new FortuneFileOp("zodiac-signs");

import { colors, zodiacSigns } from "./data.ts";

export default class {
  private readonly auth: OAuth1Info;
  //private readonly bearerToken: string;

  private receiveUsername = "Hals_SC";

  private readonly tag = "maji-uranai-collectBOT";
  private readonly value = () => `from:${this.receiveUsername} "【定期】⭐まぁじ占い⭐"`;

  public readonly option: StreamParam = {
    "tweet.fields": { created_at: true },
  };

  constructor(auth: OAuth1Info) {
    this.auth = auth;
  }

  public setReceiveUsername(username: string) {
    this.receiveUsername = username;
  }

  public getRule() {
    return { tag: this.tag, value: this.value() };
  }

  async callback(res: StreamTweet) {
    console.log(res);
    if (!res.matching_rules.some((e) => e.tag === this.tag)) return;
    const date = res.data.created_at;
    if (!date) throw new Error("Nothing created_at");

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

      colorsFile.add({ value, badValue, date });

      bodyText = `今日のアンラッキーカラーは…${badValue}`;
    } else if (text.indexOf("運勢がいいのは") !== -1) {
      const filteredSigns = zodiacSigns.filter((c) => c !== value);
      badValue =
        filteredSigns[Math.floor(Math.random() * filteredSigns.length)];

      zodiacSignsFile.add({ value, badValue, date });

      bodyText = `
    今日一番運勢が悪いのは…
    ごめんなさい。${badValue}の方です(笑)`;
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
#すずともBot
`;

    const tweetRes = await statusUpdate(this.auth, {
      status,
      in_reply_to_status_id: res.data.id,
    });

    console.log(`👍:${value}\t👎:${badValue}\ttweetId:${tweetRes.id}`);

    TweetLogFileOp.add(tweetRes);
  }
}
