import { Html5Entities } from 'html-entities';
import { Browser } from 'puppeteer';
import Homework from './homework';
import Video from './video';
import Serializable from './serializable';
import serialize from './serialize';
import CrawlerError from '../error/crawler-error';
import Crawler from './crawler';
import { getInnerHTML, getNodeText } from './evaluate';

export default class Course implements Serializable {
    public id: number;

    public name: string;

    public professor: string;

    public homeworks: Homework[];

    public videos: Video[];

    private crawler: Crawler;

    private browser: Browser;

    constructor(id: number, name: string, professor: string, browser: Browser, crawler: Crawler) {
      this.id = id;
      this.name = name;
      this.professor = professor;
      this.browser = browser;
      this.crawler = crawler;
    }

    async fetchHomeworks() {
      const page = await this.browser.newPage();
      await page.goto(`https://eruri.kangwon.ac.kr/mod/assign/index.php?id=${this.id}`, {
        waitUntil: 'domcontentloaded',
      });

      if ((await page.content()).includes('아이디 / 비밀번호 찾기')) {
        await this.crawler.signOut();
        throw new CrawlerError('로그인이 해제되었습니다. 다시 로그인해주세요.', '/sign');
      }

      const homeworks = await Promise.all((await page.$$('td.c0')).map(async (cell) => {
        const siblings = await (await cell.$x('..'))[0].$$('td');

        const weekString = await cell.evaluate(getNodeText);

        return new Homework(
          Number(weekString ? weekString.split('주차')[0] : 0),
          await (await siblings[1].$('a')).evaluate(getNodeText),
          await siblings[3].evaluate(getNodeText) === '제출 완료',
          await siblings[2].evaluate(getNodeText),
          Number(await siblings[4].evaluate(getNodeText)),
          this.browser,
        );
      }));

      await page.close();

      this.homeworks = homeworks;
      return homeworks;
    }

    async fetchVideos() {
      const page = await this.browser.newPage();
      await page.goto(`https://eruri.kangwon.ac.kr/report/ubcompletion/user_progress_a.php?id=${this.id}`, {
        waitUntil: 'domcontentloaded',
      });

      if ((await page.content()).includes('아이디 / 비밀번호 찾기')) {
        await this.crawler.signOut();
        throw new CrawlerError('로그인이 해제되었습니다. 다시 로그인해주세요.', '/sign');
      }

      let week: number | null = null;
      const videos: Video[] = [];

      const rows = await page.$$('.user_progress_table tbody tr');

      for (const row of rows) {
        const cells = await row.$$('td');

        if (Html5Entities.decode((await cells[1].evaluate(getInnerHTML)) || '').trim().length === 0) {
          continue;
        }

        if (cells.length === 6 || cells.length === 5) {
          week = Number(await cells[0].evaluate(getNodeText));

          videos.push(new Video(
            week,
            await cells[1].evaluate(getNodeText, 1),
            await cells[4].evaluate(getNodeText) === 'O',
            this.browser,
          ));
        } else {
          videos.push(new Video(
            week,
            await cells[0].evaluate(getNodeText, 1),
            await cells[3].evaluate(getNodeText) === 'O',
            this.browser,
          ));
        }
      }

      await page.close();

      this.videos = videos;
      return videos;
    }

    async getHomeworks() {
      return this.homeworks || this.fetchHomeworks();
    }

    async getVideos() {
      return this.videos || this.fetchVideos();
    }

    public serialize() {
      return (({
        id, name, professor, homeworks, videos,
      }) => ({
        id, name, professor, homeworks: serialize(homeworks), videos: serialize(videos),
      }))(this);
    }
}
