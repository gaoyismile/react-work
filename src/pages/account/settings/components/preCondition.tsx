import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Popover,
  Row,
  Collapse,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { RouteContext } from '@ant-design/pro-layout';
import { connect } from 'dva';
import FooterToolbar from './FooterToolbar';
import styles from '../style.less';
import Radio from 'antd/es/radio';
import creatHistory from 'history/createHashHistory'

const { Panel } = Collapse;
const history = creatHistory();

const fieldLabels = {
  // workListTaskNum: '工单任务编号',
  // workTaskStatus: '任务状态',
  // workListType: '工单类型',
  // prodUnit: '生产单元',
  // electricFactoryCode: '电厂代码',
  // machineGroupNum: '机组号',
  // systemNum: '系统号',
  // url2: '任务描述',
  // owner2: '执行人',
  // approver2: '责任人',
  // dateRange2: '生效日期',
  // type2: '任务类型',
};

interface PreConditionProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAndadvancedForm/submitAdvancedForm'],
}))
class PreCondition extends Component<PreConditionProps> {
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
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'formAndadvancedForm/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };
  backClick(){
    history.goBack();
  }

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    // const formItemLayout = {
    //   labelCol: {
    //       span: 9
    //   },
    //   wrapperCol: {
    //     span: 15
    //   },
    // };
    // const formItemLayoutAllCol = {
    //   labelCol: {
    //       span: 3
    //   },
    //   wrapperCol: {
    //     span: 21
    //   },
    // };
    return (
      <>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="先决条件确认" key="1">
          <Card className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>               
              <Row>
                <Col span={12}>
                  <Form.Item label="隔离验证">
                    {getFieldDecorator('isolationValidate1', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="工业安全的防范措施/高风险许可证要求的安全措施">
                    {getFieldDecorator('isolationValidate2', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="辐射防护措施/辐射防护许可证要求的防护措施">
                    {getFieldDecorator('isolationValidate3', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="消防措施/动火证（携带危险品）要求的消防措施">
                    {getFieldDecorator('isolationValidate4', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="化学控制措施">
                    {getFieldDecorator('isolationValidate5', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="高风险维修作业的应急预案中要求VVV的安全预防措施。高风险作业期间，工作组成员避免单独作业，应一同开展工作，一起结束工作并离开现场">
                    {getFieldDecorator('isolationValidate6', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="确认所需的材料、备件、工器具的质量与安全等级、有效性、可靠性">
                    {getFieldDecorator('isolationValidate7', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="熟悉完成维修任务所需的复杂工器具、安全防护用具的使用操作">
                    {getFieldDecorator('isolationValidate8', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="维修所需的电站工况、系统工况或设备状态">
                    {getFieldDecorator('isolationValidate9', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="维修所需的现场环境条件（坑洞内的氧含量、照明、通风、应急通道、环境温度、粉尘含量等）">
                    {getFieldDecorator('isolationValidate10', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="临时水、电、气源的准备情况">
                    {getFieldDecorator('isolationValidate11', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="维修支持需提前完成的作业（保温、脚手架、放油、土建开挖、防火及实体保卫屏障的临时开启等）">
                    {getFieldDecorator('isolationValidate12', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="需提前完成的其他逻辑关联维修任务">
                    {getFieldDecorator('isolationValidate13', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="通讯条件确认">
                    {getFieldDecorator('isolationValidate14', {
                    })(
                      <Radio.Group>
                        <Radio value="1">确认</Radio>
                        <Radio value="2">不适用</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          </Panel>
        </Collapse>
        <RouteContext.Consumer>
          { ()=> (
            <FooterToolbar>
              {this.getErrorInfo()}
              <div style={{textAlign:"center"}}>
                <Button type="primary" onClick={this.validate} loading={submitting}>
                  保存3
                </Button>
                <Button type="primary" onClick={this.backClick}>
                  返回
                </Button>
              </div>
            </FooterToolbar>
          )}
        </RouteContext.Consumer>
      </>
    );
  }
}

export default Form.create<PreConditionProps>()(PreCondition);
