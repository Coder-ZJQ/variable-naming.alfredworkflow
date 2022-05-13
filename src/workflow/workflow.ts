import { Result } from "../adapters/adapter";
import Item from "./item";

class Workflow {

  private results: any[] = [];

  compose(results: Result[]): this {
    this.results = results.map(r => {

      return new Item().setTitle(r.title)
      .setSubtitle(r.subtitle)
      .setArg(r.arg)
      .setCopy(r.title)
      .setAlt("https://unbug.github.io/codelf/#" + r.word, r.word)
      .setQuicklookurl(r.quicklookurl)
      .result();
    });

    return this;
  }

  output(): string {
    return JSON.stringify({ items: this.results });
  }
}

export default Workflow;