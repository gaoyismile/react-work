import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Collapse,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action,AnyAction, Reducer } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect,EffectsCommandMap } from 'dva';
import moment from 'moment';
import StandardTable, { StandardTableColumnProps } from '../components/StandardTable';
import creatHistory from 'history/createHashHistory';
import request from '@/utils/request';

import styles from '../../../style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['success', 'error'];
const userStatus = ['正常', '失效'];
const { Panel } = Collapse;
const history = creatHistory();

export interface TableListItem {
  key: number,
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

export async function queryRule(params: TableListParams) {
  return request('/api/rule', {
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

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndWorkApplicationList/add'
      | 'listAndWorkApplicationList/fetch'
      | 'listAndWorkApplicationList/remove'
      | 'listAndWorkApplicationList/update'
    >
  >;
  loading: boolean;
  listAndWorkApplicationList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

// const Model: ModelType = {
//   namespace: 'listAndWorkApplicationList',

//   state: {
//     data: {
//       list: [],
//       pagination: {},
//     },
//   },

//   effects: {
//     *fetch({ payload }, { call, put }) {
//       const response = yield call(queryRule, payload);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//     },
//     *add({ payload, callback }, { call, put }) {
//       const response = yield call(addRule, payload);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//       if (callback) callback();
//     },
//     *remove({ payload, callback }, { call, put }) {
//       const response = yield call(removeRule, payload);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//       if (callback) callback();
//     },
//     *update({ payload, callback }, { call, put }) {
//       const response = yield call(updateRule, payload);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//       if (callback) callback();
//     },
//   },

//   reducers: {
//     save(state, action) {
//       return {
//         ...state,
//         data: action.payload,
//       };
//     },
//   },
// };

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndWorkApplicationList,
    loading,
  }: {
    listAndWorkApplicationList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndWorkApplicationList,
    loading: loading.models.listAndWorkApplicationList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
          <Button shape="circle" icon="download" onClick={() => this.viewItem ()}>
          </Button>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (val: string) => `${val}`==='1'?'男':'女',
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      filters: [
        {
          text: userStatus[0],
          value: '0',
        },
        {
          text: userStatus[1],
          value: '1',
        },
      ],
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={userStatus[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkApplicationList/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndWorkApplicationList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listAndWorkApplicationList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listAndWorkApplicationList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndWorkApplicationList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  viewItem = () => {
    //const { dispatch } = this.props;
    // dispatch(routerRedux.push({
    //   pathname: `/account/settings/components/WorkApplication/components/detail`
    // }))
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('workApplicationTitle')(<Input placeholder="文档名称/文档编号" />)}
            </FormItem>
            <span className={styles.submitButtons}>
              <Button icon="search"  type="primary" htmlType="submit">
              </Button>
            </span>
          </Col>           
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  backClick(){
    history.goBack();
  }

  render() {
    const {
      listAndWorkApplicationList: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="现场评估附件信息" key="1">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </Panel>
        </Collapse>
        
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
