import React from 'react';
import { Col, Row,Modal,Collapse,Form,Input,Select } from 'antd';
import Tree from './tree/Tree';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';

import Userlist from './userlist/Userlist';

const { Panel } = Collapse;
const { Option } = Select;

class TreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objectData: {},
      deptId: null,
      loading: false,
      userName: '',
      resultArray: [],
      visible: false,
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
    const scrollToField = (fieldKey) => {
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
          <div className={styles.errorField}>{fieldLabels[key]}</div>
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
          getPopupContainer={(trigger) => {
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
      
  }

  onNodeClick = (e, node) => {
    this.setState({ deptId: node.id });
  };

  setValue(event) {
    var newArray = this.state.resultArray;
    var flag = true;
    newArray.forEach(element => {
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
  removeArray(index) {
    var newArray = this.state.resultArray;
    newArray.splice(index, 1);
    this.setState({
      resultArray: newArray,
    });
  }
  handleCancel = () => {//点击取消时,清空数组
    this.setState({
      resultArray:[]
    })
    let status = false;
    this.props.status(status);
  };

  handleSubmit(e){
    e.preventDefault();
    console.log('data of form:',this.props.form.getFieldsValue());
    //alert(this.props.form.getFieldValue('userName')+"-"+this.props.form.getFieldValue('passWord')+"-"+this.props.form.getFieldValue('agreement'));
  };

  render() {
    const { 
      visible, 
      form: { getFieldDecorator },
    } = this.props;
    console.log("getFieldDecorator的值:",getFieldDecorator.getFieldsValue);
    const formItemLayout = {
      labelCol: {
          span: 6
      },
      wrapperCol: {
        span: 18
      },
    };
    return (
       <Modal 
                width="100%"  
                visible={visible}
                title="添加"
                onCancel={this.handleCancel}
                style={{ top:0 }}
                footer={
                  [] 
                }
              >
      <GridContent>
        <Row gutter={24}>
          <Col lg={12} md={24}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="角色信息" key="1">
              <Form layout="horizontal" onSubmit={this.handleSubmit} hideRequiredMark>
                <Col span={12}>
                  <Form.Item label="角色描述" {...formItemLayout}>
                    {getFieldDecorator('roleDesc', {
                    })(<Input placeholder="请输入角色描述" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="角色类别" {...formItemLayout}>
                    {getFieldDecorator('roleCategory', {
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
              <Panel header="已选择[双击移除]" key="1">
                <Row gutter={[24, 12]}>
                  {this.state.resultArray.map(
                    function(strs, index) {
                        return (
                            <Col span={12}>
                              <div className={styles.removeDiv} onClick={this.removeArray.bind(this, index)}>{strs[2]}</div>
                            </Col>    
                        );          
                    }.bind(this),
                  )}
                </Row>
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
          <Col lg={12} md={24}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="用户信息[双击选择]" key="1">
                  <Userlist
                      deptId={this.state.deptId}
                      setValue={this.setValue.bind(this)}
                      resultArray={this.state.resultArray}
                      handleCancel={() => this.handleCancel()}
                      refreshNode={this.props.refreshNode}
                  /> 
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </GridContent>
      </Modal> 
    );
  }
}

export default Form.create()(TreeComponent);
