import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/add/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data';
import styles from './style.less';
import Add from './components/add/Add';
import Update from './components/update/Update';
import View from './components/view/View';
import Import from './components/import/Import';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRoleList/add'
      | 'listAndRoleList/fetch'
      | 'listAndRoleList/remove'
      | 'listAndRoleList/update'
      | 'listAndRoleList/export'
    >
  >; 
  loading: boolean;
  listAndRoleList: StateType;
  projectid: number;
  roleid: number;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  viewModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  visible: boolean;
  importVisible: boolean;
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  projectid: number;
  roleid: number;
  roleDesc:string;
  roleCategory:string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndRoleList,
    loading,
  }: {
    listAndRoleList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRoleList,
    loading: loading.models.listAndRoleList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    viewModalVisible: false,
    importVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    visible: false,
    projectid: 0,
    roleid: 0,
    roleDesc:'',
    roleCategory:'',
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button icon="search" onClick={() => this.handleViewModalVisible(this.props.projectid,record.roleid,record.roleDesc,record.roleCategory, true)}/>
          <Button icon="edit" onClick={() => this.handleUpdateModalVisible(this.props.projectid,record.roleid,record.roleDesc,record.roleCategory, true)}/>
          <Button icon="delete" onClick={this.handleMenuClick} />
        </Fragment>
      ),
      width: 100,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      sorter: true,
      width: 130,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      sorter: true,
      width: 200,
    },
    {
      title: '角色类别',
      dataIndex: 'roleCategory',
      sorter: true,
      width: 200,
    },
  ];

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'listAndRoleList/fetch',
    // });
  }

  shouldComponentUpdate(nextProps: { projectid: any; }, nextState: any) {
    const { projectid } = nextProps
    if (this.props.projectid !== projectid) {
      this.getRoles(projectid);
    }
    return true
  }

  getRoles = (projectid: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndRoleList/fetch',
      payload: {
        projectid: projectid,
      },
    });
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
      projectid: this.props.projectid,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndRoleList/fetch',
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
      type: 'listAndRoleList/fetch',
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
    const { dispatch,projectid } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) {
      return;
    }
    if (selectedRows == null || selectedRows.length < 1) {
      alert('请至少选择一项');
      return;
    }
    const later = dispatch({
      type: 'listAndRoleList/remove',
      payload: {
        key: selectedRows.map(row => row.roleid),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
    later.then(() => {
      // 删除之后页面要刷新，还得重新获取数据
      this.getRoles(projectid);
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
        projectid: this.props.projectid,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndRoleList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (projectid: any, flag?: boolean) => {
    this.setState({
      visible: !!flag,
      projectid: projectid,
    });
  };

  importModalVisible = (projectid: any, flag?: boolean) => {
    this.setState({
      importVisible: !!flag,
      projectid: projectid,
    });
  };

  handleUpdateModalVisible = (projectid: any,roleid: any,roleDesc: any,roleCategory: any, flag?: boolean) => {
    this.setState({
      updateModalVisible: !!flag,
      projectid: projectid,
      roleid: roleid,
      roleDesc: roleDesc,
      roleCategory: roleCategory
    });
  };

  handleViewModalVisible = (projectid: any,roleid: any,roleDesc: any,roleCategory: any, flag?: boolean) => {
    this.setState({
      viewModalVisible: !!flag,
      projectid: projectid,
      roleid: roleid,
      roleDesc: roleDesc,
      roleCategory: roleCategory
    });
  };
  
  excelPort = () => {
    const { projectid } = this.props;
    const { formValues } = this.state;
    const roleDesc = formValues.roleDesc===undefined?'':formValues.roleDesc;
    location.href="/api/role/export?projectid="+projectid+"&roleDesc="+roleDesc+"";
  }

  download = () => {
    const url = "/api/role/downloadFile";
    window.open(url)
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col md={12} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('roleDesc')(<Input placeholder="角色描述" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit" />
              &nbsp;&nbsp;&nbsp;
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(this.props.projectid, true)}
              ></Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="download" type="primary" onClick={() =>this.download()} ></Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="import" type="primary" onClick={() => this.importModalVisible(this.props.projectid, true)} ></Button>
              &nbsp;&nbsp;&nbsp;
              <Button icon="export" type="primary" onClick={() =>this.excelPort()} ></Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  changeStatus = (status: any) => {
    this.setState({
      visible: status,
    });
  };

  changeUpdateStatus = (status: any) => {
    this.setState({
      updateModalVisible: status,
    });
  };

  changeViewStatus = (status: any) => {
    this.setState({
      viewModalVisible: status,
    });
  };

  changeImportStatus = (status: any) => {
    this.setState({
      importVisible: status,
    });
  };

  refreshNode = () => {
    this.getRoles(this.props.projectid);
  };

  render() {
    const {
      listAndRoleList: { data },
      loading,
    } = this.props;
    const { selectedRows, visible,updateModalVisible,viewModalVisible,importVisible } = this.state;
    return (
      <div>
        角色信息
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey={record => record.roleid}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1000, y: 280 }}
            />
          </div>
        </Card>
        <Add
          projectid={this.state.projectid}
          visible={visible}
          status={this.changeStatus}
          refreshNode={this.refreshNode}
        />
        <Update
          projectid={this.state.projectid}
          roleid = {this.state.roleid}
          roleDesc={this.state.roleDesc}
          roleCategory={this.state.roleCategory}
          updateModalVisible={updateModalVisible}
          status={this.changeUpdateStatus}
          refreshNode={this.refreshNode}
        />
        <View
          projectid={this.state.projectid}
          roleid = {this.state.roleid}
          roleDesc={this.state.roleDesc}
          roleCategory={this.state.roleCategory}
          viewModalVisible={viewModalVisible}
          status={this.changeViewStatus}
        />
        <Import
          projectid={this.state.projectid}
          importVisible={importVisible}
          status={this.changeImportStatus}
          refreshNode={this.refreshNode}
        />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
