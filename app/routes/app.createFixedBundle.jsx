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
  TextField,
  Select,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

const createFixedBundle = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const handleChange = useCallback(
    (newValue) => setSearchProduct(newValue),
    [],
  );

  const [selectedOption, setSelectedOption] = useState("Active");
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
  ];
  const handleStatusChange = useCallback((val) => setSelectedOption(val), []);
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
            <Box width="65%">
              <Card roundedAbove="sm">
                <Text fontWeight="bold">Included products</Text>
                <Text>Add products you want to sell together.</Text>

                <InlineStack align="space-between" gap="100" wrap={false}>
                  <Box width="80%">
                    <TextField
                      value={searchProduct}
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="Search Product"
                    />
                  </Box>
                  <Box width="10%">
                    <Button>Browse</Button>
                  </Box>
                </InlineStack>
              </Card>
              <Card roundedAbove="sm">Col 1</Card>
            </Box>
            <Box width="30%">
              <Card roundedAbove="sm">
                <Text fontWeight="bold">Status</Text>
                <Select
                  options={statusOptions}
                  onChange={handleStatusChange}
                  value={selectedOption}
                />
              </Card>
            </Box>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default createFixedBundle;
