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
      workDesc: <FormattedMessage id="工作概述" defaultMessage="工作概述" />,
      workOrder: (
        <FormattedMessage id="工作指令" defaultMessage="工作指令" />
      ),
      isolationSecurity: (
        <FormattedMessage id="隔离安措要求" defaultMessage="隔离安措要求" />
      ),
      preCondition: (
        <FormattedMessage id="先决条件" defaultMessage="先决条件"/>
      ),
      workApplication: (
        <FormattedMessage id="工作申请" defaultMessage="工作申请"/>
      ),
      workPreMeeting: (
        <FormattedMessage id="工前会" defaultMessage="工前会"/>
      ),
      agendum: (
        <FormattedMessage id="执行规程" defaultMessage="执行规程"/>
      ),
      relateDoc: (
        <FormattedMessage id="关联文档" defaultMessage="关联文档"/>
      ),
      qualityPlan: (
        <FormattedMessage id="质量计划" defaultMessage="质量计划"/>
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
