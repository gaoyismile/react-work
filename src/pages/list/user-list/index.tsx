import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import RoleList from './components/roleList';
import Dept from './components/dept/dept';
import styles from './style.less';
import Add from './components/add/Add';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndUserList/add'
      | 'listAndUserList/fetch'
      | 'listAndUserList/remove'
      | 'listAndUserList/update'
    >
  >;
  loading: boolean;
  listAndUserList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  deptModalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  userid: number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndUserList,
    loading,
  }: {
    listAndUserList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndUserList,
    loading: loading.models.listAndUserList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    deptModalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    userid: 0,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button icon="edit" onClick={() => this.handleUpdateModalVisible(true, record)} />
          <Button icon="delete" onClick={this.handleMenuClick} />
        </Fragment>
      ),
      width: 80,
    },
    {
      title: '账号',
      dataIndex: 'userName',
      width: 80,
    },
    {
      title: '用户姓名',
      dataIndex: 'nickName',
      width: 200,
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      width: 200,
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width: 200,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = { userStatus: '0' };
    dispatch({
      type: 'listAndUserList/fetch',
      payload: params,
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
      userStatus: '0',
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndUserList/fetch',
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
      type: 'listAndUserList/fetch',
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
    if (!selectedRows) {
      return;
    }
    if (selectedRows == null || selectedRows.length < 1) {
      alert('请至少选择一项');
      return;
    }
    const later = dispatch({
      type: 'listAndUserList/remove',
      payload: {
        key: selectedRows.map(row => row.key),
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
        userStatus: '0',
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndUserList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleDeptModalVisible = (flag?: boolean) => {
    if (this.state.userid < 1) {
      alert('请先选择用户');
      return false;
    }
    this.setState({
      deptModalVisible: !!flag,
    });
    this.projectChild.getRestProjects();
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col md={12} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('userName')(<Input placeholder="账号/用户姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit" />
              &nbsp;&nbsp;&nbsp;
              <Button
                icon="user-add"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              ></Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                icon="drag"
                type="primary"
                onClick={() => this.handleDeptModalVisible(true)}
              />
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  onRef = (ref: any) => {
    this.child = ref;
  };

  onProjectRef = (ref: any) => {
    this.projectChild = ref;
  };

  // 选中行
  onClickRow = (record: { userid: any }) => {
    return {
      onClick: () => {
        this.child.getRoles(record.userid);
        this.setState({
          userid: record.userid,
        });
      },
    };
  };

  setRowClassName = (record: { userid: any }) => {
    let className;
    record.userid === this.state.userid ? (className = 'clickRowStyle') : '1';
    return className;
  };

  changeStatus = (status: any) => {
    this.setState({
      deptModalVisible: status,
    });
  };

  changeAddStatus = (status: any) => {
    this.setState({
      modalVisible: status,
    });
  };

  refreshUser = () => {
    this.componentDidMount();
  };

  render() {
    const {
      listAndUserList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, deptModalVisible } = this.state;
    return (
      <Row gutter={24}>
        <Col lg={12} md={24}>
          用户名单
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
                onRow={this.onClickRow}
                rowClassName={this.setRowClassName}
                scroll={{ x: 1000, y: 280 }}
              />
            </div>
          </Card>
          <Dept
            deptModalVisible={deptModalVisible}
            status={this.changeStatus}
            userid={this.state.userid}
            refreshUser={this.refreshUser}
            onProjectRef={this.onProjectRef}
            //getRoles={this.getRoles}
          />
          <Add
            modalVisible={modalVisible}
            status={this.changeAddStatus}
            refreshUser={this.refreshUser}
          />
        </Col>
        <Col lg={12} md={24}>
          <RoleList onRef={this.onRef} userid={this.state.userid} />
        </Col>
      </Row>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
