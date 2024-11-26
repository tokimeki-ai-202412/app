'use client';

import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import {
  AspectRatio,
  Box,
  Button,
  GridItem,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type ReactElement, useEffect, useState } from 'react';

type PreviewDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  imageUrl: string;
};

function PreviewDialog({
  isOpen,
  setIsOpen,
  imageUrl,
}: PreviewDialogProps): ReactElement {
  return (
    <DialogRoot
      open={isOpen}
      placement="center"
      onInteractOutside={() => setIsOpen(false)}
    >
      <DialogTrigger />
      <DialogContent>
        <DialogBody>
          <Box borderWidth="1px" borderColor="blackAlpha.50" borderRadius="8px">
            <AspectRatio ratio={1}>
              <Image src={imageUrl} />
            </AspectRatio>
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

type Props = {
  artifact: Omit<TypeArtifact, keyof Message>;
  characterId: string;
};

export function Artifact({ artifact, characterId }: Props): ReactElement {
  const { refresh } = useListArtifact(characterId);
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    let intervalId: any;

    if (artifact.status === 'QUQUED') {
      intervalId = setInterval(() => {
        refresh();
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [artifact.status, refresh]);

  return (
    <Box>
      {artifact.status === 'QUQUED' ? (
        <VStack w="full" py={8} gap={4}>
          <Spinner
            size="lg"
            color="orange.300"
            animationDuration="1.6s"
            borderWidth="4px"
          />
          <Text>処理の順番待ち中</Text>
        </VStack>
      ) : (
        <></>
      )}
      <SimpleGrid columns={{ base: 3, lg: 5 }} gap={4}>
        {artifact.objectUrls.length > 0 &&
          artifact.objectUrls.map((url) => {
            return (
              <GridItem key={url} w="full">
                <Box as="label" w="full" cursor="pointer">
                  <Box
                    borderWidth="1px"
                    borderColor="blackAlpha.50"
                    borderRadius="8px"
                  >
                    <AspectRatio ratio={1}>
                      <Image src={url} />
                    </AspectRatio>
                  </Box>
                  <Button
                    style={{
                      display: 'none',
                    }}
                    onClick={() => {
                      setImageUrl(url);
                      setIsOpen(true);
                    }}
                  />
                </Box>
              </GridItem>
            );
          })}
      </SimpleGrid>
      <PreviewDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        imageUrl={imageUrl}
      />
    </Box>
  );
}
