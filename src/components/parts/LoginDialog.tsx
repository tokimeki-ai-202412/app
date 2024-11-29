import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
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
import { Box, Flex, GridItem, SimpleGrid, Text } from '@chakra-ui/react';
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
          <SimpleGrid columns={1} gap={8}>
            <GridItem>
              <Link href="/api/login">
                <Button
                  w="full"
                  size="2xl"
                  color="blackAlpha.700"
                  bg="transparent"
                  borderWidth="1px"
                  borderColor="blackAlpha.100"
                  borderRadius="8px"
                >
                  <Flex p={4} align="center" gap={4}>
                    <Box fontSize="24px">
                      <Icon icon="flat-color-icons:google" />
                    </Box>
                    <Text fontWeight="bold">Googleでログイン</Text>
                  </Flex>
                </Button>
              </Link>
            </GridItem>
            <GridItem>
              <Checkbox size="lg" checked={true} disabled={true}>
                <Link href="/legal/tos">
                  <Text color="#f0acac" display="inline-block">
                    利用規約
                  </Text>
                </Link>
                に同意してサービスを利用する。
              </Checkbox>
            </GridItem>
          </SimpleGrid>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
