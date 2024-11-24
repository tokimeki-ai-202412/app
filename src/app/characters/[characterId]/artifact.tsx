'use client';

import { Button } from '@/components/ui/button.tsx';
import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
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
} from '@chakra-ui/react';
import { ArtifactStatus } from '@prisma/client';
import type { ReactElement } from 'react';

type Props = {
  artifact: Omit<TypeArtifact, keyof Message>;
};

export function Artifact({ artifact }: Props): ReactElement {
  return (
    <Box>
      {artifact.status === ArtifactStatus.QUQUED ? (
        <Flex align="center" gap={4}>
          <Spinner size="lg" color="pink" borderWidth="4px" />
          <Text>処理の順番待ち</Text>
        </Flex>
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
