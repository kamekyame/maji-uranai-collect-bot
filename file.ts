/*import { pathResolver } from "https://kamekyame.github.io/deno_tools/path/mod.ts";
const resolve = pathResolver(import.meta);

const writeJsonFileSync = (path: string | URL, json: any) => {
  Deno.writeTextFileSync(path, JSON.stringify(json));
};
const readJsonFileSync = (path: string | URL) => {
  return JSON.parse(Deno.readTextFileSync(path));
};*/

export class TweetLogFileOp {
  private static dir = "./log";
  private static path = TweetLogFileOp.dir + "/maji-uranai-res-tweet.log";

  static staticConstructor = (() => {
    Deno.mkdirSync(TweetLogFileOp.dir, { recursive: true });
  })();

  static add(tweetRes: any) {
    const text = `[${new Date().toISOString()}] ${JSON.stringify(tweetRes)}\n`;
    Deno.writeTextFileSync(this.path, text, {
      append: true,
    });
  }
}

/*export class UranaiLogFileOp {
  private static dir = "./data";
  private static path = UranaiLogFileOp.dir + "/collected-uranai.json";

  static staticConstructor = (() => {
    Deno.mkdirSync(TweetLogFileOp.dir, { recursive: true });
  })();

  static add(tweetRes: any) {
    const text = `[${new Date().toISOString()}] ${JSON.stringify(tweetRes)}\n`;
    Deno.writeTextFileSync(this.path, text, {
      append: true,
    });
  }
}
*/
