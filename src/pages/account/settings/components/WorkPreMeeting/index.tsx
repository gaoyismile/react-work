import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  Collapse,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../FooterToolbar';
import creatHistory from 'history/createHashHistory';
import UpdateDetail from './components/updateDetail'
import ViewDetail from './components/viewDetail'
import styles from './style.less';

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

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndWorkPreMeetingList/add'
      | 'listAndWorkPreMeetingList/fetch'
      | 'listAndWorkPreMeetingList/remove'
      | 'listAndWorkPreMeetingList/update'
    >
  >;
  loading: boolean;
  listAndWorkPreMeetingList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  viewModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndWorkPreMeetingList,
    loading,
  }: {
    listAndWorkPreMeetingList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndWorkPreMeetingList,
    loading: loading.models.listAndWorkPreMeetingList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    viewModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        
        <Fragment>
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a> */}
          <Button icon="search" onClick={() => this.viewItem(true, record)}>
          </Button>
          <Button icon="edit" onClick={() => this.updateItem(true, record)}>
          </Button>
        </Fragment>
      ),
    },
    {
      title: '会议标题',
      dataIndex: 'userName',
    },
    {
      title: '工单类型',
      dataIndex: 'nickName',
    },
    {
      title: '工作负责人',
      dataIndex: 'sex',
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
      type: 'listAndWorkPreMeetingList/fetch',
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
      type: 'listAndWorkPreMeetingList/fetch',
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
      type: 'listAndWorkPreMeetingList/fetch',
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
          type: 'listAndWorkPreMeetingList/remove',
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
        type: 'listAndWorkPreMeetingList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleViewModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      viewModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkPreMeetingList/update',
      payload: {
        userid: fields.userid,
        userName: fields.userName,
        nickName: fields.nickName,
        key: fields.key,
        password: fields.password,
        sex: fields.sex,
        age: fields.age,
        userStatus: fields.userStatus,
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  viewItem = (flag?: boolean, record?: FormValueType) => {
    // const { dispatch } = this.props;
    // dispatch(routerRedux.push({
    //   pathname: `/account/settings/components/WorkPreMeeting/components/detail`
    // }))
    this.setState({
      viewModalVisible: !!flag,
      stepFormValues: record || {},
    });
  }

  updateItem = (flag?: boolean, record?: FormValueType) => {
    // const { dispatch } = this.props;
    // dispatch(routerRedux.push({
    //   pathname: `/account/settings/components/WorkPreMeeting/components/detail`
    // }))
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('workPreMeetingTitle')(<Input placeholder="会议标题" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      listAndWorkPreMeetingList: { data },
      loading,
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues, viewModalVisible } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const viewMethods = {
      handleViewModalVisible: this.handleViewModalVisible,
    };
    return (
      <>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="工前会列表" key="1">
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
        <RouteContext.Consumer>
          { ()=> (
            <FooterToolbar>
              <Button type="primary" onClick={this.backClick}>
                返回
              </Button>
            </FooterToolbar>
          )}
        </RouteContext.Consumer>
        {stepFormValues &&  Object.keys(stepFormValues).length ? (
          <UpdateDetail
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <ViewDetail
            {...viewMethods}
            viewModalVisible={viewModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
