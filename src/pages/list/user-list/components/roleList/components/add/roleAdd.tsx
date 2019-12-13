import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Modal,
  message
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from '../StandardTable';
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
      | 'listAndUserRoleAddList/add'
      | 'listAndUserRoleAddList/fetch'
      | 'listAndUserRoleAddList/remove'
      | 'listAndUserRoleAddList/update'
    >
  >;
  loading: boolean;
  listAndUserRoleAddList: StateType;
  userid:number;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  visible: false,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndUserRoleAddList,
    loading,
  }: {
    listAndUserRoleAddList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndUserRoleAddList,
    loading: loading.models.listAndUserRoleAddList,
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
    visible: false,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width:130,
    },
    {
      title: '角色类别',
      dataIndex: 'roleCategory',
      width:200,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width:200,
    },
  ];

  
  componentDidMount() {
    // const { dispatch,userid } = this.props;
    // console.log("当前userid:",this.props.userid);
    // if(userid != 0){
    //   dispatch({
    //     type: 'listAndUserRoleAddList/fetch',
    //     payload: {
    //       userid: this.props.userid,
    //     },
    //   });
    // }
    this.props.onRef(this);
  }

  getRestRoles= () =>{
    const { dispatch,userid } = this.props;
    if(userid != 0){
      dispatch({
        type: 'listAndUserRoleAddList/fetch',
        payload: {
          userid: this.props.userid,
        },
      });
    }
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
      type: 'listAndUserRoleAddList/fetch',
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
      type: 'listAndUserRoleAddList/fetch',
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
        userid: this.props.userid
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndUserRoleAddList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} >
        <Row gutter={24}>
          <Col md={12} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('roleDesc')(<Input placeholder="角色描述" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit"/>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  handleCancel = () => {//点击取消时,清空数组
    let status = false;
    this.props.status(status);
  };

  okHandle = () => {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      const later = dispatch({
        type: 'listAndUserRoleAddList/add',
        payload: {
          key: selectedRows.map(row => row.roleid),
          userid:this.props.userid,
        },
      });
      message.success('添加成功');
      this.handleCancel();//关闭弹窗
      later.then(()=>{//刷新列表
        this.props.getRoles(this.props.userid+'');//局部刷新页面
      })
    
  };
  render() {
    const {
      listAndUserRoleAddList: { data },
      loading,
      modalVisible,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <Modal
        destroyOnClose
        title="添加角色"
        style={{ top: 20 }}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCancel}
      >
        <div>       
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
                  scroll={{ x: 1000 ,y:260}}
                />
            </div> 
          </Card>
        </div>   
      </Modal>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
