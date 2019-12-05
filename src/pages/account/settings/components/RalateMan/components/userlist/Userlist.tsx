import { Button, Col, Form, Input, Row, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from '../StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './userlistData';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../../../FooterToolbar';
import creatHistory from 'history/createHashHistory';
import styles from '../style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const history = creatHistory();

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndDeptTreeList/add'
      | 'listAndDeptTreeList/fetch'
      | 'listAndDeptTreeList/remove'
      | 'listAndDeptTreeList/update'
      | 'listAndDeptTreeList/submitArray'
    >
  >;
  loading: boolean;
  listAndDeptTreeList: StateType;
  deptId: string;
  setValue: [];
  submitting: boolean;
  resultArray:[];
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
    listAndDeptTreeList,
    loading,
  }: {
    listAndDeptTreeList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndDeptTreeList,
    loading: loading.models.listAndDeptTreeList,
    submitting: loading.effects['listAndDeptTreeList/submitArray'],

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
    },
    {
      title: '姓名',
      dataIndex: 'nickName',
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: '部门层级',
      dataIndex: 'deptRank',
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
    const values = { deptId: this.props.deptId };
    dispatch({
      type: 'listAndDeptTreeList/fetch',
      payload: values,
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
      type: 'listAndDeptTreeList/fetch',
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
      type: 'listAndDeptTreeList/fetch',
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
      type: 'listAndDeptTreeList/remove',
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
        deptId: this.props.deptId
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndDeptTreeList/fetch',
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

  // 选中行
  onClickRow = (record: { userName: any,userid: any,nickName:any,deptId:any,deptName:any }) => {
    var recordArray: any[] | never[]=[];
    recordArray.push(record.userName,record.userid,record.nickName,record.deptId,record.deptName);
    return {
      onClick: () => {
        this.props.setValue(recordArray);
      },
    };
  };
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('userName')(<Input placeholder="工号/用户姓名" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <span className={styles.submitButtons}>
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

  backClick() {
    history.goBack();
  }

  validate = () => {
    const {
      dispatch,
    } = this.props;
    const values = this.props.resultArray;
    console.log("提交的value:",values);
    // submit the values
    dispatch({
      type: 'listAndDeptTreeList/submitArray',
      payload: values,
    });
    this.props.handleCancel();//关闭当前弹窗
    this.props.refreshNode();//局部刷新页面
  };

  render() {
    const {
      listAndDeptTreeList: { data },
      loading,
      submitting,
    } = this.props;
    const { selectedRows } = this.state;
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
            onRow={this.onClickRow}
            scroll={{ y: 180 }}
          />
        </div>
        <RouteContext.Consumer>
          {() => (
            <FooterToolbar>
              <Button type="primary" onClick={this.validate} loading={submitting}>
                提交
              </Button>
              <Button type="primary" onClick={this.backClick}>
                返回
              </Button>
            </FooterToolbar>
          )}
        </RouteContext.Consumer>
      </>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
