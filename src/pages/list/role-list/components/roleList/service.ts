import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  return request('/api/role/getRolesByProject', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/role/delete', {
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
