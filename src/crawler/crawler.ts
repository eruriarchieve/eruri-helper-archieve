import moment, { Moment } from 'moment';
import puppeteer, { Browser } from 'puppeteer';
import Course from './course';
import getChromiumPath from '../get-chromium-path';
import CrawlerError from '../error/crawler-error';
import { getAttribute, getNodeText } from './evaluate';

export default class Crawler {
    public lastUpdate: Moment;

    private browser: Browser;

    private courses: Course[];

    public signedIn: boolean;

    public static instance: Crawler; // 싱글톤

    constructor() {
      this.lastUpdate = null;
      this.signedIn = false;

      Crawler.instance = this;
    }

    async launchBrowser() {
      this.browser = await puppeteer.launch({
        executablePath: getChromiumPath(),
      });
    }

    async signIn(username: string, password: string) {
      if (!this.browser) throw new CrawlerError('브라우저가 아직 열리지 않았습니다.');
      if (this.signedIn) throw new CrawlerError('이미 로그인 중입니다.');
      const page = await this.browser.newPage();

      await page.goto('https://eruri.kangwon.ac.kr', {
        waitUntil: 'domcontentloaded',
      });
      await (await page.$('#username')).type(username);
      await (await page.$('#password')).type(password);
      await (await page.$('.main_login_btn')).click();

      await page.waitForNavigation({
        waitUntil: 'load',
      });

      if ((await page.content()).includes('아이디 또는 패스워드가 잘못 입력되었습니다.')) throw new CrawlerError('아이디 혹은 비밀번호가 올바르지 않습니다.');

      this.signedIn = true;
      return page.close();
    }

    async signOut() {
      if (!this.browser) throw new CrawlerError('브라우저가 아직 열리지 않았습니다.');
      if (!this.signedIn) throw new CrawlerError('로그인 하지 않았습니다.', '/sign');
      await this.browser.close();
      this.browser = undefined;
      this.signedIn = false;
      await this.launchBrowser();
    }

    async fetchCourses() {
      if (!this.browser) throw new CrawlerError('브라우저가 아직 열리지 않았습니다.');
      if (!this.signedIn) throw new CrawlerError('로그인 하지 않았습니다.', '/sign');
      const page = await this.browser.newPage();

      await page.goto('https://eruri.kangwon.ac.kr', {
        waitUntil: 'domcontentloaded',
      });

      if ((await page.content()).includes('아이디 / 비밀번호 찾기')) {
        await this.signOut();
        throw new CrawlerError('로그인이 해제되었습니다. 다시 로그인해주세요.', '/sign');
      }

      const courseLinks = await page.$$('.course_link');

      const courses: Course[] = [];

      for (const link of courseLinks) {
        const courseId = Number((await link.evaluate(getAttribute, 'href')).split('?id=')[1].trim());

        courses.push(new Course(
          courseId,
          await (await link.$('.course-title h3')).evaluate(getNodeText),
          await (await link.$('.course-title .prof')).evaluate(getNodeText),
          this.browser,
          this,
        ));
      }

      this.lastUpdate = moment();

      await page.close();

      this.courses = courses;
      return courses;
    }

    async getCourses() {
      return this.courses || this.fetchCourses();
    }
}
