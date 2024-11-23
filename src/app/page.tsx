'use client';

import { Button } from '@/components/ui/button.tsx';
import { useWhois } from '@/states/hooks/user.ts';
import { Box, Container, Heading, Image, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export default function Page(): ReactElement {
  const { user } = useWhois();

  return (
    <Container maxW={{ base: '768px' }}>
      <Box my={8}>
        <Heading fontSize="48px" color="blackAlpha.700">
          tokimeki.ai
        </Heading>
      </Box>
      <Box my={8}>
        <Text>
          tokimeki.aiは1枚のイラストからキャラクターをあらゆる角度から見た様子を
          想像してくれるキャラデザイン支援ツールです。
        </Text>
      </Box>
      <Box my={8} borderWidth="1px" borderColor="blackAlpha.100">
        <Image src="/top.png" />
      </Box>
      <Box my={8}>
        <Button w="full" size="2xl">
          {user ? '生成する' : '試してみる'}
        </Button>
      </Box>
    </Container>
  );
}
