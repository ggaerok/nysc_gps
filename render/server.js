// Render 배포용 실행 파일 (npm start). Vercel 배포와 같은 페이지·API 를 제공한다.
// 운영 상태는 Vercel 과 같은 Turso DB 에 저장되므로, 어느 쪽 관리 페이지에서 바꿔도 두 곳에 함께 적용된다.
// 저장소 환경변수(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)가 없으면 /location 은 항상 닫힘(흰 화면)으로 동작한다.
delete process.env.STATUS_FILE;   // 배포에서는 파일 저장소를 쓰지 않는다 (재시작 시 사라지고 Vercel 과 공유되지 않음)
require('../lib/server').start(Number(process.env.PORT) || 10000, '0.0.0.0');
