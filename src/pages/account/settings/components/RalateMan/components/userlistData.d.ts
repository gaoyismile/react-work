export interface TableListItem {
  key: number;
  userid: number;
  userStatus: string;
  userName: string;
  nickName: string;
  password: string;
  sex: number;
  age: number;
  updatedAt: Date;
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
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
