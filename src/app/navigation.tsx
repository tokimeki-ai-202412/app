'use client';

import { LoginDialog } from '@/components/parts/LoginDialog.tsx';
import { MenuDrawer } from '@/components/parts/MenuDrawer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useWhois } from '@/states/hooks/user.ts';
import { Box, Container, Flex, IconButton } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import { type ReactElement, useState } from 'react';

export function Navigation(): ReactElement {
  const { loading, user } = useWhois();
  const [isOpen, setIsOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Flex gap={4}>
              <Box>
                {loading ? (
                  <Skeleton>
                    <Button>loading</Button>
                  </Skeleton>
                ) : (
                  !user && (
                    <Button onClick={() => setIsOpen(true)}>
                      ログインする
                    </Button>
                  )
                )}
              </Box>
              <Box>
                <IconButton
                  onClick={() => setIsMenuOpen(true)}
                  color="blackAlpha.500"
                  bg="transparent"
                  borderWidth="1px"
                  borderColor="blackAlpha.100"
                >
                  <Flex align="center" fontSize="1.4em">
                    <Icon icon="mdi:hamburger-menu" />
                  </Flex>
                </IconButton>
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Flex>
      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <MenuDrawer isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
}
