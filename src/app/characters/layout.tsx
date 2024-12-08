import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'キャラクター | TOKIMEKI',
};

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): ReactElement {
  return <>{children}</>;
}
