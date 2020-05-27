import request from '@/utils/request';

export async function queryStudentList(params) {
  return request('/v1/student/getStudentList', {
    params,
  });
}

export async function getSchoolList() {
  return request(`/v1/school/getSchoolList`);
}

export async function deleteStudent(params) {
  return request('/v1/student/deleteStudent', {
    method: 'POST',
    data: params,
  });
}

export async function updateStudent(params) {
  return request('/v1/student/updateList', {
    method: 'POST',
    data: params,
  });
}