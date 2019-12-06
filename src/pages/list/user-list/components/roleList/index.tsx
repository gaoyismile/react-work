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
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndUserRoleList/add'
      | 'listAndUserRoleList/fetch'
      | 'listAndUserRoleList/remove'
      | 'listAndUserRoleList/update'
    >
  >;
  loading: boolean;
  listAndUserRoleList: StateType;
  userid:number;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndUserRoleList,
    loading,
  }: {
    listAndUserRoleList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndUserRoleList,
    loading: loading.models.listAndUserRoleList,
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
        <Fragment>
          <Button icon="delete" onClick={this.handleMenuClick} />
        </Fragment>
      ),
      width:80,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width:130,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width:200,
    },
    {
      title: '备注',
      dataIndex: 'note',
      width:200,
    },
  ];

  getRoles= (userid: string) =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'listAndUserRoleList/fetch',
      payload: {
        userid: userid,
      },
    });
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'listAndUserRoleList/fetch',
    // });
    this.props.onRef(this);
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
      userid: this.props.userid,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndUserRoleList/fetch',
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
      type: 'listAndUserRoleList/fetch',
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
    const later =dispatch({
      type: 'listAndUserRoleList/remove',
      payload: {
        key: selectedRows.map(row => row.key),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
    later.then(()=>{// 删除之后页面要刷新，还得重新获取数据
      this.componentDidMount();
    })
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
        userid: this.props.userid
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndUserRoleList/fetch',
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

  handleAdd = (fields: { userName: any,password: any,nickName: any,sex: any,age: any }) => {
    const { dispatch } = this.props;
    const later = dispatch({
      type: 'listAndUserRoleList/add',
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
      type: 'listAndUserRoleList/update',
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
              <Button type="primary" icon="search" htmlType="submit"/>
              &nbsp;&nbsp;&nbsp;
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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

  render() {
    const {
      listAndUserRoleList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
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
                scroll={{ x: 1000 ,y:280}}
                />
          </div> 
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
    </div>   
    );
  }
}

export default Form.create<TableListProps>()(TableList);
