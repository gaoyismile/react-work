import { Button, Col, Form, Input, Row,Modal,message } from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './userlistData';
import styles from '../style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRoleAddUserList/add'
      | 'listAndRoleAddUserList/fetch'
      | 'listAndRoleAddUserList/remove'
      | 'listAndRoleAddUserList/update'
      | 'listAndRoleAddUserList/submitArray'
    >
  >;
  loading: boolean;
  listAndRoleAddUserList: StateType;
  setValue: [];
  submitting: boolean;
  resultArray: [];
  roleid:number;
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndRoleAddUserList,
    loading,
  }: {
    listAndRoleAddUserList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRoleAddUserList,
    loading: loading.models.listAndRoleAddUserList,
    submitting: loading.effects['listAndRoleAddUserList/add'],
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
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '工号',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'nickName',
      width: 200,
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width: 200,
    },
    {
      title: '部门层级',
      dataIndex: 'deptRank',
      width: 200,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndRoleAddUserList/fetch',
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
      type: 'listAndRoleAddUserList/fetch',
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
      type: 'listAndRoleAddUserList/fetch',
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
    dispatch({
      type: 'listAndRoleAddUserList/remove',
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
    console.log("选中rows:",rows);
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
        type: 'listAndRoleAddUserList/fetch',
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
    let status = false;
    this.props.status(status);
  };

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
            <span>
              <Button icon="search" type="primary" htmlType="submit"></Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  backClick = () => {
    this.props.handleCancel(); //关闭当前弹窗
  };

  okHandle = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const later = dispatch({
      type: 'listAndRoleAddUserList/add',
      payload: {
        key: selectedRows.map(row => row.userid),
        roleid:this.props.roleid,
      },
    });
    message.success('添加成功');
    this.handleCancel();//关闭弹窗
    later.then(()=>{//刷新列表
      this.componentDidMount();
      this.props.refreshNode(); //局部刷新页面
    })
  };

  render() {
    const {
      listAndRoleAddUserList: { data },
      loading,
      addModalVisible,
    } = this.props;
    const { selectedRows } = this.state;
    return ( 
      <Modal
        destroyOnClose
        title="添加分配用户"
        style={{ top: 20 }}
        visible={addModalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCancel}
      >
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 1000,y: 220 }} 
          />
        </div>
      </Modal>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
