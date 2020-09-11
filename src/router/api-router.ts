import { Router } from 'express';
import Crawler from '../crawler/crawler';
import serialize from '../crawler/serialize';
import APIError from '../error/api-error';
import needSignedIn from '../middleware/need-signed-in';

const apiRouter = Router();

// 과목 목록 얻기
apiRouter.get('/courses', needSignedIn(true), async (req, res) => {
  try {
    res.json(serialize(await Crawler.instance.getCourses()));
  } catch (e) {
    throw new APIError(e.message, 500, e.redirect);
  }
});

// 과목의 자세한 정보 얻기
apiRouter.get('/courses/:id', needSignedIn(true), async (req, res) => {
  const course = (await Crawler.instance.getCourses()).filter((e) => e.id === Number(req.params.id))[0];
  if (!course) {
    throw new APIError('해당 과목을 수강하고 있지 않습니다.', 404, '/');
  }

  try {
    await course.getHomeworks();
    await course.getVideos();
  } catch (e) {
    throw new APIError(e.message, 500, e.redirect);
  }

  res.json(
    course.serialize(),
  );
});

apiRouter.use('/', () => {
  throw new APIError('없는 리소스입니다.', 404, '/');
});

export default apiRouter;
