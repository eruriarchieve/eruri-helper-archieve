import { Request, Response, NextFunction } from 'express';
import Crawler from '../crawler/crawler';
import APIError from '../error/api-error';
import PageError from '../error/page-error';

const needSignedIn = (api: boolean) => (req: Request, res: Response, next: NextFunction) => {
  if (!Crawler.instance.signedIn) {
    if (api) throw new APIError('로그인 해야합니다.', 401, '/sign');
    else throw new PageError('로그인 해야합니다.', '/sign');
  }

  next();
};

export default needSignedIn;
