'use client';

import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import {
  AspectRatio,
  Box,
  Flex,
  GridItem,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type ReactElement, useEffect } from 'react';

type Props = {
  artifact: Omit<TypeArtifact, keyof Message>;
  characterId: string;
};

export function Artifact({ artifact, characterId }: Props): ReactElement {
  const { refresh } = useListArtifact(characterId);

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
                <AspectRatio ratio={1}>
                  <Image src={url} />
                </AspectRatio>
              </GridItem>
            );
          })}
      </SimpleGrid>
    </Box>
  );
}
