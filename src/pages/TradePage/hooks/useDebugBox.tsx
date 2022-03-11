import constate from 'constate';
import log from 'loglevel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactJson from 'react-json-view'
import classNames from 'classnames';

export const useDebugBox = () => {
  const [searchParams] = useSearchParams();
  const debugBoxEnabled = !!searchParams.get('debug');
  const [debugData, setDebugData] = useState<any>({});

  const debugComponent = useCallback(
    (component: string, data: any) => {
      // setTimeout(() => {})
      setDebugData((debugData: any) => ({
        ...debugData,
        [component]: data,
      }));
    },
    [setDebugData]
  );

  useEffect(() => {
    if (debugBoxEnabled) log.setLevel('info');
  }, [debugBoxEnabled]);

  const [position, setPosition] = useState<'right' | 'left' | 'bottom'>('bottom');
  const [visible, setVisible] = useState<boolean>(debugBoxEnabled);

  const debugBox = useMemo(() => {
    if (!debugBoxEnabled) return <></>;
    return (
      // <pre className="debug-box">{JSON.stringify(debugData, undefined, 2)}</pre>
      <div>
        <button onClick={() => setPosition('bottom')}>Bottom</button>
        <button onClick={() => setPosition('left')}>Left</button>
        <button onClick={() => setPosition('right')}>Right</button>
        <button onClick={() => setVisible(visible => !visible)}>{visible ? 'Hide' : 'Show'}</button>
        <div className={classNames(`position-${position}`, {
          visible,
        })}>
          <ReactJson src={debugData} theme='monokai'/>
        </div>
      </div>
    );
  }, [debugData, debugBoxEnabled, position, visible]);

  return { debugComponent, debugBox, debugBoxEnabled };
};

export const [DebugBoxProvider, useDebugBoxContext] = constate(useDebugBox);
