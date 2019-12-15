import React, { Component } from 'react';
import { Col, Row, Modal, Form, Button } from 'antd';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../../../../account/settings/components/FooterToolbar';
import { StateType } from './userlist/model';
import { connect } from 'dva';
import Project from './project/project';
import Userlist from './userlist/Userlist';

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndUserAddList/add'
      | 'listAndUserAddList/fetch'
      | 'listAndUserAddList/remove'
      | 'listAndUserAddList/update'
      | 'listAndUserAddList/submitArray'
    >
  >;
  loading: boolean;
  listAndUserAddList: StateType;
  deptId: string;
  setValue: [];
  submitting: boolean;
  resultArray: [];
  selectProjectRow: [];
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
  resultArray: [];
  selectProjectRow: [];
}

@connect(
  ({
    listAndUserAddList,
    loading,
  }: {
    listAndUserAddList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndUserAddList,
    loading: loading.models.listAndUserAddList,
    submitting: loading.effects['listAndUserAddList/submitArray'],
  }),
)
class TreeComponent extends Component<TableListProps, TableListState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      deptId: null,
      loading: false,
      userName: '',
      resultArray: [],
      visible: false,
      selectProjectRow: [],
    };
  }

  componentDidMount() {}

  setValue(event: any[]) {
    var newArray = this.state.resultArray;
    var flag = true;
    newArray.forEach((element: any[]) => {
      if (event[1] == element[1]) {
        flag = false;
      }
    });
    if (flag == true) {
      newArray.push(event);
    }
    this.setState({
      userName: event[0],
      resultArray: newArray,
    });
  }
  removeArray(index: any) {
    var newArray = this.state.resultArray;
    newArray.splice(index, 1);
    this.setState({
      resultArray: newArray,
    });
  }
  handleCancel = () => {
    //点击取消时,清空数组
    this.setState({
      resultArray: [],
    });
    this.props.form.resetFields(); //重置表单信息
    let status = false;
    this.props.status(status);
  };

  getSelectProject(val: any) {
    this.setState({
      selectProjectRow: val,
    });
  }

  validate = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    const values = this.state.resultArray;
    var submitArray: any[] | never[] = [];
    values.forEach((element: any[]) => {
      submitArray.push(element[1]);
    });

    validateFieldsAndScroll((error: any, formValues: any) => {
      if (!error) {
        // submit the values
        const later = dispatch({
          type: 'listAndUserAddList/submitArray',
          payload: {
            projects: this.state.selectProjectRow,
            users: submitArray,
          },
        });
        later.then(() => {
          this.handleCancel(); //关闭当前弹窗
          this.props.refreshUser(); //局部刷新页面
        }, 1000);
      }
    });
  };

  render() {
    const { modalVisible, submitting } = this.props;
    return (
      <Modal
        width="100%"
        visible={modalVisible}
        title="选择用户"
        onCancel={this.handleCancel}
        style={{ top: 0 }}
        footer={[]}
      >
        <GridContent>
          <Row gutter={24}>
            <Col lg={5} md={24}>
              <Project selectProjectRow={this.getSelectProject.bind(this)} />
            </Col>
            <Col lg={19} md={24}>
              <Userlist
                deptId={this.state.deptId}
                setValue={this.setValue.bind(this)}
                resultArray={this.state.resultArray}
                handleCancel={() => this.handleCancel()}
                refreshNode={this.props.refreshNode}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24} md={24}>
              已选择[双击移除]
              <Row gutter={[24, 12]}>
                {this.state.resultArray.map(
                  function(strs: React.ReactNode[], index: any) {
                    return (
                      <Col span={4} key={index}>
                        <div
                          className={styles.removeDiv}
                          onClick={this.removeArray.bind(this, index)}
                        >
                          {strs[2]}
                        </div>
                      </Col>
                    );
                  }.bind(this),
                )}
              </Row>
            </Col>
          </Row>
          <RouteContext.Consumer>
            {() => (
              <FooterToolbar>
                <Button type="primary" onClick={this.validate} loading={submitting}>
                  提交
                </Button>
                <Button type="primary" onClick={this.handleCancel}>
                  返回
                </Button>
              </FooterToolbar>
            )}
          </RouteContext.Consumer>
        </GridContent>
      </Modal>
    );
  }
}

export default Form.create<TableListProps>()(TreeComponent);
