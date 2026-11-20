# nysc_gps

휴대전화의 GPS 좌표(도·분·초, 초는 소수 둘째 자리)를 화면에 실시간으로 보여주는 페이지.
좌표는 브라우저 화면에만 표시되며 서버로 전송하거나 저장하지 않는다.

- `index.html` 사용자 화면 (안내문 → 동의/취소 → 좌표 표시)
- `admin.html` 관리페이지 (비밀번호 접속, 운영 시작/종료)
- `api/` 운영 상태(on/off)만 저장하는 서버 함수
- 환경변수: `ADMIN_PASSWORD`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
