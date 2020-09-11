import puppeteer from 'puppeteer';
import path from 'path';

export default function getChromiumPath() {
  const isPkg = typeof process.pkg !== 'undefined';

  let chromiumExecutablePath = (isPkg
    ? puppeteer.executablePath().replace(
      /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
      path.join(path.dirname(process.execPath), 'chromium'),
    )
    : puppeteer.executablePath()
  );

  // check win32
  if (process.platform === 'win32') {
    chromiumExecutablePath = (isPkg
      ? puppeteer.executablePath().replace(
        /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
        path.join(path.dirname(process.execPath), 'chromium'),
      )
      : puppeteer.executablePath()
    );
  }

  return chromiumExecutablePath;
}
