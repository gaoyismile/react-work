import {
  Button,
  Col,
  Form,
  Input,
  Row,
  message,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import StandardTable, { StandardTableColumnProps } from '../components/StandardTable';
import { FormValueType } from '../components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from '../data';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../../FooterToolbar';
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
      | 'listAndWorkApplicationList/add'
      | 'listAndWorkApplicationList/fetch'
      | 'listAndWorkApplicationList/remove'
      | 'listAndWorkApplicationList/update'
    >
  >;
  loading: boolean;
  listAndWorkApplicationList: StateType;
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
    listAndWorkApplicationList,
    loading,
  }: {
    listAndWorkApplicationList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndWorkApplicationList,
    loading: loading.models.listAndWorkApplicationList,
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
      title: '部门',
      dataIndex: 'sex',
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
    dispatch({
      type: 'listAndWorkApplicationList/fetch',
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
      type: 'listAndWorkApplicationList/fetch',
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
      type: 'listAndWorkApplicationList/fetch',
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
      type: 'listAndWorkApplicationList/remove',
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
        type: 'listAndWorkApplicationList/fetch',
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

  addItem = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkApplicationList/update',
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
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  }
  handleAdd = (fields: { userName: any,password: any,nickName: any,sex: any,age: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndWorkApplicationList/add',
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

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('workApplicationTitle')(<Input placeholder="姓名/工号" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search"  type="primary" htmlType="submit">
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

  backClick(){
    history.goBack();
  }

  
  render() {
    const {
      listAndWorkApplicationList: { data },
      loading,
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
                  scroll={{ y: 220 }}
                />
              </div>
        <RouteContext.Consumer>
          { ()=> (
            <FooterToolbar>
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
