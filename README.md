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
| `/play` | GPS 좌표 페이지 (운영 중에만 동작, 아니면 흰 화면) | 나 |

운영이 종료되면 `/play`를 보고 있던 화면도 3초 안에 위치 수신을 멈추고 흰 화면이 됩니다. 다시 운영을 시작하면 동의 화면부터 다시 나옵니다.
저장소에 연결하지 못하면 `/play`는 항상 흰 화면(닫힘)입니다.

## 구조

```
public/index.html   관리 페이지 (관리 번호 입력 → 운영 시작/종료)
public/play.html    GPS 페이지 (안내문 → 동의/취소 → 좌표 표시)
public/dms.js       도 → 도·각분·각초 변환
api/status.js       GET/POST 운영 상태
api/auth.js         관리 번호 확인 (5회 오입력 시 1분 잠금)
lib/store.js        저장 (Turso, 로컬은 파일)
lib/auth.js         관리 번호 확인 (Cosmos Ball 과 동일)
dev/server.js       로컬 개발 서버
test/dms.test.js    변환 시험
```

## 배포 (GitHub + Vercel)

1. Vercel 에서 **Add New → Project** 로 이 저장소를 가져옵니다. 설정은 기본값 그대로입니다.
2. **Settings → Environment Variables** 에 넣습니다.
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (Sensitive): Cosmos Ball 과 같은 DB 를 써도 됩니다. 테이블 이름이 `gps_` 로 시작해 겹치지 않습니다.
   - `ADMIN_KEY`: 관리 번호(예: 4자리). 넣지 않으면 번호 없이 누구나 운영을 바꿀 수 있으니 꼭 넣으세요.
3. **Redeploy** 합니다.

> 위치 권한은 HTTPS 에서만 동작합니다. Vercel 주소는 HTTPS 이므로 그대로 쓰면 됩니다.

## 로컬 실행

```
npm install
npm run dev     # http://localhost:3000  (상태는 .dev-status.json 에 저장)
npm test        # 도·각분·각초 변환 시험
```
