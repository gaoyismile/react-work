import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import RoleList from './components/roleList';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRList/add'
      | 'listAndRList/fetch'
      | 'listAndRList/remove'
      | 'listAndRList/update'
    >
  >;
  loading: boolean;
  listAndRList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  projectid:number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndRList,
    loading,
  }: {
    listAndRList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRList,
    loading: loading.models.listAndRList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    projectid:0,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button icon="search" />
        </Fragment>
      ),
      width:20,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width:200,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndRList/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listAndRList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
        type: 'listAndRList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = (fields: { userName: any,password: any,nickName: any,sex: any,age: any }) => {
    const { dispatch } = this.props;
    const later = dispatch({
      type: 'listAndRList/add',
      payload: {
        userName: fields.userName,
        password: fields.password,
        nickName: fields.nickName,
        sex: fields.sex,
        age: fields.age,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();//关闭弹窗
    later.then(()=>{//刷新列表
      this.componentDidMount();
    })
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    const later = dispatch({
      type: 'listAndRList/update',
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
    later.then(()=>{//刷新列表
      this.componentDidMount();
    })
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndRList/fetch',
      payload: params,
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
              <Button type="primary" icon="search" htmlType="submit"/>
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

  renderForm() {
    return this.renderSimpleForm();
  }

  onRef = (ref) => {
    this.child = ref
}
   // 选中行
   onClickRow = (record: { projectid: any; }) => {
    return {
      onClick: () => {
        this.child.getRoles(record.projectid);
        this.setState({
          projectid:record.projectid
        })
      },
    };
  };

  refreshNode = () =>{
    this.componentDidMount();
  }
  render() {
    const {
      listAndRList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Row gutter={24}>
        <Col lg={8} md={24}>
        项目列表 
        <Card bordered={false}>
          <div className={styles.tableList}>
                <StandardTable
                rowKey={record => record.projectid}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                pagination={false}
                onChange={this.handleStandardTableChange}
                onRow={this.onClickRow}
                />
          </div> 
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </Col>
      <Col lg={16} md={24}>
                <RoleList 
                  onRef={this.onRef}
                  projectid={this.state.projectid}
                />
        </Col>
      </Row>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
