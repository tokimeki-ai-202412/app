'use client';

import { Artifact } from '@/app/characters/[characterId]/artifact.tsx';
import { DeleteCharacter } from '@/app/characters/[characterId]/deleteCharacter.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useGetCharacter } from '@/states/hooks/character.ts';
import {
  AspectRatio,
  Box,
  Container,
  GridItem,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Tabs,
  VStack,
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
    <Container maxW={{ base: '1024px' }}>
      <SimpleGrid columns={1} gap={8}>
        <GridItem>
          <HStack w="full" gap={4}>
            <Box
              borderWidth="1px"
              borderColor="blackAlpha.50"
              borderRadius="8px"
            >
              <AspectRatio boxSize={{ base: '128px', lg: '160px' }} ratio={1}>
                {character ? (
                  <Image
                    src={character.thumbnailUrl}
                    userSelect="none"
                    pointerEvents="none"
                  />
                ) : (
                  <Skeleton boxSize="full" />
                )}
              </AspectRatio>
            </Box>
            <Box w="full">
              <VStack w="full" align="flex-start" h="full">
                {character && (
                  <Heading color="blackAlpha.700">{character.name}</Heading>
                )}
              </VStack>
            </Box>
          </HStack>
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
              <Tabs.List mb={8} borderColor="blackAlpha.100">
                <Tabs.Trigger
                  value="artifacts"
                  css={{
                    _selected: {
                      color: 'blackAlpha.700',
                      fontWeight: 700,
                      _horizontal: {
                        layerStyle: 'indicator.bottom',
                        '--indicator-offset-y': '-1px',
                        '--indicator-color': '#f0acac',
                      },
                    },
                  }}
                >
                  生成した画像
                </Tabs.Trigger>
                <Spacer />
                <Tabs.Trigger
                  color="blackAlpha.700"
                  value="manage"
                  css={{
                    _selected: {
                      color: 'blackAlpha.700',
                      fontWeight: 700,
                      _horizontal: {
                        layerStyle: 'indicator.bottom',
                        '--indicator-offset-y': '-1px',
                        '--indicator-color': '#f0acac',
                      },
                    },
                  }}
                >
                  キャラクターの管理
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="artifacts">
                {artifacts
                  ? artifacts.map((artifact) => {
                      return (
                        <Artifact
                          key={artifact.id}
                          characterId={characterId}
                          artifact={artifact}
                        />
                      );
                    })
                  : ''}
              </Tabs.Content>
              <Tabs.Content value="manage">
                <DeleteCharacter characterId={characterId} />
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </GridItem>
        <GridItem></GridItem>
      </SimpleGrid>
    </Container>
  );
}
