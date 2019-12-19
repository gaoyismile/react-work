import React from 'react';
import {Upload,message,Modal,Button,Icon} from 'antd';
import styles from './style.less';
import reqwest from 'reqwest';

class upload extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    errorMsg:'',
  };
  handleUpload = () => {
    const { fileList } = this.state;
    const {projectid} = this.props;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
      formData.append('projectid',projectid);
    });
    this.setState({
      uploading: true,
    });
    if(formData.get('file')==null){
      alert("请上传文件");
      return false;
    }
    // You can use any AJAX library you like
    reqwest({
      url: '/api/role/import',
      method: 'post',
      processData: false,
      data: formData,
      success: (msg: any) => {
        if(msg.message==="success"){
          this.setState({
            fileList: [],
            uploading: false,
          });
          message.success('upload successfully.');
          this.handleCancel();//关闭弹窗
          this.props.refreshNode();//刷新角色列表
        }else{
          this.setState({
            errorMsg:msg.message
          });
        }
      },
      error: (msg: any) => {
        console.log("失败msg:",msg);
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  handleCancel = () => {
    this.setState({
      fileList:[],
      errorMsg:'',
    })
    let status = false;
    this.props.status(status);
  };

  render() {
    const { fileList } = this.state;
    const {importVisible } = this.props;
    const props = {
      onRemove: (file: any) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
            errorMsg: '',
          };
        });
      },
      beforeUpload: (file: any) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <Modal
        visible={importVisible}
        title="上传"
        onOk={this.handleUpload}
        onCancel={this.handleCancel}
      >
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        </div>
    <div className={styles.errorMsg} dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>
      </Modal>
    );
  }
}
export default upload