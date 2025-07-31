/* eslint-disable @typescript-eslint/no-var-requires */
import { JwtPayload } from 'jsonwebtoken';

export type TokenStatus = 'VALID' | 'EXPIRED' | 'UNKNOWN';

export interface VerifyTokenResult {
  status: TokenStatus;
  decoded?: any;
  exp?: number;
  remain?: number; // 초 단위 남은 만료시간
  message?: string;
}

/**
 * 토큰의 상태(유효/만료/알수없음)와 남은 만료시간을 판별하는 유틸 함수
 * @param token JWT 토큰
 * @param secret 시크릿
 * @returns VerifyTokenResult
 */
export function verifyTokenStatus(
  token: string,
  secret: string,
): VerifyTokenResult {
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const remain = exp ? exp - now : undefined;
    return {
      status: 'VALID',
      decoded,
      exp,
      remain,
    };
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      // 만료된 토큰이지만 payload는 얻을 수 있음
      const decoded = jwt.decode(token) as JwtPayload;
      const exp = decoded?.exp;
      return {
        status: 'EXPIRED',
        decoded,
        exp,
        remain: 0,
        message: '만료된 토큰',
      };
    } else {
      // 서명 불일치 등
      return {
        status: 'UNKNOWN',
        message: '알 수 없는 토큰',
      };
    }
  }
}
