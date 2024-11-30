import { LoginDialog } from '@/components/parts/LoginDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useWhois } from '@/states/hooks/user.ts';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { type ReactElement, useState } from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function MenuDrawer({ isOpen, setIsOpen }: Props): ReactElement {
  const { loading, user } = useWhois();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  return (
    <>
      <DrawerRoot open={isOpen} onInteractOutside={() => setIsOpen(false)}>
        <DrawerBackdrop />
        <DrawerTrigger />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle />
          </DrawerHeader>
          <DrawerBody>
            <Flex mb={8} justify="center">
              <Heading fontSize="24px" color="blackAlpha.700">
                TOKIMEKI
              </Heading>
            </Flex>
            <VStack w="full" gap={8}>
              <Box w="full">
                {user ? (
                  <Link href="/characters/new">
                    <Button w="full">キャラクターを追加</Button>
                  </Link>
                ) : (
                  <Button
                    w="full"
                    onClick={() => {
                      setIsLoginOpen(true);
                    }}
                    loading={loading}
                  >
                    ログイン
                  </Button>
                )}
              </Box>
              <VStack gap={2}>
                <Link href="/">
                  <Heading fontSize="16px" color="blackAlpha.700">
                    トップページ
                  </Heading>
                </Link>
                {user && (
                  <Link href="/characters">
                    <Heading fontSize="16px" color="blackAlpha.700">
                      キャラクター
                    </Heading>
                  </Link>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </DrawerRoot>
      <LoginDialog isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
    </>
  );
}
