import { Button, Col, Form, Input, Row } from 'antd';
import React, { Component,Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from '../StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './userlistData';
import styles from '../style.less';
import UserAdd from './add/userlist/UserAdd';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRoleUserUpdateList/add'
      | 'listAndRoleUserUpdateList/fetch'
      | 'listAndRoleUserUpdateList/remove'
      | 'listAndRoleUserUpdateList/update'
      | 'listAndRoleUserUpdateList/submitArray'
    >
  >;
  loading: boolean;
  listAndRoleUserUpdateList: StateType;
  setValue: [];
  submitting: boolean;
  resultArray:[];
  roleid:number;
  handleCancel():{};
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  addModalVisible: boolean;
  roleid:number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndRoleUserUpdateList,
    loading,
  }: {
    listAndRoleUserUpdateList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRoleUserUpdateList,
    loading: loading.models.listAndRoleUserUpdateList,
    submitting: loading.effects['listAndRoleUserUpdateList/submitArray'],

  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    visible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    addModalVisible:false,
    roleid:this.props.roleid,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button icon="delete" onClick={this.handleMenuClick} />
        </Fragment>
      ),
      width: 100,
    },
    {
      title: '工号',
      dataIndex: 'userName',
      width:100,
    },
    {
      title: '姓名',
      dataIndex: 'nickName',
      width:200,
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width:200,
    },
    {
      title: '部门层级',
      dataIndex: 'deptRank',
      width:200,
    },
  ];

  componentDidMount() {
    this.getUserList(this.props.roleid);
  }

  shouldComponentUpdate(nextProps: { roleid: any; }, nextState: any) {
    const { roleid } = nextProps
    if (this.props.roleid !== roleid) {
      this.getUserList(roleid);
    }
    return true
  }

  getUserList = (roleid:any) =>{
    const { dispatch} = this.props;
    const params = {
      roleid:roleid,
    }
    dispatch({
      type: 'listAndRoleUserUpdateList/fetch',
      payload: params,
    });
  };

  refreshNode = () => {
    this.componentDidMount();
  };

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
      roleid:this.props.roleid,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'listAndRoleUserUpdateList/fetch',
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
      type: 'listAndRoleUserUpdateList/fetch',
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
    const { dispatch,roleid } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) {
      return;
    }
    if (selectedRows == null || selectedRows.length < 1) {
      alert('请至少选择一项');
      return;
    }
    const later = dispatch({
      type: 'listAndRoleUserUpdateList/remove',
      payload: {
        key: selectedRows.map(row => row.key),
        roleid:roleid,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
    later.then(() => {
      // 删除之后页面要刷新，还得重新获取数据
      this.componentDidMount();
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
        roleid: this.props.roleid,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndRoleUserUpdateList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  addItem = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  addUser = (flag?: boolean) => { 
    this.setState({
      addModalVisible: !!flag,
    });
  };

  changeStatus = (status: any) =>{
    this.setState({
      addModalVisible:status
    })
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={18} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('userName')(<Input placeholder="工号/用户姓名" />)}
            </FormItem>
            <Button icon="search" type="primary" htmlType="submit"></Button>
            &nbsp;&nbsp;
            <Button icon="plus" type="primary" onClick={() => this.addUser(true)}></Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  backClick= () => {
    this.props.handleCancel();//关闭当前弹窗
  }

  render() {
    const {
      listAndRoleUserUpdateList: { data },
      loading,
    } = this.props;
    const { selectedRows ,addModalVisible} = this.state;
    return (
      <>
        <div className={styles.tableList}>
          
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 1000,y: 180 }}
          />
        </div>
        <div>
          <UserAdd  
            addModalVisible={addModalVisible} 
            status={this.changeStatus}
            roleid={this.props.roleid}
            refreshNode={this.refreshNode}
          />
        </div>
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
