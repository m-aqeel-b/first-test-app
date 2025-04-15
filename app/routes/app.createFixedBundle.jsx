import {
  Bleed,
  BlockStack,
  Card,
  Text,
  Box,
  List,
  Page,
  Layout,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";

const createFixedBundle = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h1" fontWeight="bold" variant="headingLg">
              <Button icon={ArrowLeftIcon} url="../bundleList"></Button>
              Create Fixed Bundle
            </Text>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <InlineStack align="space-between" gap="400" wrap={false}>
            <Box width="80%">
              <Card roundedAbove="sm">Col 1</Card>
              <Card roundedAbove="sm">Col 1</Card>
            </Box>
            <Box width="10%">
              <Card roundedAbove="sm">Col 1</Card>
              <Card roundedAbove="sm">Col 1</Card>
              <Card roundedAbove="sm">Col 1</Card>
              <Card roundedAbove="sm">Col 1</Card>
            </Box>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default createFixedBundle;
