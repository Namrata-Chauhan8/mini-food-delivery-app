const ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomId(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function createOrderId(): string {
  return randomId(6);
}

export function createAccountId(): string {
  return `u_${randomId(10)}`;
}
