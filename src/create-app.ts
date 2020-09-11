import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { trace } from 'console';
import Crawler from './crawler/crawler';
import mainRouter from './router/main-router';
import apiRouter from './router/api-router';
import PageError from './error/page-error';
import APIError from './error/api-error';

let crawler: Crawler;

export default async function createApp() {
  const app = express();

  // 크롤러 인스턴스 생성
  crawler = new Crawler();
  await crawler.launchBrowser();

  // 뷰 엔진 설정
  app.set('view engine', 'pug');
  app.set('views', join(__dirname, '..', 'views'));

  // 바디 파서 설정
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 정적 파일 호스트
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // 라우터 연결
  app.use(mainRouter);
  app.use('/api', apiRouter);

  // 404 핸들링
  app.use(() => {
    throw new PageError('없는 페이지입니다.', '/');
  });

  // 오류 핸들링
  app.use((err: PageError, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof PageError)) {
      next(err);
      return;
    }

    res.render('error', {
      message: err.message,
      redirect: err.redirect || '/',
    });
  });

  app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof APIError)) {
      next(err);
      return;
    }

    res.status(err.status || 500).json(err);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500);
    trace(err);
  });

  return app;
}
