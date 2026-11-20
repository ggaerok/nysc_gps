// 십진수 '도' -> 도/분/초(초는 소수 둘째 자리). 반올림 후 정수로 계산해 60.00초 오류를 방지합니다.
function toDMS(value, isLat) {
  const total = Math.round(Math.abs(value) * 3600 * 100); // 1/100초 단위
  const d = Math.floor(total / 360000);
  const m = Math.floor((total % 360000) / 6000);
  const s = (total % 6000) / 100;
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
  return { d, m, s: s.toFixed(2), dir, text: `${dir} ${d}° ${m}′ ${s.toFixed(2)}″` };
}
if (typeof module !== 'undefined') module.exports = { toDMS };
