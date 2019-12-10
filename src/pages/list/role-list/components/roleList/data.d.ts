export interface TableListItem {
  key: number,
  roleid: number;
  roleDesc: string;
  projectName: string;
  roleCategory: string;
  note:string;
  projectid:number;
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
  roleDesc: string;
  pageSize: number;
  currentPage: number;
  projectid:number;
}
