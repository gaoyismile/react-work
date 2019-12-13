import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Modal,
  message,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from '../StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data';
import Tree from './tree/Tree';
import treeStyles from './tree/Tree.less';

//import RoleList from './components/roleList';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndUserDeptList/add'
      | 'listAndUserDeptList/fetch'
      | 'listAndUserDeptList/remove'
      | 'listAndUserDeptList/update'
    >
  >;
  loading: boolean;
  listAndUserDeptList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  projectid:number;
  objectData: {},
  deptid:number,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndUserDeptList,
    loading,
  }: {
    listAndUserDeptList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndUserDeptList,
    loading: loading.models.listAndUserDeptList,
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
    objectData: {},
    deptid:0,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width:400,
    },
  ];

  componentDidMount() {
    var t = this;
    fetch("/api/getTreeJson?id=0", {method: 'GET'}).then(
      function (res) {
          res.json().then(function (data) {
                  var dataJson = JSON.stringify(data.objectData);
                  var datas = dataJson.substring(1,dataJson.length-1);
                  t.setState({
                    objectData: JSON.parse(datas)
                  });
              }
          )
      });
      this.props.onProjectRef(this);
  }

  getRestProjects= () =>{
    const { dispatch } = this.props;
      dispatch({
        type: 'listAndUserDeptList/fetch',
      });

  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listAndUserDeptList/fetch',
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
        type: 'listAndUserDeptList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndUserDeptList/fetch',
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
        // this.child.getRoles(record.projectid);
        // this.setState({
        //   projectid:record.projectid
        // })
      },
    };
  };

  onNodeClick = (e: any, node: { id: any; name: any; }) => {
    console.info('TreeTest---onNodeClick---', node);
    this.setState({ deptid: node.id });
    //node.id === 6 ? this.refs.clickNodeStyles.style.backgroundColor = 'blanchedalmond':'1';
    // let className;
    // node.id === 1 ? className = 'clickBackgroud':'1';
    // return className;
  };
  
  handleCancel = () => {//点击取消
    let status = false;
    this.props.status(status);
  };

  okHandle = () => {
    const { dispatch } = this.props;
    const { deptid } = this.state;
    const later = dispatch({
      type: 'listAndUserDeptList/add',
      payload: {
        userid:this.props.userid,
        deptid: deptid,   
      },
    });
    message.success('添加成功');
    this.handleCancel();//关闭弹窗
    later.then(()=>{//刷新列表
      this.props.refreshUser();//局部刷新页面
    })
  
};

  render() {
    const {
      listAndUserDeptList: { data },
      loading,
      deptModalVisible,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <Modal
        destroyOnClose
        title="选择部门"
        style={{ top: 20 }}
        width="80%"
        visible={deptModalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCancel}
      >
      <Row gutter={24}>
        <Col lg={8} md={24}>
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
        </Col>
      <Col lg={16} md={24}>
                {/* <RoleList 
                  onRef={this.onRef}
                  projectid={this.state.projectid}
                /> */}
          <div ref='clickNodeStyles'>
            <Tree onNodeClick={this.onNodeClick.bind(this)} treeNodes={this.state.objectData} />
          </div>    
        </Col>
      </Row>
      </Modal>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
