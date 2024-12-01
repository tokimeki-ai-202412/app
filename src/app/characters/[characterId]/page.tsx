'use client';

import { ArtifactBox } from '@/app/characters/[characterId]/artifactBox.tsx';
import { DeleteCharacter } from '@/app/characters/[characterId]/deleteCharacter.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useGetCharacter } from '@/states/hooks/character.ts';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  GridItem,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import { type ReactElement, useState } from 'react';

export const runtime = 'edge';

type Props = {
  params: {
    characterId: string;
  };
};

export default function Page({ params: { characterId } }: Props): ReactElement {
  const { artifacts } = useListArtifact(characterId);
  const { loading, character } = useGetCharacter(characterId);

  const [tab, setTab] = useState<string | null>('artifacts');

  return (
    <Container maxW={{ base: '1024px' }}>
      <SimpleGrid columns={1} gap={8}>
        <GridItem>
          <HStack w="full" h="full" gap={4}>
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
            <Box w="full" h={{ base: 'full', lg: 'auto' }}>
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                w="full"
                h="full"
                align="flex-start"
              >
                <SimpleGrid columns={1} gap={2}>
                  <Box>
                    {character ? (
                      <Heading color="blackAlpha.700">{character.name}</Heading>
                    ) : (
                      <Skeleton>
                        <Heading>loading</Heading>
                      </Skeleton>
                    )}
                  </Box>
                  <Flex align="center" color="blackAlpha.700" gap={1}>
                    {artifacts ? (
                      <>
                        <Icon icon="basil:diamond-outline" />
                        <Text>生成結果</Text>
                        <Text>{artifacts.length}件</Text>
                      </>
                    ) : (
                      <>
                        <Icon icon="basil:diamond-outline" />
                        <Text>生成結果</Text>
                      </>
                    )}
                  </Flex>
                </SimpleGrid>
                <Spacer />
                <Box>
                  <Link href={`/characters/${characterId}/new`}>
                    <Button
                      size={{ base: 'sm', lg: 'xl' }}
                      disabled={loading}
                      loading={loading}
                    >
                      追加で生成する
                    </Button>
                  </Link>
                </Box>
                <Box></Box>
              </Stack>
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
              <Tabs.Content value="artifacts" focusVisibleRing={'none'}>
                <SimpleGrid columns={1} gap={8}>
                  {artifacts
                    ? artifacts.map((artifact) => {
                        return (
                          <ArtifactBox
                            key={artifact.id}
                            artifact={artifact}
                            characterId={characterId}
                          />
                        );
                      })
                    : ''}
                </SimpleGrid>
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
