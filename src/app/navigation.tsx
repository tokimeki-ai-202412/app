'use client';

import { LoginDialog } from '@/components/parts/LoginDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useWhois } from '@/states/hooks/user.ts';
import { Box, Container, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { type ReactElement, useState } from 'react';

export function Navigation(): ReactElement {
  const { loading, user } = useWhois();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Flex
        w="full"
        h="64px"
        borderBottomWidth="1px"
        borderColor="blackAlpha.100"
        justify="space-between"
        align="center"
      >
        <Container>
          <Flex w="full" justify="space-between" align="center">
            <Box></Box>
            <Box>
              {loading ? (
                <Skeleton>
                  <Button>loading</Button>
                </Skeleton>
              ) : user ? (
                <Flex gap={4}>
                  <Link href="/">トップページ</Link>
                  <Link href="/characters">キャラクター</Link>
                </Flex>
              ) : (
                <>
                  <Button onClick={() => setIsOpen(true)}>ログインする</Button>
                </>
              )}
            </Box>
          </Flex>
        </Container>
      </Flex>
      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
