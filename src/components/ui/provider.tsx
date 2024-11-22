'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <JotaiProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </JotaiProvider>
  );
}
