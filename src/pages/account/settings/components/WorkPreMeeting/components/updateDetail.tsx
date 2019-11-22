import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
  Collapse,
  Modal,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { RouteContext } from '@ant-design/pro-layout';
import { connect } from 'dva';
import FooterToolbar from '../../FooterToolbar';
import styles from '../style.less';
import Radio from 'antd/es/radio';
import creatHistory from 'history/createHashHistory'
import UpdateattachInfo from './UpdateattachInfo'
const { Option } = Select;
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

interface AdvancedFormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAndadvancedForm/submitAdvancedForm'],
}))
class AdvancedForm extends Component<AdvancedFormProps> {
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
    const formItemLayout = {
      labelCol: {
          span: 9
      },
      wrapperCol: {
        span: 15
      },
    };
    const formItemLayoutAllCol = {
      labelCol: {
          span: 3
      },
      wrapperCol: {
        span: 21
      },
    };
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    return (
      <Modal
          width='100%'
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title="编辑"
          style={{ top:0 }}
          visible={updateModalVisible}
          onCancel={() => handleUpdateModalVisible(false, values)}
          afterClose={() => handleUpdateModalVisible()}
        >
      <>
        <Collapse defaultActiveKey={['1','2','3']}>
          <Panel header="工前会基本信息" key="1">
          <Card className={styles.card} bordered={false}>
            <Form layout="horizontal" hideRequiredMark>
              <Row>
                <Col span={8}>
                  <Form.Item label="工单任务编号" {...formItemLayout}>
                    {getFieldDecorator('workListTaskNum', {
                      rules: [{ required: true, message: '请输入工单任务编号' }],
                    })(<Input placeholder="请输入工单任务编号" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="任务状态" {...formItemLayout}>
                      {getFieldDecorator('workTaskStatus', {
                        rules: [{ required: true, message: '请选择任务状态' }],
                      })(
                        <Select placeholder="请选择任务状态">
                          <Option value="1">工作包初始化</Option>
                          <Option value="2">工作包准备中</Option>
                          <Option value="3">工作包完成准备</Option>
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
                <Col span={8} >
                  <Form.Item label="工单类型" {...formItemLayout}>
                    {getFieldDecorator('workListType', {
                      rules: [{ required: true, message: '请选择工单类型' }],
                    })(
                      <Select placeholder="请选择工单类型">
                        <Option value="1">AA工单</Option>
                          <Option value="2">BB工单</Option>
                          <Option value="3">PM工单</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            
              <Row>
                <Col span={8}>
                  <Form.Item label="生产单元" {...formItemLayout}>
                    {getFieldDecorator('prodUnit', {
                    })(<Input placeholder="请输入生产单元" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="电厂代码" {...formItemLayout}>
                    {getFieldDecorator('electricFactoryCode', {
                    })(<Input placeholder="请输入电厂代码" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="机组号" {...formItemLayout}>
                    {getFieldDecorator('machineGroupNum', {
                    })(<Input placeholder="请输入机组号" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="系统号" {...formItemLayout}>
                    {getFieldDecorator('systemNum', {
                    })(<Input placeholder="请输入系统号" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="设备编码" {...formItemLayout}>
                    {getFieldDecorator('equipCode', {
                    })(<Input placeholder="请输入设备编码" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="系统/设备名称" {...formItemLayout}>
                    {getFieldDecorator('equipName', {
                    })(<Input placeholder="请输入系统/设备名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="专业" {...formItemLayout}>
                    {getFieldDecorator('professional', {
                    })(
                      <Select placeholder="请选择专业">
                        <Option value="1">机械</Option>
                        <Option value="2">电气</Option>
                        <Option value="3">仪控</Option>
                        <Option value="4">核岛工艺队</Option>
                        <Option value="5">CI及BOP工艺队</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="优先级" {...formItemLayout}>
                    {getFieldDecorator('priority', {
                    })(
                      <Select placeholder="请选择优先级">
                        <Option value="1">立即供应</Option>
                        <Option value="2">24小时内供应</Option>
                        <Option value="3">72小时内供应</Option>
                        <Option value="4">一周内供应</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="设备分级" {...formItemLayout}>
                    {getFieldDecorator('equipLevel', {
                    })(
                      <Select placeholder="请选择设备分级">
                        <Option value="1">A关键,使用频率高,特殊环境</Option>
                        <Option value="2">B关键,使用频率高,非特殊环境</Option>
                        <Option value="3">C关键,使用频率低,特殊环境</Option>
                        <Option value="4">D关键,使用频率低,非特殊环境</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="厂区房间" {...formItemLayout}>
                      {getFieldDecorator('factoryRoom', {
                      })(<Input placeholder="请输入厂区房间" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="核安全等级" {...formItemLayout}>
                    {getFieldDecorator('nuclearLevel', {
                    })(
                      <Select placeholder="请选择核安全等级">
                        <Option value="1">U1</Option>
                        <Option value="2">U2</Option>
                        <Option value="3">U3</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="维修等级" {...formItemLayout}>
                    {getFieldDecorator('repairLevel', {
                    })(
                      <Select placeholder="请选择维修等级">
                        <Option value="1">M1(关键维修)</Option>
                        <Option value="2">M2(重要维修)</Option>
                        <Option value="3">M3(一般维修)</Option>
                        <Option value="4">M4(简单维修)</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="质保等级" {...formItemLayout}>
                    {getFieldDecorator('QALevel', {
                    })(
                      <Select placeholder="请选择质保等级">
                        <Option value="1">非质保项目</Option>
                        <Option value="2">QA1</Option>
                        <Option value="3">QA2</Option>
                        <Option value="4">QA3</Option>
                        <Option value="5">QNCA</Option>
                        <Option value="6">QNCB</Option>
                        <Option value="7">QNCC</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="计划人数" {...formItemLayout}>
                      {getFieldDecorator('planPeopleNum', {
                      })(<Input placeholder="请输入计划人数" type="number"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="维修类别" {...formItemLayout}>
                    {getFieldDecorator('repairType', {
                    })(
                      <Select placeholder="请选择维修类别">
                        <Option value="1">预防性维修</Option>
                        <Option value="2">故障维修</Option>
                        <Option value="3">小缺陷维修</Option>
                        <Option value="4">其他维修</Option>
                        <Option value="5">变更</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="责任班组" {...formItemLayout}>
                      {getFieldDecorator('respGroupNum', {
                      })(<Input placeholder="请输入责任班组" type="treeSelect"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="责任人" {...formItemLayout}>
                      {getFieldDecorator('respMan', {
                      })(<Input placeholder="请输入责任人" type="treeSelect"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="防异物分级" {...formItemLayout}>
                    {getFieldDecorator('avoidForeignMatterLevel', {
                    })(
                      <Select placeholder="请选择维修类别">
                        <Option value="1">F1(重大异物风险)</Option>
                        <Option value="2">F2(一般异物风险)</Option>
                        <Option value="3">F3(没有异物风险)</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="工作班组" {...formItemLayout}>
                      {getFieldDecorator('workGroupNum', {
                      })(<Input placeholder="请输入工作班组" type="treeSelect"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="工作责任人" {...formItemLayout}>
                      {getFieldDecorator('workRespMan', {
                      })(<Input placeholder="请输入工作责任人" type="treeSelect"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="工作准备人" {...formItemLayout}>
                      {getFieldDecorator('workStartMan', {
                      })(<Input placeholder="请输入工作准备人" type="treeSelect"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="作业类型" {...formItemLayout}>
                    {getFieldDecorator('workingType', {
                    })(
                      <Select placeholder="请选择作业类型">
                        <Option value="1">预防性维修</Option>
                        <Option value="2">故障维修</Option>
                        <Option value="3">小缺陷维修</Option>
                        <Option value="4">其他维修</Option>
                        <Option value="5">变更</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="设备管辖处室" {...formItemLayout}>
                      {getFieldDecorator('equipManageRoom', {
                      })(<Input placeholder="请输入设备管辖处室"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="危险化学品" {...formItemLayout}>
                      {getFieldDecorator('dangerChem', {
                      })(<Input placeholder="请输入危险化学品"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="日常维修标识" {...formItemLayout}>
                    {getFieldDecorator('dailyRepairIcon', {
                    })(
                      <Radio.Group>
                        <Radio value="1">日常</Radio>
                        <Radio value="2">大修</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="大修代码" {...formItemLayout}>
                      {getFieldDecorator('repairBigCode', {
                      })(<Input placeholder="请输入大修代码"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="变更项目编号" {...formItemLayout}>
                      {getFieldDecorator('changeProjectNum', {
                      })(<Input placeholder="请输入变更项目编号"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item label="工单任务标题" {...formItemLayoutAllCol}>
                    {getFieldDecorator('workTaskTitle', {
                    })(<Input placeholder="请输入工单任务标题" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="等效工单编号" {...formItemLayout}>
                      {getFieldDecorator('eqWorkNum', {
                      })(<Input placeholder="请输入等效工单编号"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="取消/等效类型" {...formItemLayout}>
                      {getFieldDecorator('cancelType', {
                      })(<Input placeholder="请输入取消/等效类型"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="操作人" {...formItemLayout}>
                      {getFieldDecorator('operateMan', {
                      })(<Input placeholder="请输入操作人"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="时间" {...formItemLayout}>
                      {getFieldDecorator('time', {
                      })(
                        <DatePicker
                          style={{ width: '10%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder="选择开始时间"
                        />,
                      )}
                  </Form.Item>
                </Col>
              </Row> 
              <Row>
                <Col span={24}>
                <Form.Item label="原因" {...formItemLayoutAllCol}>
                    {getFieldDecorator('reason', {
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入原因"
                        rows={4}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          </Panel>
          <Panel header="核工作负责人/项目负责人会前需要确认的事项相关详情" key="2">
          <Card className={styles.card} bordered={false}>
            <Form layout="horizontal" hideRequiredMark>
            <Row>
                <Col span={8}>
                  <Form.Item label="计划开工时间" {...formItemLayout}>
                      {getFieldDecorator('planWorkTime', {
                      })(
                        <DatePicker
                          style={{ width: '10%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="计划完工时间" {...formItemLayout}>
                      {getFieldDecorator('planEndTime', {
                      })(
                        <DatePicker
                          style={{ width: '10%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="工时(小时)" {...formItemLayout}>
                      {getFieldDecorator('workForTime', {
                      })(<Input placeholder="请输入工时(小时)" type="number"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="建议开工时间" {...formItemLayout}>
                      {getFieldDecorator('suggestWorkTime', {
                      })(
                        <DatePicker
                          style={{ width: 6 }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="建议完工时间" {...formItemLayout}>
                      {getFieldDecorator('suggestWorkTime', {
                      })(
                        <DatePicker
                          style={{ width: 6 }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="完工延期时间" {...formItemLayout}>
                      {getFieldDecorator('suggestWorkDelayTime', {
                      })(
                        <DatePicker
                          style={{ width: 6 }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                  </Form.Item>
                </Col>
              </Row> 
            </Form>
          </Card>
          </Panel>     
          <UpdateattachInfo/>          
        </Collapse>
        <RouteContext.Consumer>
          {() => (
            <FooterToolbar>
              {this.getErrorInfo()}
              <Button type="primary" onClick={this.validate} loading={submitting}>
                发送通知
              </Button>
              <Button type="primary" onClick={this.validate} loading={submitting}>
                召开工前会
              </Button>
              <Button type="primary" onClick={this.validate} loading={submitting}>
                工前会确认
              </Button>
              <Button type="primary" onClick={this.validate} loading={submitting}>
                保存
              </Button>
              <Button type="primary" onClick={this.backClick}>
                返回
              </Button>
            </FooterToolbar>
          )}
        </RouteContext.Consumer>
        
          {/* {this.AdvancedForm()} */}
        
      </>
      </Modal>
    );
  }
}

export default Form.create<AdvancedFormProps>()(AdvancedForm);
