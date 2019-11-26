
import React from 'react';
import 'antd/dist/antd.css';
import { Tree } from 'antd';
import Userlist  from './Userlist';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';

const { TreeNode } = Tree;

class Trees extends React.Component {
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    
  };
  renderChildren = () => {
    return <Userlist />;
  };
  render() {
    return (
      <GridContent>
        <div
          className={styles.total}
        >
        <div className={styles.leftMenu}>
          <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0">
                <TreeNode title="leaf" key="0-0-0-0" />
                <TreeNode title="leaf" key="0-0-0-1" />
                <TreeNode title="leaf" key="0-0-0-2" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title="leaf" key="0-0-1-0" />
              </TreeNode>
              <TreeNode title="parent 1-2" key="0-0-2">
                <TreeNode title="leaf" key="0-0-2-0" />
                <TreeNode title="leaf" key="0-0-2-1" />
              </TreeNode>
              <TreeNode title="parent 1-3" key="0-0-3">
                <TreeNode title="leaf" key="0-0-3-0" />
                <TreeNode title="leaf" key="0-0-3-1" />
                <TreeNode title="leaf" key="0-0-3-2" />
                <TreeNode title="leaf" key="0-0-3-3" />
              </TreeNode>
              <TreeNode title="parent 1-4" key="0-0-4">
                <TreeNode title="leaf" key="0-0-4-0" />
              </TreeNode>
            </TreeNode>           
          </Tree>
        </div>
        <div className={styles.right}>
          {this.renderChildren()}
        </div>
        </div>
    </GridContent>
            
          
              
    );
  }
}

export default Trees;          