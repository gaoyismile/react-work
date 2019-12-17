import React, { Component } from 'react';
import { Col, Row, Modal, Collapse, Form, Input, Select, Button, Icon, Popover } from 'antd';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { RouteContext } from '@ant-design/pro-layout';
import FooterToolbar from '../../../../../../account/settings/components/FooterToolbar';
import { StateType } from './userlist/model';
import { connect } from 'dva';
import Userlist from './userlist/Userlist';

const { Panel } = Collapse;
const { Option } = Select;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'listAndRoleUserUpdateList/add'
      | 'listAndRoleUserUpdateList/fetch'
      | 'listAndRoleUserUpdateList/remove'
      | 'listAndRoleUserUpdateList/update'
      | 'listAndRoleUserUpdateList/submitArray'
    >
  >;
  loading: boolean;
  listAndRoleUserUpdateList: StateType;
  setValue: [];
  submitting: boolean;
  resultArray: [];
  projectid:number;
  roleDesc:string;
  roleCategory:string;
  roleid:number;
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
  resultArray: [];
}

@connect(
  ({
    listAndRoleUserUpdateList,
    loading,
  }: {
    listAndRoleUserUpdateList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listAndRoleUserUpdateList,
    loading: loading.models.listAndRoleUserUpdateList,
    submitting: loading.effects['listAndRoleUserUpdateList/submitArray'],
  }),
)
class TreeComponent extends Component<TableListProps, TableListState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      loading: false,
      userName: '',
      resultArray: [],
      updateModalVisible: false,

    };
  }
  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}></div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };
  componentDidMount() {
    //this.props.onUserRef(this);
  }

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

  validate = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error: any, formValues: any) => {
      if (!error) {
        // submit the values
        const later = dispatch({
          type: 'listAndRoleUserUpdateList/submitArray',
          payload: {
            formValue: formValues,
          },
        });
        later.then(() => {
          this.handleCancel(); //关闭当前弹窗
          this.props.refreshNode(); //局部刷新页面
        }, 1000);
      }
    });
  };

  render() {
    const {
      updateModalVisible,
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        width="100%"
        visible={updateModalVisible}
        title="添加"
        onCancel={this.handleCancel}
        style={{ top: 0 }}
        footer={[]}
      >
        <GridContent>
          <Row gutter={24}>
            <Col lg={18} md={24}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="角色信息" key="1">
                  <Form layout="horizontal" hideRequiredMark>
                    <Col span={12}>
                        {getFieldDecorator('roleid', {
                          initialValue: this.props.roleid,
                        })(<Input type="hidden"/>)}
                        {getFieldDecorator('projectid', {
                          initialValue: this.props.projectid,
                        })(<Input type="hidden"/>)}
                      <Form.Item label="角色描述" {...formItemLayout}>
                        {getFieldDecorator('roleDesc', {
                          rules: [{ required: true, message: '请输入角色描述' }],
                          initialValue: this.props.roleDesc,
                        })(<Input placeholder="请输入角色描述" />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="角色类别" {...formItemLayout}>
                        {getFieldDecorator('roleCategory', {
                          rules: [{ required: true, message: '请选择角色类别' }],
                          initialValue: this.props.roleCategory,
                        })(
                          <Select placeholder="请选择角色类别">
                            <Option value="菜单角色">菜单角色</Option>
                            <Option value="数据角色">数据角色</Option>
                            <Option value="流程角色">流程角色</Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  </Form>
                </Panel>
              </Collapse>
            </Col>
            <Col lg={6} md={24}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="资源权限" key="1">
                  {/* 厚度似乎丢失覅u给打死u给覅u吊死扶伤回复丢失覅u的说法是
                  哦时间都放假死哦夫i的sys地方胜多负少范德萨发生的范德萨发达但是
                  是u搞丢是个覅u是覅u第四u覅u第三个导入日渐扩大飞机贷款首付多少 */}
                </Panel>
              </Collapse>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={18} md={24}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="用户信息" key="1">
                  <Userlist
                    roleid={this.props.roleid}
                    setValue={this.setValue.bind(this)}
                    resultArray={this.state.resultArray}
                    handleCancel={() => this.handleCancel()}
                    />
                </Panel>
              </Collapse>
            </Col>
          </Row>
          <RouteContext.Consumer>
            {() => (
              <FooterToolbar>
                {this.getErrorInfo()}
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
