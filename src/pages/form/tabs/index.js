
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Tabs, Radio,Route } from 'antd';
import Link from 'umi/link';

const { TabPane } = Tabs;

class SlidingTabsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
    };
  }

  render() {
    const { mode } = this.state;
    return (
      <div>
        <Tabs defaultActiveKey="tab1" tabPosition={mode} style={{ height: 220 }}>
          {/* {[...Array(30).keys()].map(i => (
            <TabPane tab={`Tab-${i}`} key={i}>
                <Route key={tabs} path={/form/tabs} component={/form/tabs}  />
            </TabPane>
          ))} */
          <TabPane tab={<Link to={'/form/advanced-form'}>tab1</Link>} key={'/form/advanced-form'}>
             
          </TabPane>
          }

        </Tabs>
      </div>
    );
  }
}

export default SlidingTabsDemo;
          