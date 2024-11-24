'use client';

import { Artifact } from '@/app/characters/[characterId]/artifact.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useGetCharacter } from '@/states/hooks/character.ts';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Tabs,
} from '@chakra-ui/react';
import { type ReactElement, useState } from 'react';

export const runtime = 'edge';

type Props = {
  params: {
    characterId: string;
  };
};

export default function Page({ params: { characterId } }: Props): ReactElement {
  const { artifacts } = useListArtifact(characterId);
  const { character } = useGetCharacter(characterId);

  const [tab, setTab] = useState<string | null>('artifacts');

  return (
    <Container px={8} py={4} maxW={{ base: '1024px' }}>
      <SimpleGrid columns={1} gap={8}>
        <GridItem>
          <Flex w="full" gap={8}>
            <Box>
              <Box boxSize="128px">
                <AspectRatio ratio={1}>
                  {character ? (
                    <Box
                      borderWidth="1px"
                      borderColor="blackAlpha.100"
                      borderRadius="8px"
                      bg="blackAlpha.50"
                    >
                      <Image w="full" src={character?.thumbnailUrl} />
                    </Box>
                  ) : (
                    <Skeleton boxSize="96px" />
                  )}
                </AspectRatio>
              </Box>
            </Box>
            <Box>
              {character ? (
                <Heading fontSize={{ base: '20px', lg: '24px' }}>
                  {character.name}
                </Heading>
              ) : (
                <></>
              )}
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Box>
            <Tabs.Root
              w="full"
              size="lg"
              lazyMount={false}
              value={tab}
              onValueChange={(e) => setTab(e.value)}
            >
              <Tabs.List>
                <Tabs.Trigger value="artifacts">生成した画像</Tabs.Trigger>
                <Spacer />
                <Tabs.Trigger value="manage" disabled={true}>
                  キャラクターの管理
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="artifacts">
                {artifacts
                  ? artifacts.map((artifact) => {
                      return <Artifact key={artifact.id} artifact={artifact} />;
                    })
                  : ''}
              </Tabs.Content>
              <Tabs.Content value="manage"></Tabs.Content>
            </Tabs.Root>
          </Box>
        </GridItem>
        <GridItem></GridItem>
      </SimpleGrid>
    </Container>
  );
}
