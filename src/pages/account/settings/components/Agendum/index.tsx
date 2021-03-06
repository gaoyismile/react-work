import {
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
import CreateForm from './components/CreateForm';
import CreateForm2 from './components/CreateForm2';
import { TableListItem, TableListPagination, TableListParams } from './data';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../FooterToolbar';
import creatHistory from 'history/createHashHistory';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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
  modalVisible2: boolean;
  updateModalVisible: boolean;
  viewModalVisible: boolean;
  visible: false,
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
    visible: false,
    modalVisible2: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        
        <Fragment>
          <Button icon="edit"/>
          <Button icon="download"/>
          <Button icon="delete" onClick={this.handleMenuClick} />  
        </Fragment>
      ),
    },
    {
      title: '编号',
      dataIndex: 'userName',
    },
    {
      title: '标题',
      dataIndex: 'nickName',
    },
    {
      title: '备注',
      dataIndex: 'sex',
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    
  ];

  columns2: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        
        <Fragment>
          <Button icon="environment"/>
          <Button icon="download"/>
          <Button icon="delete" onClick={this.handleMenuClick}/>  
        </Fragment>
      ),
    },
    {
      title: '文档标题',
      dataIndex: 'userName',
    },
    {
      title: '上传人',
      dataIndex: 'nickName',
    },
    {
      title: '上传时间',
      dataIndex: 'sex',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '备注',
      dataIndex: 'userStatus',
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

  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows){
      return;
    }
    if (selectedRows==null || selectedRows.length<1){
      alert("请至少选择一项");
      return;
    }
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

  handleModalVisible2 = (flag?: boolean) => {
    this.setState({
      modalVisible2: !!flag,
    });
  };

  handleAdd = (fields: { userName: any,password: any,nickName: any,sex: any,age: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkPreMeetingList/add',
      payload: {
        userName: fields.userName,
        password: fields.password,
        nickName: fields.nickName,
        sex: fields.sex,
        age: fields.age,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleAdd2 = (fields: { userName: any,password: any,nickName: any,sex: any,age: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkPreMeetingList/add',
      payload: {
        userName: fields.userName,
        password: fields.password,
        nickName: fields.nickName,
        sex: fields.sex,
        age: fields.age,
      },
    });
    message.success('添加成功');
    this.handleModalVisible2();
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
              {getFieldDecorator('workPreMeetingTitle')(<Input placeholder="编号/标题" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search"  type="primary" htmlType="submit">
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="delete" type="primary" onClick={this.handleMenuClick} />
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleForm2() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('workPreMeetingTitle')(<Input placeholder="文档标题" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search"  type="primary" htmlType="submit">
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible2(true)}>
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="delete" type="primary" onClick={this.handleMenuClick}/>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  renderForm2() {
    return this.renderSimpleForm2();
  }

  backClick(){
    history.goBack();
  }

  
  render() {
    const {
      listAndWorkPreMeetingList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, modalVisible2 } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentMethods2 = {
      handleAdd2: this.handleAdd2,
      handleModalVisible2: this.handleModalVisible2,
    };
    // const viewMethods = {
    //   handleViewModalVisible: this.handleViewModalVisible,
    // };
    return (
      <>
        <Collapse defaultActiveKey={['1','2']}>
          <Panel header="规程信息" key="1">
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
          <Panel header="参考文档" key="2">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm2()}</div>               
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns2}
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateForm2 {...parentMethods2} modalVisible={modalVisible2} />
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
