import React, { useState } from 'react';
import TargetActivity from '@/components/TargetActivity';
import ActivityMessage from '@/components/TargetActivity/ActivityMessage';
import { IActivity } from '@/ts/core';
import useWidthToggle from '@/hooks/useWidthToggle';
import { Resizable } from 'devextreme-react';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';

const GroupActivityItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const toggle = useWidthToggle(1000);
  const [key] = useCtrlUpdate(activity);
  const [loaded] = useAsyncLoad(() => activity.load(10), [activity]);
  const [current, setCurrent] = useState<IActivity>(activity);
  const loadMenus = React.useCallback(() => {
    if (!loaded || !toggle) return <></>;
    return (
      <Resizable handles={'right'}>
        <div className={'groupList'}>
          {activity.activitys
            .filter((item) => item.activityList.length > 0)
            .map((item) => {
              if (item.activityList.length > 0) {
                const _name = item.id === current.id ? 'Selected' : 'Item';
                return (
                  <div
                    className={`groupList-${_name}`}
                    key={item.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrent(item);
                    }}>
                    <ActivityMessage
                      item={item.activityList[0]}
                      activity={item}
                      hideResource
                    />
                  </div>
                );
              }
            })}
        </div>
      </Resizable>
    );
  }, [loaded, current, activity, key, toggle]);

  const loadContext = React.useCallback(() => {
    if (!loaded) return <></>;
    return (
      <div className={'loadContext'}>
        <TargetActivity
          height={'calc(100vh - 110px)'}
          activity={current}
          title={current.name + '动态'}></TargetActivity>
      </div>
    );
  }, [loaded, current]);
  return (
    <div className={'activityContent'}>
      <Spin tip="加载中,请稍后..." size="large" spinning={!loaded} delay={100}>
        <div className="groupCtx">
          {loadMenus()}
          {loadContext()}
        </div>
      </Spin>
    </div>
  );
};

export default GroupActivityItem;
