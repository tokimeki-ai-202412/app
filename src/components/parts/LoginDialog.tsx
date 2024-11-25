import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function LoginDialog({ isOpen, setIsOpen }: Props): ReactElement {
  return (
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
  );
}
