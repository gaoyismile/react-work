export interface TableListItem {
  key: number,
  userid: number;
  userName: string;
  nickName: string;
  deptName: string;
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
  status: string;
  userName: string;
  pageSize: number;
  currentPage: number;
}
