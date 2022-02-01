import TestRenderer, { act } from 'react-test-renderer';
import { onError } from './onError';
import { useResolverToRef } from './useResolverToRef';

jest.mock('./onError', () => {
  return { onError: jest.fn() };
});

describe('hooks/apollo/useResolverToRef', () => {
  let resolverFromRef: any;

  const Test = ({ resolver }: { resolver?: any }) => {
    resolverFromRef = useResolverToRef(resolver);

    return <></>;
  };

  let component: TestRenderer.ReactTestRenderer;
  const render = (resolver?: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component = TestRenderer.create(<Test resolver={resolver} />);
  };

  beforeEach(() => {
    jest.resetModules();
  });

  it('resolver finished successfully', async () => {
    const resolver = jest.fn();

    render(resolver);

    await expect(resolverFromRef()).resolves.toBeUndefined();
  });

  it('resolver finished with error, the error propagates, onError middleware is called', async () => {
    const error = new Error('custom error');
    const resolver = jest.fn();
    resolver.mockImplementationOnce(() => {
      throw error;
    });

    render(resolver);

    await expect(resolverFromRef()).rejects.toEqual(error);

    expect(onError).toBeCalledWith(
      expect.objectContaining({
        error,
      })
    );
  });

  it('resolver rejected, the error propagates, onError middleware is called', async () => {
    const error = new Error('custom rejected error');
    const resolver = jest.fn();
    resolver.mockRejectedValue(error);

    render(resolver);

    await expect(resolverFromRef()).rejects.toEqual(error);

    expect(onError).toBeCalledWith(
      expect.objectContaining({
        error,
      })
    );
  });

  it('updates resolver function', async () => {
    const resolver = jest.fn();
    const updatedResolver = jest.fn();

    render(resolver);

    await expect(resolverFromRef()).resolves.toBeUndefined();
    expect(resolver).toBeCalledTimes(1);

    act(() => {
      component.update(<Test resolver={updatedResolver} />);
    });
    await expect(resolverFromRef()).resolves.toBeUndefined();
    expect(updatedResolver).toBeCalledTimes(1);
  });
});
