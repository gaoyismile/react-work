import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
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
import creatHistory from 'history/createHashHistory'

const { TextArea } = Input;
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

interface WorkOrderFormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAndadvancedForm/submitAdvancedForm'],
}))
class WorkOrderForm extends Component<WorkOrderFormProps> {
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
          <Panel header="工作指令" key="1">
          <Card className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>               
              <Row>
                <Col span={24}>
                <Form.Item label="工作来源" >
                    {getFieldDecorator('workFrom', {
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入工作来源"
                        rows={4}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item label="缺陷分析" >
                    {getFieldDecorator('failureAnalysis', {
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入缺陷分析"
                        rows={4}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item label="工器具材料" >
                    {getFieldDecorator('toolMaterial', {
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入工器具材料"
                        rows={4}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item label="工作步骤">
                    {getFieldDecorator('workStep', {
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入工作步骤"
                        rows={10}
                      />,
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
              <Button type="primary" onClick={this.validate} loading={submitting}>
                保存1
              </Button>
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

export default Form.create<WorkOrderFormProps>()(WorkOrderForm);
