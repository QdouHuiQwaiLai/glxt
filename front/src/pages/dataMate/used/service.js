import request from '@/utils/request';

export async function getSchoolList() {
  return request(`/v1/school/getSchoolList`);
}

export async function analStudentNumber(params) {
  return request('/v1/student/analStudentNumber', {
    method: 'POST',
    data: params,
  });
}

export async function analStudentScheme(params) {
  return request('/v1/student/analStudentScheme', {
    method: 'POST',
    data: params,
  });
}