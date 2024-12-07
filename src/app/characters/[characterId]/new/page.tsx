'use client';

import { Alert } from '@/components/ui/alert.tsx';
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
import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useWhois } from '@/states/hooks/user.ts';
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
  Text,
  VStack,
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';

const models = createListCollection({
  items: modelData.map((model) => ({
    label: model.name,
    value: model.id,
  })),
});

export const runtime = 'edge';

type Props = {
  params: {
    characterId: string;
  };
};

export default function Page({ params: { characterId } }: Props): ReactElement {
  const { user, refresh: refreshUser } = useWhois();
  const { refresh } = useListArtifact(characterId);
  const [thumbnail, setThumbnail] = useState<string>('/sample.png');
  const [modelName, setModelName] = useState<string[]>([modelData[1].id]);
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

      // create job
      const { artifact } = await API.Artifact.createArtifact({
        input: {
          imagePath: path,
          modelName: modelName[0],
        },
        characterId: characterId,
      });
      if (!artifact) throw new Error('api error');

      setThumbnail('/sample.png');
      setFile(null);

      refresh();
      refreshUser();
      router.push(`/characters/${characterId}`);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <Container py={4} maxW={{ base: '1024px' }}>
      <SimpleGrid pb={8} gap={4}>
        <GridItem>
          <Heading
            fontSize={{ base: '24px', lg: '32px' }}
            color="blackAlpha.700"
            textAlign="center"
          >
            キャラクターに画像を追加
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
                <SelectRoot
                  w="full"
                  collection={models}
                  value={modelName}
                  onValueChange={(e) => setModelName(e.value)}
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
              {user && user.jewelRemain < 1 && (
                <GridItem>
                  <Alert status="info" title="1024pxでの生成について">
                    現在、1人あたりの使用回数を制限しています。
                    <Link
                      href="https://forms.gle/N4mQTi1ytGL51JnYA"
                      target="_blank"
                    >
                      <Text color="#f0acac" fontWeight={700}>
                        今後にご期待ください。
                      </Text>
                    </Link>
                  </Alert>
                </GridItem>
              )}
              <GridItem>
                <Button
                  w="full"
                  size="2xl"
                  loading={loading}
                  disabled={file === null || loading || !user}
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
