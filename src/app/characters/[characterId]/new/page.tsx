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
import {
  StepsCompletedContent,
  StepsContent,
  StepsRoot,
} from '@/components/ui/steps';
import { modelData } from '@/const/model.ts';
import { API } from '@/libraries/connect-client';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useWhois } from '@/states/hooks/user.ts';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  List,
  Text,
  VStack,
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';

function getModelNameById(id: string): string {
  const model = modelData.find((m) => m.id === id);
  if (!model) {
    return '不明なモデル';
  }
  return model.name;
}

const models = createListCollection({
  items: modelData.map((model) => ({
    label: model.name,
    value: model.id,
  })),
});

const elevations = createListCollection({
  items: [
    { label: '-10 (下から)', value: '-10' },
    { label: '0 (正面)', value: '0' },
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: '40 (上から)', value: '40' },
  ],
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

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('/sample.png');

  const [modelName, setModelName] = useState<string[]>([modelData[1].id]);
  const [elevation, setElevation] = useState<string[]>(['0']);

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
        //elevation: elevation[0],
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

  const [step, setStep] = useState<number>(0);

  return (
    <Container maxW={{ base: '768px' }}>
      <VStack mb={12} gap={12}>
        <Box w="full">
          <StepsRoot size="lg" count={2} step={step}>
            <StepsContent index={0}>
              <VStack gap={8}>
                <Box
                  p={4}
                  w="full"
                  borderWidth="1px"
                  borderColor="blackAlpha.100"
                  borderRadius="8px"
                >
                  <List.Root>
                    <List.Item>1024px以上のほぼ正方形な画像を使う</List.Item>
                    <List.Item>なるべくフラットなイラストを使う</List.Item>
                  </List.Root>
                </Box>
                <Box
                  w="full"
                  borderWidth="1px"
                  borderColor="blackAlpha.100"
                  borderRadius="8px"
                  bg="blackAlpha.50"
                >
                  <Box as="label" w="full" cursor="pointer">
                    <AspectRatio w="full" h="full" ratio={1}>
                      <Image
                        src={thumbnail}
                        opacity={thumbnail === '/sample.png' ? 0.15 : 1}
                        style={{ objectFit: 'contain' }}
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
                <Flex w="full" gap={8}>
                  <Button w="full" size="2xl" onClick={() => setStep(1)}>
                    次へ
                  </Button>
                </Flex>
              </VStack>
            </StepsContent>
            <StepsContent index={1}>
              <VStack gap={8}>
                <Box w="full">
                  <SelectRoot
                    w="full"
                    size="lg"
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
                </Box>
                <Box w="full">
                  <SelectRoot
                    w="full"
                    size="lg"
                    collection={elevations}
                    value={elevation}
                    onValueChange={(e) => setElevation(e.value)}
                  >
                    <SelectLabel fontSize="0.9em">角度</SelectLabel>
                    <SelectTrigger>
                      <SelectValueText placeholder="角度を選んでください" />
                    </SelectTrigger>
                    <SelectContent>
                      {elevations.items.map((elevation) => (
                        <SelectItem item={elevation} key={elevation.value}>
                          {elevation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Box>
                <Box w="full">
                  <Button w="full" disabled={true}>
                    参考にするポーズを指定する
                  </Button>
                </Box>
                <Grid
                  w="full"
                  templateColumns="repeat(5, 1fr)"
                  gap={{ base: 4, lg: 8 }}
                >
                  <GridItem colSpan={2}>
                    <Button
                      w="full"
                      size="2xl"
                      color="blackAlpha.700"
                      bg="transparent"
                      borderWidth="1px"
                      borderColor="blackAlpha.100"
                      borderRadius="8px"
                      onClick={() => setStep(0)}
                    >
                      戻る
                    </Button>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Button w="full" size="2xl" onClick={() => setStep(2)}>
                      次へ
                    </Button>
                  </GridItem>
                </Grid>
              </VStack>
            </StepsContent>
            <StepsCompletedContent>
              <VStack gap={8}>
                <Box w="full">
                  <HStack w="full" gap={4}>
                    <Box>
                      <Box as="label" w="full" h="full" cursor="pointer">
                        <Box
                          borderWidth="1px"
                          borderColor="blackAlpha.50"
                          borderRadius="8px"
                        >
                          <AspectRatio
                            boxSize={{ base: '128px', lg: '160px' }}
                            ratio={1}
                          >
                            <Image
                              src={thumbnail}
                              opacity={thumbnail === '/sample.png' ? 0.15 : 1}
                              style={{ objectFit: 'contain' }}
                              userSelect="none"
                              pointerEvents="none"
                            />
                          </AspectRatio>
                        </Box>
                        <Button
                          style={{
                            display: 'none',
                          }}
                          onClick={() => {
                            setStep(0);
                          }}
                        />
                      </Box>
                    </Box>
                    <Box w="full">
                      <VStack w="full" align="flex-start" h="full">
                        <Flex gap={2}>
                          <Text>モデル</Text>
                          <Box as="label" cursor="pointer">
                            <Text color="#f0acac" fontWeight={700}>
                              {getModelNameById(modelName[0])}
                            </Text>
                            <Button
                              style={{
                                display: 'none',
                              }}
                              onClick={() => {
                                setStep(1);
                              }}
                            />
                          </Box>
                        </Flex>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>

                {user && user.jewelRemain < 1 && (
                  <Box w="full">
                    <Alert
                      color="blackAlpha.700"
                      bg="transparent"
                      borderWidth="1px"
                      borderColor="blackAlpha.100"
                      borderRadius="8px"
                      title="1024pxでの生成について"
                    >
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
                  </Box>
                )}
                <Box w="full">
                  <Button
                    w="full"
                    size="2xl"
                    loading={loading}
                    disabled={file === null || loading || !user}
                    onClick={createJob}
                  >
                    生成する
                  </Button>
                </Box>
              </VStack>
            </StepsCompletedContent>
          </StepsRoot>
        </Box>
      </VStack>
    </Container>
  );
}
