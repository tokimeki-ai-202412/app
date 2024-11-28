import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useWhois } from '@/states/hooks/user.ts';
import { Flex, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function MenuDrawer({ isOpen, setIsOpen }: Props): ReactElement {
  const { user } = useWhois();

  return (
    <DrawerRoot open={isOpen} onInteractOutside={() => setIsOpen(false)}>
      <DrawerBackdrop />
      <DrawerTrigger />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle />
        </DrawerHeader>
        <DrawerBody>
          <VStack gap={4}>
            <Link href="/">トップページ</Link>
            {user && <Link href="/characters">キャラクター</Link>}
          </VStack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </DrawerRoot>
  );
}
