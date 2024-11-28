'use client';

import { Container } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

type TemplateProps = {
  children: ReactNode;
};

export default function Template({ children }: TemplateProps): ReactElement {
  return (
    <Container my={8} px={4} maxW="1024px">
      {children}
    </Container>
  );
}
