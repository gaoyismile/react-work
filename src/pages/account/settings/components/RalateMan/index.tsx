import {
  Button,
  Card,
  Col,
  Modal,
  Form,
  Input,
  Row,
  message,
  Collapse,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../FooterToolbar';
import creatHistory from 'history/createHashHistory';
import Add from './components/Add';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { Panel } = Collapse;
const history = creatHistory();

interface RelateManListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRelateManList/add'
      | 'listAndRelateManList/fetch'
      | 'listAndRelateManList/remove'
      | 'listAndRelateManList/update'
    >
  >;
  loading: boolean;
  listAndRelateManList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listAndRelateManList,
    loading,
  }: {
    listAndRelateManList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRelateManList,
    loading: loading.models.listAndRelateManList,
  }),
)
class TableList extends Component<RelateManListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    visible: false,
    selectedRows: [],
    formValues: {},
  };

  columns: StandardTableColumnProps[] = [
    { 
      title: '操作',
      render: (text, record) => (     
        <Fragment>
          <Button icon="delete" onClick={this.handleMenuClick} />
        </Fragment>
      ),
    },
    {
      title: '工号',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      dataIndex: 'nickName',
    },
    {
      title: '部门id',
      dataIndex: 'deptId',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
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
      type: 'listAndRelateManList/fetch',
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
      type: 'listAndRelateManList/fetch',
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
      type: 'listAndRelateManList/fetch',
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
      type: 'listAndRelateManList/remove',
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
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listAndRelateManList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  changeStatus = (status: any) =>{
    this.setState({
      visible:status
    })
  }
  
  refreshNode = () =>{
    this.componentDidMount();
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速查询">
              {getFieldDecorator('userName')(<Input placeholder="姓名/工号" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search"  type="primary" htmlType="submit">
              </Button>
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

  cancelModal = () => {
    this.setState({ visible: false });
  };

  backClick = () =>{
    this.props.cancelModal();//关闭当前弹窗
  }

  
  render() {
    const {
      listAndRelateManList: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const { visible } = this.state;
    return (
      <>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="相关人员" key="1">
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
                />
              </div>
            </Card>
          </Panel>
        </Collapse>
        <RouteContext.Consumer>
          { ()=> (
            <FooterToolbar>
              <Button type="primary" onClick={this.backClick}>
                返回
              </Button>
            </FooterToolbar>
          )}
        </RouteContext.Consumer> 
        <Add 
          visible={visible} 
          status={this.changeStatus}
          refreshNode={this.refreshNode}
        />
      </>
    );
  }
}

export default Form.create<RelateManListProps>()(TableList);
