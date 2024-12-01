'use client';

import { Button } from '@/components/ui/button.tsx';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { modelData } from '@/const/model.ts';
import { API } from '@/libraries/connect-client';
import { useWhois } from '@/states/hooks/user.ts';
import {
  AspectRatio,
  Box,
  Container,
  GridItem,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';

const models = createListCollection({
  items: [{ label: modelData[0].name, value: modelData[0].id }],
});

export default function Page(): ReactElement {
  const { user } = useWhois();
  const [thumbnail, setThumbnail] = useState<string>('/sample.png');
  const [name, setName] = useState<string>('新しいキャラクター');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnail(previewUrl);
      setFile(file);
    }
  };

  const router = useRouter();

  async function createJob(): Promise<void> {
    setLoading(true);
    try {
      if (!file) throw new Error('file required');
      // create upload url
      const { url, path } = await API.Storage.createUploadUrl({
        length: file.size,
      });
      // upload input image
      const uploadResp = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!uploadResp.ok) {
        throw new Error('file upload failed');
      }
      // create character
      const { character } = await API.Character.createCharacter({
        name: name,
        thumbnailPath: path,
      });
      if (!character) throw new Error('api error');
      // create job
      const { artifact } = await API.Artifact.createArtifact({
        input: {
          imagePath: path,
        },
        characterId: character.id,
      });
      if (!artifact) throw new Error('api error');

      setThumbnail('/sample.png');
      setName('新しいキャラクター');
      setFile(null);

      router.push(`/characters/${character.id}`);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <Container px={8} py={4} maxW={{ base: '1024px' }}>
      <SimpleGrid pb={8} gap={4}>
        <GridItem>
          <Heading
            fontSize={{ base: '24px', lg: '32px' }}
            color="blackAlpha.700"
            textAlign="center"
          >
            新しいキャラクターを追加
          </Heading>
        </GridItem>
        <GridItem>
          <Text textAlign="center" opacity={0.6}>
            （推奨）背景なし・1024px以上の正方形
          </Text>
        </GridItem>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
        <GridItem>
          <Box
            borderWidth="1px"
            borderColor="blackAlpha.100"
            borderRadius="8px"
            bg="blackAlpha.50"
          >
            <Box as="label" w="full" cursor="pointer">
              <AspectRatio ratio={1}>
                <Image
                  w="full"
                  src={thumbnail}
                  opacity={thumbnail === '/sample.png' ? 0.15 : 1}
                />
              </AspectRatio>
              <input
                type="file"
                accept="image/*"
                style={{
                  display: 'none',
                }}
                onChange={handleFileChange}
              />
            </Box>
          </Box>
        </GridItem>
        <GridItem>
          <VStack w="full" h="full" gap={8}>
            <SimpleGrid w="full" columns={1} gap={8}>
              <GridItem>
                <Text pb={1} fontSize="0.9em">
                  キャラクター名
                </Text>
                <Input
                  fontSize="16px"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="キャラクター名を入力"
                  _focus={{
                    borderColor: '#f0acac',
                    outline: '1px solid #f0acac',
                  }}
                />
              </GridItem>
              <GridItem>
                <SelectRoot
                  w="full"
                  collection={models}
                  defaultValue={['first_model_512px']}
                >
                  <SelectLabel fontSize="0.9em">モデル</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="モデルを選んでください" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.items.map((model) => (
                      <SelectItem item={model} key={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </GridItem>
              <GridItem>
                <Button disabled={true}>参考にするポーズを指定する</Button>
              </GridItem>
            </SimpleGrid>
            <Spacer />
            <SimpleGrid w="full" gap={4}>
              <GridItem>
                <Text textAlign="center" opacity={0.6}>
                  生成時間の目安：5分
                </Text>
              </GridItem>
              <GridItem>
                <Button
                  w="full"
                  size="2xl"
                  loading={loading}
                  disabled={file === null || name === '' || loading || !user}
                  onClick={createJob}
                >
                  生成する
                </Button>
              </GridItem>
            </SimpleGrid>
          </VStack>
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
