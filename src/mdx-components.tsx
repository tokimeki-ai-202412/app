import { Heading, Image, Link, List, Text } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';
import type { ReactElement } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: any): ReactElement => (
      <Heading
        mt={[12, 12]}
        mb={[6, 8]}
        fontSize={['1.8em', '2.4em']}
        color="blackAlpha.700"
        {...props}
      />
    ),
    h2: (props: any): ReactElement => (
      <Heading
        mt={[6, 8]}
        mb={[4, 6]}
        pb={2}
        fontSize={['1.3em', '1.4em']}
        color="blackAlpha.700"
        borderBottomWidth="1px"
        borderColor="blackAlpha.100"
        {...props}
      />
    ),
    p: (props: any): ReactElement => (
      <Text lineHeight={1.7} color="blackAlpha.800" {...props} />
    ),
    ul: (props: any): ReactElement => (
      <List.Root lineHeight={1.7}>{props.children}</List.Root>
    ),
    ol: (props: any): ReactElement => {
      return (
        <List.Root as="ol" lineHeight={1.7}>
          {props.children}
        </List.Root>
      );
    },
    li: (props: any): ReactElement => (
      <List.Item lineHeight={1.7}>{props.children}</List.Item>
    ),
    ...components,
  };
}
