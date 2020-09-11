import { Browser } from 'puppeteer';
import Activity from './activity';
import Serializable from './serializable';

export default class Video implements Activity, Serializable {
    public week: number;

    public name: string;

    public done: boolean;

    private browser: Browser;

    public constructor(week: number, name: string, done: boolean, browser: Browser) {
      this.week = week;
      this.name = name;
      this.done = done;
      this.browser = browser;
    }

    public serialize() {
      return (({ week, name, done }) => ({ week, name, done }))(this);
    }
}
