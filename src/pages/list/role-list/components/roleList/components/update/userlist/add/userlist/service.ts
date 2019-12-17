import request from '@/utils/request';
import { TableListParams } from './userlistData';

export async function queryRule(params: TableListParams) {
  return request('/api/userDeptTreeList', {
    params,
  });
}

export async function submitUserArray(params: any) {
  return request('/api/user/choose', {
    method: 'POST',
    data: params,
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
  return request('/api/role/addUserRoleByUser', {
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
