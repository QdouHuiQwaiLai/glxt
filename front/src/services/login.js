import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/v1/user/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}


export async function fakeAccountRegister(params) {
  return request('/v1/user/create', {
    method: 'POST',
    data: params,
  })
}
