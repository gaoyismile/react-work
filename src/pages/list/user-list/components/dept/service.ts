import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryRule(params: TableListParams) {
  return request('/api/role/projects', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/rule/delete', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/user/addDept', {
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
