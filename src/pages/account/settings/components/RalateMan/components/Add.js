import React from 'react';
import { Col, Row,Modal } from 'antd';
import Tree from './tree/Tree';
import treeData from './tree.json';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';

import Userlist from './userlist/Userlist';

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

  componentDidMount() {
    var t = this;
    fetch("/api/getTreeJson", {method: 'GET'}).then(
      function (res) {
          res.json().then(function (data) {
                  var dataJson = JSON.stringify(data.objectData);
                  var datas = dataJson.substring(1,dataJson.length-1);
                  t.setState({
                    objectData: JSON.parse(datas)
                  });
              }
          )
      });
      
  }

  onNodeClick = (e, node) => {
    console.info('TreeTest---onNodeClick---', node);
    this.setState({ deptId: node.id });
    console.log('this.state.names', node.name);
  };

  setValue(event) {
    //const newArray = this.state.resultArray.push(event);
    var newArray = this.state.resultArray;
    var flag = true;
    console.log("event:",event);
    newArray.forEach(element => {
      console.log('element:', element);
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
  handleCancel = () => {
    let status = false;
    this.props.status(status);
  };

  render() {
    const { visible} = this.props;
    return (
       <Modal 
                width="100%"
                visible={visible}
                title="选择用户"
                onCancel={this.handleCancel}
                style={{ top:0 }}
                footer={
                  [] 
                }
              >
      <GridContent>
        <Row gutter={24}>
          <Col lg={5} md={24}>
            <div id="tree">
              <Tree onNodeClick={this.onNodeClick.bind(this)} treeNodes={this.state.objectData} />
            </div>
          </Col>
          <Col lg={19} md={24}>
            <Userlist
              key={new Date()}
              deptId={this.state.deptId}
              setValue={this.setValue.bind(this)}
              resultArray={this.state.resultArray}
              handleCancel={this.handleCancel}
              refreshNode={this.props.refreshNode}
            /> 
          </Col>
        </Row>
        <Row gutter={24}>已选择[双击移除]</Row>
        <Row gutter={24}>
          {this.state.resultArray.map(
            function(strs, index) {
              return (
                <Col lg={4} md={24}>
                  <div className={styles.removeDiv} onClick={this.removeArray.bind(this, index)}>{strs[0]}</div>
                </Col>
              );
            }.bind(this),
          )}
        </Row>
      </GridContent>
      </Modal> 
    );
  }
}

export default TreeComponent;
