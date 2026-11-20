// 서버 공용: 운영 상태(on/off)만 저장합니다. GPS 좌표는 서버로 오지 않습니다.
const crypto = require('crypto');
const KEY = 'gps_viewer_running';
let mem = '0'; // 로컬 테스트용 (Upstash 환경변수가 없을 때)

async function redis(cmd) {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: JSON.stringify(cmd) });
  return (await r.json()).result;
}
const hasRedis = () => !!process.env.UPSTASH_REDIS_REST_URL;

exports.getRunning = async () => (hasRedis() ? (await redis(['GET', KEY])) : mem) === '1';
exports.setRunning = async (v) => { const s = v ? '1' : '0'; if (hasRedis()) await redis(['SET', KEY, s]); else mem = s; };
exports.checkPassword = (pw) => {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real || typeof pw !== 'string') return false;
  const a = crypto.createHash('sha256').update(pw).digest(), b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
};
