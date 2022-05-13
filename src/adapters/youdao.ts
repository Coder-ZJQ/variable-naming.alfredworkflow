import { Adapter, Result } from "./adapter";
import md5 from "../libs/md5";
import { Formatter, LowerCamelCase, UpperCamelCase, LowerUnderline, UpperUnderline } from './formatter';

class Youdao implements Adapter {
  key: string;

  secret: string;

  word: string = "";

  isChinese: boolean = false;

  results: Result[] = [];

  phonetic: string = "";

  formatters: Formatter[] = [
    new LowerCamelCase(),
    new UpperCamelCase(),
    new LowerUnderline(),
    new UpperUnderline()
  ]

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  url(word: string): string {
    this.isChinese = this.detectChinese(word);
    this.word = word;

    const from = this.isChinese ? "zh-CHS" : "auto";
    const to = this.isChinese ? "en" : "zh-CHS";
    const salt = Math.floor(Math.random() * 10000).toString();
    const sign = md5(`${this.key}${word}${salt}${this.secret}`);

    const params = new URLSearchParams({
      q: word,
      from,
      to,
      appKey: this.key,
      salt,
      sign,
    });

    return "https://openapi.youdao.com/api?" + params.toString();
  }

  parse(data: any): Result[] {
    if (data.errorCode !== "0") {
      return this.parseError(data.errorCode);
    }

    const { translation, basic, web } = data;

    if (this.isChinese) {
      // 因为是生成变量名（代码），普通翻译词义可能不怎么符合情况，所以将网络释义提前
      this.parseWeb(web);
      this.parseTranslation(translation);
      this.parseBasic(basic);
    }

    return this.results;
  }

  private parseTranslation(translation: object) {
    if (translation && this.isAllLetter(translation[0])) {
      this.formatters.forEach(formatter => {
        const formatted = formatter.format(translation[0])
        this.addResult(formatted, formatter.name, formatted);
      })
    }
  }

  private parseBasic(basic: any) {
    if (basic) {
      basic.explains.filter(this.isAllLetter).forEach((explain) => {
        this.formatters.forEach(formatter => {
          const formatted = formatter.format(explain)
          this.addResult(formatted, formatter.name, formatted);
        })
      });
    }
  }

  private parseWeb(web: any) {
    if (web) {
      web.forEach((item, index) => {
        item.value.filter(this.isAllLetter).forEach(element => {
          this.formatters.forEach(formatter => {
            const formatted = formatter.format(element)
            this.addResult(formatted, formatter.name, formatted);
          })
        });
      });
    }
  }

  private isAllLetter(translation: string): boolean {
    return /^[a-zA-Z ]+$/.test(translation)
  }

  private parseError(code: number): Result[] {
    const messages = {
      101: "缺少必填的参数",
      102: "不支持的语言类型",
      103: "翻译文本过长",
      108: "应用ID无效",
      110: "无相关服务的有效实例",
      111: "开发者账号无效",
      112: "请求服务无效",
      113: "查询为空",
      202: "签名检验失败,检查 KEY 和 SECRET",
      401: "账户已经欠费",
      411: "访问频率受限",
    };

    const message = messages[code] || "请参考错误码：" + code;

    return this.addResult("👻 翻译出错啦", message, "Ooops...");
  }

  private addResult( title: string, subtitle: string, arg: string = ""): Result[] {
    // quicklook 无法打开 codelf，所以展示使用翻译页面
    // const quicklookurl = "https://unbug.github.io/codelf/#" + encodeURI(this.word);
    const quicklookurl = "https://www.youdao.com/w/" + this.word;
    const maxLength = this.detectChinese(title) ? 27 : 60;
    
    if (title.length > maxLength) {
      const copy = title;
      title = copy.slice(0, maxLength);
      subtitle = copy.slice(maxLength);
    }

    this.results.push({ word: this.word, title, subtitle, arg, quicklookurl });
    return this.results;
  }

  private detectChinese(word: string): boolean {
    return /^[\u4e00-\u9fa5]+$/.test(word);
  }
}

export default Youdao;
