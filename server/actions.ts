'use server'

import { signIn, signOut } from '~/server/auth'
import { queryAuthSecret, queryAuthStatus } from '~/server/db/query'
import * as OTPAuth from "otpauth"

export async function authenticate(
  email: string, password: string, token: string
) {
  const enable = await queryAuthStatus();
  if (enable?.config_value === 'true') {
    const secret = await queryAuthSecret();
    let totp = new OTPAuth.TOTP({
      issuer: "PicImpact",
      label: "admin",
      algorithm: "SHA512",
      digits: 6,
      period: 30,
      // @ts-ignore
      secret: OTPAuth.Secret.fromBase32(secret?.config_value),
    });
    let delta = totp.validate({ token: token, window: 1 })
    if (delta !== 0) {
      throw new Error('双因素口令验证失败！')
    }
  }

  try {
    await signIn('Credentials', {
      email: email,
      password: password,
      redirect: false,
    });
  } catch (e: any) {
    // next-auth CredentialsSignin error — don't rethrow the raw error
    if (e?.type === 'CredentialsSignin' || e?.message?.includes('CredentialsSignin')) {
      throw new Error('邮箱或密码错误！')
    }
    throw new Error('登录失败，请稍后重试')
  }
}

export async function loginOut() {
  try {
    await signOut({
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}