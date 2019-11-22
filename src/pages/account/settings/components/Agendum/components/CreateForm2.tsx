import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;
const { TextArea } = Input;

interface CreateForm2Props extends FormComponentProps {
  modalVisible: boolean;
  handleAdd2: (fieldsValue: { userName: string }) => void;
  handleModalVisible2: () => void;
}
const CreateForm2: React.FC<CreateForm2Props> = props => {
  const { modalVisible, form, handleAdd2, handleModalVisible2 } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd2(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="上传"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible2()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文档标题">
        {form.getFieldDecorator('userName', {
          
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规程文件">
        {form.getFieldDecorator('password', {
        })(<Input placeholder="请输入" type="file"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('nickName', {
        })(<TextArea
          style={{ minHeight: 32 }}
          placeholder="请输入备注"
          rows={4}
          />,
        )}
      </FormItem>
    </Modal>
    
  );
};

export default Form.create<CreateForm2Props>()(CreateForm2);
