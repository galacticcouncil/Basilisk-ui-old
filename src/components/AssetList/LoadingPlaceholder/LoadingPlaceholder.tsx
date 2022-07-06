import styled from '@emotion/styled/macro';

export interface LoadingPlaceholderProps {
  width?: number;
  height?: number;
}

const Placeholder = styled.div<{ width?: number; height?: number }>`
  width: ${(props) => props.width || 150}px;
  height: ${(props) => props.height || 30}px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 60px;
`;

export const LoadingPlaceholder = (props: LoadingPlaceholderProps) => {
  return <Placeholder {...props} />;
};
