export interface TableListItem {
  key: number;
  userid: number;
  userName: string;
  nickName: string;
  deptId: number;
  deptName: string;
  deptRank: string;
  createdAt: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  roleid: number;
  userName: string;
  pageSize: number;
  currentPage: number;
}
