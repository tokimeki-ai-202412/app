'use client';

import { Button } from '@/components/ui/button.tsx';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useWhois } from '@/states/hooks/user.ts';
import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
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
                <>
                  <Link href="/">Top</Link>
                  <Link href="/characters">Characters</Link>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsOpen(true)}>ログインする</Button>
                </>
              )}
            </Box>
          </Flex>
        </Container>
      </Flex>
      <DialogRoot
        open={isOpen}
        placement="center"
        onInteractOutside={() => setIsOpen(false)}
      >
        <DialogTrigger />
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>ログインする</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Link href="/api/login">
              <Box
                bg="transparent"
                color="blackAlpha.700"
                borderWidth="2px"
                borderColor="blackAlpha.700"
                borderRadius="8px"
              >
                <Flex p={4} align="center" gap={4}>
                  <Box fontSize="24px">
                    <Icon icon="flat-color-icons:google" />
                  </Box>
                  <Text fontWeight="bold">Googleでログイン</Text>
                </Flex>
              </Box>
            </Link>
          </DialogBody>
          <DialogFooter />
        </DialogContent>
      </DialogRoot>
    </>
  );
}
