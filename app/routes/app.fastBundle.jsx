import {
  Layout,
  Page,
  Text,
  Button,
  InlineStack,
  IndexTable,
  useIndexResourceState,
} from "@shopify/polaris";
import React from "react";
const fastBundle = () => {
  const bundles = [
    {
      id: "11",
      bundleItems: "bundle items",
      name: "Test Bundle 1",
      discount: "50% off",
      status: "active",
      type: "percentage",
    },
    {
      id: "22",
      bundleItems: "bundle items",
      name: "Test Bundle 2",
      discount: "Rs. 500 off",
      status: "active",
      type: "Fixed bundle",
    },
  ];
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(bundles);
  const rowMarkup = bundles.map(
    ({ id, bundleItems, name, discount, status, type }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text>{bundleItems}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{discount}</IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h1" fontWeight="bold" variant="headingLg">
              Fast Bundle 1
            </Text>

            <Button primary onClick={() => console.log("Button clicked")}>
              Create new Bundle
            </Button>
          </InlineStack>
        </Layout.Section>

        <Layout.Section>
          <IndexTable
            itemCount={bundles.length}
            selectedItemsCount={
              allResourcesSelected ? "ALL" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Bundle Items" },
              { title: "Name" },
              { title: "Discount" },
              { title: "Type" },
              { title: "Status" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
export default fastBundle;
