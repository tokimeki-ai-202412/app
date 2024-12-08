import { Navigation } from '@/app/navigation.tsx';
import { Provider } from '@/components/ui/provider';
import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'TOKIMEKI',
  metadataBase: new URL('https://tokimeki.ai'),
  openGraph: {
    images: '/top.png',
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body>
        <Provider>
          <Navigation />
          {children}
        </Provider>
      </body>
    </html>
  );
}
