import { Button } from '@/components/ui/button.tsx';
import { Tag } from '@/components/ui/tag.tsx';
import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type ReactElement, useEffect } from 'react';

type ArtifactStatusProps = {
  status: string;
};

export function ArtifactStatus({ status }: ArtifactStatusProps): ReactElement {
  function getColor(status: string): string {
    switch (status) {
      case 'QUEUED':
        return '#F6C89F';
      case 'GENERATING':
        return '#63B3D1';
      case 'CANCELED':
        return '#BDBDBD';
      case 'ERROR':
        return '#F28B82';
      case 'DONE':
        return '#8CCFB9';
      default:
        return '';
    }
  }

  function getText(status: string): string {
    switch (status) {
      case 'QUEUED':
        return '順番待ち';
      case 'GENERATING':
        return '生成中';
      case 'CANCELED':
        return 'キャンセル';
      case 'ERROR':
        return 'エラー';
      case 'DONE':
        return '完了';
      default:
        return '';
    }
  }

  return (
    <Box display="inline-block">
      <Flex
        p={2}
        align="center"
        bg={getColor(status)}
        color="white"
        borderRadius="8px"
      >
        {(status === 'QUEUED' || status === 'GENERATING') && (
          <Spinner
            mr={2}
            color="white"
            animationDuration="1.6s"
            borderWidth="4px"
          />
        )}
        <Text display="inline-block" fontWeight={700}>
          {getText(status)}
        </Text>
      </Flex>
    </Box>
  );
}

type ArtifactBoxProps = {
  artifact: Omit<TypeArtifact, keyof Message>;
  characterId: string;
};

export function ArtifactBox({
  artifact,
  characterId,
}: ArtifactBoxProps): ReactElement {
  const { refresh } = useListArtifact(characterId);

  useEffect(() => {
    let intervalId: any;

    if (artifact.status === 'QUEUED') {
      intervalId = setInterval(() => {
        refresh();
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [artifact.status, refresh]);

  return (
    <Stack direction="column" gap={4}>
      <Box>
        <ArtifactStatus status={artifact.status} />
      </Box>
      <Grid
        w="full"
        templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }}
        gap={{ base: 1, lg: 4 }}
      >
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[0]} />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[3]} />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[6]} />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[12]} />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[17]} />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={1}>
          <AspectRatio
            ratio={1}
            borderWidth="1px"
            borderColor="blackAlpha.50"
            borderRadius="8px"
          >
            <Image src={artifact.objectUrls[24]} />
          </AspectRatio>
        </GridItem>
      </Grid>
      <Flex justify="flex-end">
        <Button
          color="blackAlpha.700"
          bg="transparent"
          borderWidth="1px"
          borderColor="blackAlpha.100"
          borderRadius="8px"
        >
          すべて見る
        </Button>
      </Flex>
    </Stack>
  );
}
