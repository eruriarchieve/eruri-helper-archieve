import open from 'open';
import createApp from './create-app';

(async () => {
  const app = await createApp();
  app.listen(3000);

  process.stdout.write('http://localhost:3000/\n');
  await open('http://localhost:3000/sign', { wait: true }); // 브라우저로 열기

  process.exit(0); // 종료
})();
