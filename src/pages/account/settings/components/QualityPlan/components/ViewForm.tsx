import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data';

export interface FormValueViewType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueViewType) => void;
  handleUpdate: (values: FormValueViewType) => void;
  viewModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValueViewType;
  currentStep: number;
}

class ViewForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
        userid: props.values.userid,
        userName: props.values.userName,
        nickName: props.values.nickName,
        key: props.values.key,
        password: props.values.password,
        sex: props.values.sex,
        age: props.values.age,
        userStatus: props.values.userStatus,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };
  }
  
  renderContent = ( formVals: FormValueViewType) => {
    const { form } = this.props;
    return [
      <FormItem key="userName" {...this.formLayout} label="用户名">
        {form.getFieldDecorator('userName', {
          rules: [{ required: true, message: '请输入用户名！' }],
          initialValue: formVals.userName,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="password" {...this.formLayout} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少6个字符的密码！', min: 6 }],
          initialValue: formVals.password,
        })(<Input placeholder="请输入至少6个字符" type="password"/>)}
      </FormItem>,
      <FormItem key="nickName" {...this.formLayout} label="昵称">
        {form.getFieldDecorator('nickName', {
          rules: [{ required: true, message: '请输入昵称！' }],
          initialValue: formVals.nickName,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="sex" {...this.formLayout} label="性别">
        {form.getFieldDecorator('sex', {
          initialValue: formVals.sex,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="1">男</Option>
            <Option value="2">女</Option>
          </Select>,
        )}
      </FormItem>,
      <FormItem key="age" {...this.formLayout} label="年龄">
        {form.getFieldDecorator('age', {
          initialValue: formVals.age,
        })(<Input type="number"/>)}
      </FormItem>,
      <FormItem key="userStatus" {...this.formLayout} label="状态">
        {form.getFieldDecorator('userStatus', {
          initialValue: formVals.userStatus,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="0">正常</Option>
            <Option value="1">失效</Option>
          </Select>,
        )}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="用户查看"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent( formVals)}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(ViewForm);
