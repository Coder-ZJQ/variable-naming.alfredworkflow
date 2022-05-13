import { Formatter } from "./formatter";

export interface Result {
  word: string;
  title: string;
  subtitle: string;
  arg: string;
  quicklookurl?: string;
}

export interface Adapter {
  key: string;

  secret: string;

  word: string;

  isChinese: boolean;

  formatters: Formatter[]

  url :(word: string) => string;

  parse: (response: any) => Result[]
}

