import { Router } from 'express';
import Crawler from '../crawler/crawler';
import needSignedIn from '../middleware/need-signed-in';
import PageError from '../error/page-error';

const mainRouter = Router();

// 메인(강의 목록) 페이지
mainRouter.get('/', async (req, res) => {
  res.render('main');
});

// 로그인 페이지
mainRouter.get('/sign', (req, res) => {
  if (Crawler.instance.signedIn) {
    res.redirect('/');
    return;
  }

  res.render('sign');
});

// 로그인
mainRouter.post('/sign', async (req, res) => {
  if (Crawler.instance.signedIn) {
    res.redirect('/');
    return;
  }

  const { username, password } = req.body;

  try {
    await Crawler.instance.signIn(username, password);
  } catch (e) {
    throw new PageError(e.message, '/sign');
  }

  res.redirect('/');
});

// 안내 페이지
mainRouter.get('/term', (req, res) => {
  res.render('term');
});

// 로그아웃
mainRouter.get('/sign-out', needSignedIn(false), async (req, res) => {
  try {
    await Crawler.instance.signOut();
  } catch (e) {
    throw new PageError(e.message, '/');
  }
  res.redirect('/sign');
});

export default mainRouter;
