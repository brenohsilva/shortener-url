import * as crypto from 'crypto';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateDeterministicCode(url: string): string {
  const hash = crypto.createHash('sha256').update(url).digest();
  const number = parseInt(hash.subarray(0, 5).toString('hex'), 16);
  const short_code = encodeBase62(number).slice(0, 6);
  return short_code;
}

function encodeBase62(num: number): string {
  let encoded = '';
  while (num > 0) {
    const remainder = num % 62;
    encoded = BASE62[remainder] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded.padStart(6, '0');
}
