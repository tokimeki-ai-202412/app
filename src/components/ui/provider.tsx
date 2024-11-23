'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    breakpoints: {
      tablet: '768px',
      desktop: '768px',
      wide: '1024px',
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <JotaiProvider>
      <ChakraProvider value={createSystem(defaultConfig, config)}>
        <ColorModeProvider forcedTheme="light" {...props} />
      </ChakraProvider>
    </JotaiProvider>
  );
}
