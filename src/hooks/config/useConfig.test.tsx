import { render, RenderResult } from '@testing-library/react';
import { RenderHookResult, Renderer } from '@testing-library/react-hooks';
import { renderHook, act } from '@testing-library/react-hooks'
import { useConfig, Config, defaultConfig, localStorageKey, configVar } from './useConfig';

type HookReturn = {
    config: Config,
    // not a real type signature, but sufficiently close
    setConfig: (config: Config) => void
};
let renderHookResult: RenderHookResult<unknown, HookReturn, Renderer<unknown>>;
let result = () => renderHookResult.result;

beforeEach(() => {
    renderHookResult = renderHook(() => useConfig());
});

test('has a default config', () => {
    expect(result().current.config).toEqual(defaultConfig)
});

test('provides an update function', () => {
    expect(typeof result().current.setConfig).toBe('function');
});

test('persists default config to local storage', () => {
    const localStorageConfig = JSON.parse(
        localStorage.getItem(localStorageKey) || ''
    );
    expect(result().current.config).toEqual(localStorageConfig);
});

test('mirrors locally stored config in a reactive variable', () => {
    const configFromVar = configVar();
    expect(result().current.config).toEqual(configFromVar);
});

test('updates reactive var once the locally stored config updates', () => {
    const { config, setConfig } = result().current;
    const updatedConfig = {
        ...config,
        processorUrl: '/test'
    }

    act(() => setConfig(updatedConfig));
    renderHookResult.rerender();
    
    expect(result().current.config).toEqual(updatedConfig)
});