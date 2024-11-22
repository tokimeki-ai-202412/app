'use client';

import { Button } from '@/components/ui/button';
import { ColorModeButton } from '@/components/ui/color-mode';
import {
  useGetCharacter,
  useListCharacters,
} from '@/states/hooks/character.ts';
import { useWhois } from '@/states/hooks/user.ts';
import { Text, VStack } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export default function Page(): ReactElement {
  const { user } = useWhois();
  const { characters } = useListCharacters();
  const { character } = useGetCharacter('aaa');

  return (
    <VStack>
      <ColorModeButton />
      <Button>Click me</Button>
      <Text>{JSON.stringify(user)}</Text>
      <Text>{JSON.stringify(characters)}</Text>
      <Text>{JSON.stringify(character)}</Text>
    </VStack>
  );
}
