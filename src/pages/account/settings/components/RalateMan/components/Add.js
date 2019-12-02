import React from 'react';
import { Col, Row } from 'antd';
import Tree from './tree/Tree';
import treeData from './tree.json';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';

import Userlist from './Userlist';

class TreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objectData: {},
      deptId: null,
      loading: false,
      userName: '',
      resultArray: [],
    };
  }

  componentDidMount() {
    console.log("初始化---------------------");
    var t = this;
    fetch("/api/getTreeJson", {method: 'GET'}).then(
      function (res) {
          res.json().then(function (data) {
                  var dataJson = JSON.stringify(data.objectData);
                  var datas = dataJson.substring(1,dataJson.length-1);
                  console.log(datas);
                  t.setState({
                    //objectData:{"id":1,"name":"工作管理平台","pid":0,"children":[{"id":2,"name":"1#联合调试队","pid":1,"children":[{"id":3,"name":"队部","pid":2,"children":[]},{"id":4,"name":"质量安全部","pid":2,"children":[{"id":5,"name":"质量控制科","pid":4,"children":[]},{"id":6,"name":"安全科","pid":4,"children":[]}]},{"id":7,"name":"工程部","pid":2,"children":[{"id":8,"name":"进度科","pid":7,"children":[]},{"id":9,"name":"移交接产科","pid":7,"children":[]},{"id":10,"name":"综合管理科","pid":7,"children":[]}]},{"id":11,"name":"技术部","pid":2,"children":[{"id":12,"name":"调试隔离办","pid":11,"children":[]},{"id":13,"name":"技术管理科","pid":11,"children":[]}]},{"id":14,"name":"核岛工艺队","pid":2,"children":[{"id":15,"name":"核岛主系统科","pid":14,"children":[]},{"id":16,"name":"核岛辅助系统科","pid":14,"children":[]},{"id":17,"name":"三废系统科","pid":14,"children":[]}]},{"id":18,"name":"技术支持队","pid":2,"children":[{"id":19,"name":"维修管理科","pid":18,"children":[]},{"id":20,"name":"疫检材料科","pid":18,"children":[]},{"id":21,"name":"性能试验科","pid":18,"children":[]},{"id":22,"name":"物理热工科","pid":18,"children":[]}]},{"id":23,"name":"联合调试一处","pid":2,"children":[]}]},{"id":24,"name":"2#联合调试队","pid":1,"children":[{"id":25,"name":"质量安全部","pid":24,"children":[]},{"id":26,"name":"队部","pid":24,"children":[]}]}]}
                    objectData: JSON.parse(datas)
                  });
              }
          )
      });
      
  }
  
  renderChildren = () => {
    return <Userlist userName={this.state.names} />;
  };

  onNodeClick = (e, node) => {
    console.info('TreeTest---onNodeClick---', node);
    this.setState({ deptId: node.id });
    console.log('this.state.names', node.name);

  };

  setValue(event) {
    //const newArray = this.state.resultArray.push(event);
    var newArray = this.state.resultArray;
    var flag = true;
    newArray.forEach(element => {
      console.log('element:', element);
      if (event == element) {
        console.log('if判断------------');
        flag = false;
      }
    });
    if (flag == true) {
      newArray.push(event);
    }
    this.setState({
      userName: event,
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

  render() {
    return (
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
            />
          </Col>
        </Row>
        <Row gutter={24}>已选择[双击移除]</Row>
        <Row gutter={24}>
          {this.state.resultArray.map(
            function(strs, index) {
              return (
                <Col lg={4} md={24}>
                  <div className={styles.removeDiv} onClick={this.removeArray.bind(this, index)}>{strs}</div>
                </Col>
              );
            }.bind(this),
          )}
        </Row>
      </GridContent>
    );
  }
}

export default TreeComponent;
