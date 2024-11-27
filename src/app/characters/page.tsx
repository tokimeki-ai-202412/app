'use client';

import { Button } from '@/components/ui/button.tsx';
import { useListCharacters } from '@/states/hooks/character.ts';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

export default function Page(): ReactElement {
  const { characters } = useListCharacters();

  return (
    <Container maxW={{ base: '1024px' }}>
      <Flex justify="flex-end">
        <Link href="/characters/new">
          <Button>新しいキャラクターを追加</Button>
        </Link>
      </Flex>
      <SimpleGrid my={8} columns={{ base: 1, xl: 2 }} gap={8}>
        {characters ? (
          characters.map((character) => (
            <HStack w="full" key={character.id} gap={4}>
              <Box
                borderWidth="1px"
                borderColor="blackAlpha.50"
                borderRadius="8px"
              >
                <Link href={`/characters/${character.id}`}>
                  <AspectRatio
                    boxSize={{ base: '128px', lg: '160px' }}
                    ratio={1}
                  >
                    <Image
                      src={character.thumbnailUrl}
                      userSelect="none"
                      pointerEvents="none"
                    />
                  </AspectRatio>
                </Link>
              </Box>
              <Box w="full">
                <VStack w="full" align="flex-start" h="full">
                  <Heading color="blackAlpha.700">{character.name}</Heading>
                  <Spacer />
                  <Box w="full">
                    <Link href={`/characters/${character.id}`}>
                      <Button
                        color="blackAlpha.700"
                        bg="transparent"
                        borderWidth="1px"
                        borderColor="blackAlpha.100"
                        borderRadius="8px"
                      >
                        詳細を見る
                      </Button>
                    </Link>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          ))
        ) : (
          <></>
        )}
      </SimpleGrid>
    </Container>
  );
}
