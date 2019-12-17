import request from '@/utils/request';
import { TableListParams } from './userlistData';

export async function queryRule(params: TableListParams) {
  return request('/api/user/getUserListByRole', {
    params,
  });
}

export async function submitUserArray(params: any) {
  return request('/api/role/update', {
    method: 'POST',
    data: params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/role/deleteUser', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule/update', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
