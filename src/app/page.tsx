'use client';

import { Button } from '@/components/ui/button';
import { ColorModeButton } from '@/components/ui/color-mode';
import { HStack } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export default function Page(): ReactElement {
  return (
    <HStack>
      <ColorModeButton />
      <Button>Click me</Button>
    </HStack>
  );
}
