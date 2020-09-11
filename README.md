# 이루리 도우미

<div style="text-align: center;">
<img src="https://raw.githubusercontent.com/cstria0106/eruri-helper-standalone/master/public/img/gomduri.png" width="300"></img>
</div>

강원대학교 e-루리를 크롤링해 강의와 과제 진행 상황을 한눈에 확인하는 애플리케이션입니다.

기존의 [e-루리 도우미](https://github.com/cstria0106/eruri-helper)를 다시 작성한 프로그램입니다.

## 변경사항
하나의 프로그램에서 전부 동작하도록 만들었습니다. 일렉트론을 사용하는 대신 express 프레임워크로 웹페이지를 호스팅해서 웹 브라우저로 사용할 수 있도록 바꾸었습니다.

## 설치
아래 명령어로 설치하여 디버그 모드로 실행할 수 있습니다.
```sh
yarn install
yarn dev
```
아래 명령어로 빌드할 수 있습니다.
```sh
yarn build
```
아래 명령어로 패키징할 수 있습니다.
```sh
yarn postpack
yarn pack
```