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
  submitting: boolean;
  projectid:number;
  roleDesc:string;
  roleCategory:string;
  roleid:number;
  viewModalVisible:boolean;
}

interface TableListState {
  modalVisible: boolean;
  visible: boolean;
  viewModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
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
  
  componentDidMount() {
    //this.props.onUserRef(this);
  }

  handleCancel = () => {
    this.props.form.resetFields(); //重置表单信息
    let status = false;
    this.props.status(status);
  };

  render() {
    const {
      viewModalVisible,
      form: { getFieldDecorator },
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
        visible={viewModalVisible}
        title="查看"
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
                        })(<Input disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="角色类别" {...formItemLayout}>
                        {getFieldDecorator('roleCategory', {
                          rules: [{ required: true, message: '请选择角色类别' }],
                          initialValue: this.props.roleCategory,
                        })(
                          <Select disabled={true}>
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
                    />
                </Panel>
              </Collapse>
            </Col>
          </Row>
          <RouteContext.Consumer>
            {() => (
              <FooterToolbar>
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
