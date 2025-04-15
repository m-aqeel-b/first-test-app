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

const bundleList = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h1" fontWeight="bold" variant="headingLg">
              <Button icon={ArrowLeftIcon} url="../fastBundle"></Button>
              Select Bundle Type
            </Text>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <InlineStack gap="400" wrap>
            <Box width="30%">
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <Text as="h2">Bundle SVG here</Text>
                </BlockStack>
                <Bleed marginBlockEnd="400" marginInline="400">
                  <Box background="bg-surface-secondary" padding="400">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm" fontWeight="bold">
                        Fixed Bundle
                      </Text>
                      <Button fullWidth url="../createFixedBundle">
                        Select
                      </Button>
                    </BlockStack>
                  </Box>
                </Bleed>
              </Card>
            </Box>
            <Box width="30%">
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <Text as="h2">Bundle SVG here</Text>
                </BlockStack>
                <Bleed marginBlockEnd="400" marginInline="400">
                  <Box background="bg-surface-secondary" padding="400">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm" fontWeight="bold">
                        Test Bundle 1
                      </Text>
                      <Button fullWidth>Select</Button>
                    </BlockStack>
                  </Box>
                </Bleed>
              </Card>
            </Box>
            <Box width="30%">
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <Text as="h2">Bundle SVG here</Text>
                </BlockStack>
                <Bleed marginBlockEnd="400" marginInline="400">
                  <Box background="bg-surface-secondary" padding="400">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm" fontWeight="bold">
                        Test Bundle 2
                      </Text>
                      <Button fullWidth>Select</Button>
                    </BlockStack>
                  </Box>
                </Bleed>
              </Card>
            </Box>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
export default bundleList;
