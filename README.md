# nysc_gps

내 휴대전화의 GPS 좌표를 **도 · 각분 · 각초**(각초는 소수 둘째 자리)로 실시간 표시하는 페이지입니다.
관리 페이지에서 **운영 시작 / 운영 종료**를 눌러 페이지가 동작할지 정합니다. (관리 방식은 Cosmos Ball `nysc_game1`과 같습니다.)

## 개인정보 원칙

- GPS 좌표는 **브라우저 화면에 그리는 데에만** 쓰입니다. 서버로 보내지도, 저장하지도 않습니다.
- 서버(`api/`)는 좌표를 받는 곳이 없고, **운영 상태(켜짐/꺼짐)와 관리 번호 오입력 횟수**만 저장합니다.
- 접속하면 먼저 안내문과 [동의]/[취소]가 나옵니다. [동의]를 눌러야 브라우저의 위치 권한 창이 뜨고, [취소]는 페이지를 닫습니다.

## 주소

| 주소 | 용도 | 공유 대상 |
|---|---|---|
| `/` | 관리 페이지 (운영 시작/종료) | 나만 |
| `/location` | GPS 좌표 페이지 (운영 중에만 동작, 아니면 흰 화면) | 나 |

운영이 종료되면 `/location`을 보고 있던 화면도 3초 안에 위치 수신을 멈추고 흰 화면이 됩니다. 다시 운영을 시작하면 동의 화면부터 다시 나옵니다.
저장소에 연결하지 못하면 `/location`은 항상 흰 화면(닫힘)입니다.

## 구조

```
public/index.html   관리 페이지 (관리 번호 입력 → 운영 시작/종료)
public/location.html    GPS 페이지 (안내문 → 동의/취소 → 좌표 표시)
public/dms.js       도 → 도·각분·각초 변환
api/status.js       GET/POST 운영 상태
api/auth.js         관리 번호 확인 (5회 오입력 시 1분 잠금)
lib/store.js        저장 (Vercel 은 Turso, Render 는 Redis, 로컬은 파일)
lib/auth.js         관리 번호 확인 (Cosmos Ball 과 동일)
lib/server.js       Node 서버 (로컬 개발과 Render 가 함께 사용)
dev/server.js       로컬 개발 서버
render/server.js    Render 배포용 실행 파일 (npm start)
test/dms.test.js    변환 시험
```

## 배포 (GitHub + Vercel)

1. Vercel 에서 **Add New → Project** 로 이 저장소를 가져옵니다. 설정은 기본값 그대로입니다.
2. **Settings → Environment Variables** 에 넣습니다.
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (Sensitive): Cosmos Ball 과 같은 DB 를 써도 됩니다. 테이블 이름이 `gps_` 로 시작해 겹치지 않습니다.
   - `ADMIN_KEY`: 관리 번호(예: 4자리). 넣지 않으면 번호 없이 누구나 운영을 바꿀 수 있으니 꼭 넣으세요.
3. **Redeploy** 합니다.

> 위치 권한은 HTTPS 에서만 동작합니다. Vercel 주소는 HTTPS 이므로 그대로 쓰면 됩니다.

## 이중 배포 (Render) — Vercel 과 완전히 분리

Vercel 에 문제가 생길 때를 대비해 Render 에도 같은 저장소를 배포합니다. 두 곳은 **서버도 저장소도 따로** 씁니다.

| | Vercel | Render |
|---|---|---|
| 주소 | Vercel 주소 | https://nysc-gps.onrender.com |
| 저장소 | Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) | Render Key Value `nysc-gps-kv` (`REDIS_URL`) |
| 운영 시작/종료 | Vercel 관리 페이지에서만 | Render 관리 페이지에서만 |
| 관리 번호 | Vercel 의 `ADMIN_KEY` | Render 의 `ADMIN_KEY` |

- 운영 상태가 공유되지 않으므로 **각 관리 페이지에서 따로** 켜고 끕니다.
- Render 설정: Web Service, Runtime Node, Build `npm install`, Start `npm start`, 지역 Singapore. 환경변수 `REDIS_URL`(Key Value 의 Internal URL), `TABLE_PREFIX=gps_render`, `ADMIN_KEY`.
- 무료 Key Value 는 디스크에 보존하지 않아, 재시작되면 운영 상태가 지워지고 **운영 종료** 로 돌아갑니다. 운영 중이었다면 관리 페이지에서 다시 [운영 시작]을 누릅니다.
- 무료 웹 서비스는 15분간 접속이 없으면 잠들고, 다음 접속 때 깨어나는 데 30초~1분 걸립니다.
- 코드는 같은 GitHub 저장소에서 두 곳에 자동 배포됩니다. 잘못된 코드를 올리면 두 곳에 함께 반영되니 주의합니다.

## 로컬 실행

```
npm install
npm run dev     # http://localhost:3000  (상태는 .dev-status.json 에 저장)
npm test        # 도·각분·각초 변환 시험
```
