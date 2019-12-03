import { Form, Input, Modal,Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { userName: string }) => void;
  handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('userName', {
          rules: [{ required: true, message: '请输入至少5个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少6个字符的密码！', min: 6 }],
        })(<Input placeholder="请输入" type="password"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
        {form.getFieldDecorator('nickName', {
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('sex', {
              initialValue: '1',
            })(
              <Select style={{ width: '100%' }}>
                <Option value="1">男</Option>
                <Option value="2">女</Option>
              </Select>,
            )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {form.getFieldDecorator('age', {
        })(<Input placeholder="请输入" type="number"/>)}
      </FormItem>
    </Modal>
    
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
