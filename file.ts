import { Fortune } from "./types.ts";

const writeJsonFileSync = (path: string | URL, json: any) => {
  Deno.writeTextFileSync(path, JSON.stringify(json));
};
const readJsonFileSync = (path: string | URL) => {
  return JSON.parse(Deno.readTextFileSync(path));
};

export class FortuneFileOp {
  private static dir = "./data";
  private path: string;
  private data: Fortune[];

  constructor(fileName: string) {
    this.path = FortuneFileOp.dir + `/${fileName}.json`;
    Deno.mkdirSync(FortuneFileOp.dir, { recursive: true });

    try {
      const fortunes = readJsonFileSync(this.path) as Fortune[];
      this.data = fortunes;
    } catch (e) {
      //console.log(e);
      this.data = [];
    }
  }

  private save() {
    writeJsonFileSync(this.path, this.data);
  }

  public add(fortune: Fortune) {
    this.data.push(fortune);
    this.save();
  }
}

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
