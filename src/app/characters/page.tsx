'use client';

import { Button } from '@/components/ui/button.tsx';
import { useListCharacters } from '@/states/hooks/character.ts';
import {
  Container,
  Grid,
  GridItem,
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
      <SimpleGrid my={8} columns={{ base: 1, xl: 2 }} gap={8}>
        {characters ? (
          characters.map((character) => (
            <Grid
              key={character.id}
              p={8}
              borderWidth="1px"
              borderColor="blackAlpha.100"
              borderRadius="8px"
              templateColumns="repeat(5, 1fr)"
              gap={8}
            >
              <GridItem
                colSpan={2}
                boxSize="160px"
                borderWidth="1px"
                borderColor="blackAlpha.50"
                borderRadius="8px"
              >
                <Image
                  src={character.thumbnailUrl}
                  userSelect="none"
                  pointerEvents="none"
                />
              </GridItem>
              <GridItem colSpan={3}>
                <VStack align="flex-start" h="full">
                  <Heading>{character.name}</Heading>
                  <Spacer />
                  <Link href={`/characters/${character.id}`}>
                    <Button>詳細を見る</Button>
                  </Link>
                </VStack>
              </GridItem>
            </Grid>
          ))
        ) : (
          <></>
        )}
      </SimpleGrid>
    </Container>
  );
}
