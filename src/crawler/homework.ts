import { Browser } from 'puppeteer';
import Activity from './activity';
import Serializable from './serializable';

export default class Homework implements Activity, Serializable {
    public week: number;

    public name: string;

    public done: boolean;

    public deadline: string;

    public score: number;

    private browser: Browser;

    public constructor(week: number, name: string, done: boolean, deadline: string, score: number, browser: Browser) {
      this.week = week;
      this.name = name;
      this.done = done;
      this.deadline = deadline;
      this.score = score;
      this.browser = browser;
    }

    public serialize() {
      return (({
        week, name, done, deadline, score,
      }) => ({
        week, name, done, deadline, score,
      }))(this);
    }
}
