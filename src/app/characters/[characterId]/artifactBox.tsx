import { Button } from '@/components/ui/button.tsx';
import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { API } from '@/libraries/connect-client';
import type { Artifact as TypeArtifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { useListArtifact } from '@/states/hooks/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import JSZip from 'jszip';
import { type ReactElement, useEffect, useState } from 'react';

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
        <Box
          borderWidth={accent ? '2px' : '1px'}
          borderColor={accent ? '#f0acac' : 'blackAlpha.100'}
          borderRadius="8px"
        >
          <Image src={src} />
        </Box>
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

type ArtifactMenuProps = {
  artifact: Omit<TypeArtifact, keyof Message>;
  characterId: string;
};

function ArtifactMenu({
  artifact,
  characterId,
}: ArtifactMenuProps): ReactElement {
  const { updateArtifact, deleteArtifact } = useListArtifact(characterId);
  const [loading, setLoading] = useState(false);

  async function onCancel(artifactId: string) {
    setLoading(true);
    await API.Artifact.cancelArtifact({ artifactId });

    // Update artifact
    const updated = await API.Artifact.getArtifact({
      artifactId: artifactId,
    });

    if (!updated.artifact) return;
    updateArtifact(updated.artifact);
    setLoading(false);
  }

  async function onDownloadAsZip(imageUrls: string[]) {
    setLoading(true);

    const zip = new JSZip();
    for (let i = 0; i < imageUrls.length; i++) {
      const mimeToExtension: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
      };

      const url = imageUrls[i];
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch image.');
        }

        const blob = await response.blob();
        const contentType = response.headers.get('Content-Type') || 'unknown';
        const extension: string = mimeToExtension[contentType] || '.jpg'; // MIME タイプから拡張子を取得し、デフォルトは .jpg
        const fileName = `${i + 1}${extension}`;

        zip.file(fileName, blob);
      } catch (error) {
        throw new Error('Failed to create zip.');
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${artifact.id}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setLoading(false);
  }

  async function onDelete(artifactId: string) {
    setLoading(true);
    await API.Artifact.deleteArtifact({ artifactId });

    deleteArtifact(artifactId);
    setLoading(false);
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild={true}>
        <Button
          size="2xs"
          color="blackAlpha.500"
          bg="transparent"
          borderWidth="1px"
          borderColor="blackAlpha.100"
          focusVisibleRing="none"
          disabled={loading}
          loading={loading}
        >
          <HStack fontSize="1.1em">
            <Icon icon="hugeicons:menu-03" />
          </HStack>
        </Button>
      </MenuTrigger>
      <MenuContent>
        {(artifact.status === 'QUEUED' || artifact.status === 'GENERATING') && (
          <MenuItem
            value="cancel"
            color="blackAlpha.700"
            onClick={() => onCancel(artifact.id)}
            disabled={loading}
          >
            <Icon icon="material-symbols-light:cancel-outline" />
            生成をキャンセル
          </MenuItem>
        )}
        {artifact.status === 'DONE' && (
          <MenuItem
            value="download"
            color="blackAlpha.700"
            onClick={() => onDownloadAsZip(artifact.objectUrls)}
            disabled={loading}
          >
            <Icon icon="humbleicons:download" />
            ZIPでダウンロード
          </MenuItem>
        )}
        {artifact.status !== 'QUEUED' && artifact.status !== 'GENERATING' && (
          <MenuItem
            value="delete"
            color="#F28B82"
            onClick={() => onDelete(artifact.id)}
            disabled={loading}
          >
            <Icon icon="mdi:delete-outline" />
            削除
          </MenuItem>
        )}
      </MenuContent>
    </MenuRoot>
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
        <Flex align="center" justify="space-between">
          <ArtifactStatus status={artifact.status} />
          <ArtifactMenu artifact={artifact} characterId={characterId} />
        </Flex>
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
                      <AspectRatio key={frame} ratio={1}>
                        <GridItem colSpan={1}>
                          <ArtifactImage
                            src={artifact.objectUrls[frame]}
                            accent={false}
                          />
                        </GridItem>
                      </AspectRatio>
                    );
                  })
                : showFrames.map((frame) => {
                    return (
                      <AspectRatio key={frame} ratio={1}>
                        <GridItem colSpan={1}>
                          <Skeleton boxSize="full" />
                        </GridItem>
                      </AspectRatio>
                    );
                  })}
            </Grid>
            {artifact.status === 'DONE' && (
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
