'use client';

import { LoginDialog } from '@/components/parts/LoginDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useWhois } from '@/states/hooks/user.ts';
import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { type ReactElement, useState } from 'react';

export default function Page(): ReactElement {
  const { loading, user } = useWhois();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Container maxW={{ base: '768px' }}>
        <Box my={8}>
          <Heading fontSize="48px" color="blackAlpha.700">
            TOKIMEKI
          </Heading>
        </Box>
        <Box my={8}>
          <Text>
            TOKIMEKIは1枚のイラストからキャラクターをあらゆる角度から見た様子を生成する、キャラデザイン支援ツールです。
          </Text>
        </Box>
        <Box
          my={8}
          borderWidth="1px"
          borderColor="blackAlpha.100"
          bg="blackAlpha.50"
        >
          <AspectRatio ratio={16 / 9}>
            <Image src="/top.png" />
          </AspectRatio>
        </Box>
        <Box my={8}>
          {user ? (
            <Link href={'/characters/new'}>
              <Button w="full" size="2xl">
                生成する
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => setIsOpen(true)}
              w="full"
              size="2xl"
              loading={loading}
            >
              試してみる
            </Button>
          )}
        </Box>
      </Container>
      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
