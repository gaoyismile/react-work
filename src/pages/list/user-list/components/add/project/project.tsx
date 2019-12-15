import { Form } from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './StandardTable';
import { TableListItem } from './data';
import styles from './style.less';

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
  projectid: number;
  objectData: {};
  deptid: number;
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
    projectid: 0,
    objectData: {},
    deptid: 0,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 400,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndUserDeptList/fetch',
    });
    //this.props.onProjectRef(this);
  }

  getRestProjects = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndUserDeptList/fetch',
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    var projectArray: number[] = [];
    rows.forEach(rows => {
      projectArray.push(rows.projectid);
    });
    this.setState({
      selectedRows: rows,
    });
    this.props.selectProjectRow(projectArray);
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      listAndUserDeptList: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div className={styles.tableList}>
        <StandardTable
          rowKey={record => record.projectid}
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          pagination={false}
        />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
