import { Button } from '@/components/ui/button.tsx';
import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Tag } from '@/components/ui/tag.tsx';
import { API } from '@/libraries/connect-client';
import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { useGetArtifact, useListArtifact } from '@/states/hooks/artifact.ts';
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
import { type ReactElement, memo, useEffect, useState } from 'react';

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

type ArtifactPreviewProps = {
  src: string;
  accent: boolean;
};

function ArtifactImage({ src, accent }: ArtifactPreviewProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box as="label" w="full" cursor="pointer">
        <AspectRatio
          ratio={1}
          borderWidth={accent ? '2px' : '1px'}
          borderColor={accent ? '#f0acac' : 'blackAlpha.100'}
          borderRadius="8px"
        >
          <Image src={src} />
        </AspectRatio>
        <Button
          style={{
            display: 'none',
          }}
          onClick={() => {
            setIsOpen(true);
          }}
        />
      </Box>
      <DialogRoot
        open={isOpen}
        placement="center"
        onInteractOutside={() => setIsOpen(false)}
      >
        <DialogTrigger />
        <DialogContent>
          <DialogBody>
            <AspectRatio ratio={1}>
              <Image src={src} />
            </AspectRatio>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
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
  const { updateArtifact } = useListArtifact(characterId);
  const defaultShowFrame = [0, 3, 6, 12, 17, 24];

  const [showAll, setShowAll] = useState(false);
  const [showFrames, setShowFrames] = useState<number[]>(defaultShowFrame);

  useEffect(() => {
    let intervalId: any;

    if (artifact.status === 'QUEUED' || artifact.status === 'GENERATING') {
      intervalId = setInterval(() => {
        API.Artifact.getArtifact({ artifactId: artifact.id }).then(
          ({ artifact }) => {
            if (!artifact) return;
            updateArtifact(artifact);
          },
        );
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [artifact.status, artifact.id, updateArtifact]);

  useEffect(() => {
    if (!showAll) {
      setShowFrames(defaultShowFrame);
      return;
    }
    const list = Array.from(
      { length: artifact.objectUrls.length },
      (_, i) => i,
    );
    setShowFrames(list);
  }, [showAll, artifact.objectUrls.length]);

  return (
    <>
      <Stack direction="column" gap={4}>
        <Box>
          <ArtifactStatus status={artifact.status} />
        </Box>
        {artifact.status && (
          <>
            <Grid
              w="full"
              templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }}
              gap={{ base: 1, lg: 4 }}
            >
              {artifact.objectUrls.length > 0
                ? showFrames.map((frame) => {
                    return (
                      <GridItem key={frame} colSpan={1}>
                        <ArtifactImage
                          src={artifact.objectUrls[frame]}
                          accent={false}
                        />
                      </GridItem>
                    );
                  })
                : showFrames.map((frame) => {
                    return (
                      <GridItem key={frame} colSpan={1}>
                        <AspectRatio ratio={1}>
                          <Skeleton w="full" />
                        </AspectRatio>
                      </GridItem>
                    );
                  })}
            </Grid>
            {artifact.status !== 'QUEUED' &&
              artifact.status !== 'GENERATING' && (
                <Flex justify="flex-end">
                  <Button
                    color="blackAlpha.700"
                    bg="transparent"
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="8px"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? '閉じる' : 'すべて見る'}
                  </Button>
                </Flex>
              )}
          </>
        )}
      </Stack>
    </>
  );
}
