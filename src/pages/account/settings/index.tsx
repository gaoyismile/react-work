import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import AdvancedForm from './components/workDesc';
import WorkOrder from './components/workOrder';
import IsolationSecurity from './components/IsolationSecurity';
import PreCondition from './components/preCondition';
import WorkApplication from './components/WorkApplication';
import WorkPreMeeting from './components/WorkPreMeeting';
import RelateDoc from './components/RelateDoc';
import Agendum  from './components/Agendum';
import QualityPlan  from './components/QualityPlan';
import { CurrentUser } from './data.d';
import styles from './style.less';
 
const { Item } = Menu;

interface SettingsProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
}

type SettingsStateKeys = 'workDesc' | 'workOrder' | 'isolationSecurity' | 'preCondition'
                        | 'workApplication' | 'workPreMeeting' | 'agendum' | 'relateDoc'
                        | 'qualityPlan';
interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}
@connect(({ accountAndsettings }: { accountAndsettings: { currentUser: CurrentUser } }) => ({
  currentUser: accountAndsettings.currentUser,
}))
class Settings extends Component<
  SettingsProps,
  SettingsState
> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: SettingsProps) {
    super(props);
    const menuMap = {
      workDesc: <FormattedMessage id="app.settings.workDesc" defaultMessage="app.settings.workDesc" />,
      workOrder: (
        <FormattedMessage id="app.settings.workOrder" defaultMessage="app.settings.workOrder" />
      ),
      isolationSecurity: (
        <FormattedMessage id="app.settings.isolationSecurity" defaultMessage="app.settings.isolationSecurity" />
      ),
      preCondition: (
        <FormattedMessage id="app.settings.preCondition" defaultMessage="app.settings.preCondition"/>
      ),
      workApplication: (
        <FormattedMessage id="app.settings.workApplication" defaultMessage="app.settings.workApplication"/>
      ),
      workPreMeeting: (
        <FormattedMessage id="app.settings.workPreMeeting" defaultMessage="app.settings.workPreMeeting"/>
      ),
      agendum: (
        <FormattedMessage id="app.settings.agendum" defaultMessage="app.settings.agendum"/>
      ),
      relateDoc: (
        <FormattedMessage id="app.settings.relateDoc" defaultMessage="app.settings.relateDoc"/>
      ),
      qualityPlan: (
        <FormattedMessage id="app.settings.qualityPlan" defaultMessage="app.settings.qualityPlan"/>
      ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'workDesc',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndsettings/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'workDesc':
        return <AdvancedForm />;
      case 'workOrder':
        return <WorkOrder />;
      case 'isolationSecurity':
        return <IsolationSecurity />;
      case 'preCondition':
        return <PreCondition />;
      case 'workApplication':
          return <WorkApplication />;
      case 'workPreMeeting':
        return <WorkPreMeeting />;
      case 'agendum':
        return <Agendum />;
      case 'relateDoc':
        return <RelateDoc />;
      case 'qualityPlan':
        return <QualityPlan />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;
    if (!currentUser.userid) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Settings;
