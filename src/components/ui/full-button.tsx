import { Button } from '@heroui/react';
import { useFullscreen } from '@mantine/hooks';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';

export default function FullButton() {
  const { toggle, fullscreen } = useFullscreen();

  return (
    <Button
      variant="light"
      className="text-primary"
      onPress={toggle}
      isIconOnly
      size="sm"
    >
      {fullscreen ? (
        <MdFullscreenExit className="text-2xl" />
      ) : (
        <MdFullscreen className="text-2xl" />
      )}
    </Button>
  );
}
