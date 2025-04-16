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
import { useCallback, useState, useEffect } from "react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const createFixedBundle = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const handleChange = useCallback(
    (newValue) => setSearchProduct(newValue),
    [],
  );

  const [selectedStatusOption, setSelectedStatusOption] = useState("Active");
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
  ];
  const handleStatusChange = useCallback(
    (val) => setSelectedStatusOption(val),
    [],
  );
  const [selectedDiscountTypeOption, setselectedDiscountTypeOption] =
    useState("");
  const discountTypeOptions = [
    { label: "Select", value: "select", disabled: true },
    { label: "Percentage Discount", value: "percentage_discount" },
    { label: "Fixed Discount", value: "fixed_discount" },
    { label: "Set Price", value: "set_price" },
    { label: "Free Shipping", value: "free_shipping" },
    { label: "No Discount", value: "no_discount" },
  ];
  const handleDiscountTypeOptionsChange = useCallback(
    (val) => setselectedDiscountTypeOption(val),
    [],
  );
  const [discountValue, setdiscountValue] = useState("");
  const handleDiscountValueChange = useCallback(
    (val) => setdiscountValue(val),
    [],
  );
  const [bundleTitle, setbundleTitle] = useState("");
  const handleBundleTitleChange = useCallback((val) => setbundleTitle(val));
  const [productDescription, setproductDescription] = useState("");
  const [ReactQuill, setReactQuill] = useState(null);
  const handleProductDescriptionChange = useCallback((val) =>
    setproductDescription(val),
  );

  useEffect(() => {
    import("react-quill").then((mod) => {
      setReactQuill(() => mod.default);
    });
  }, []);
  if (!ReactQuill) return null;
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
            <Box width="65%" marginblockStart="400">
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
              <Card roundedAbove="sm">
                <Text fontWeight="bold">Discount</Text>
                <InlineStack gap="100" align="space-between">
                  <Box width="40%">
                    <Select
                      options={discountTypeOptions}
                      label="Type"
                      onChange={handleDiscountTypeOptionsChange}
                      value={selectedDiscountTypeOption}
                    />
                  </Box>
                  <Box width="40%">
                    <TextField
                      label="Value"
                      value={discountValue}
                      onChange={handleDiscountValueChange}
                      autoComplete="off"
                      type="number"
                    />
                  </Box>
                </InlineStack>
              </Card>
              <Card roundedAbove="sm">
                <Text fontWeight="bold">Bundle Details</Text>
                <Box>
                  <TextField
                    label="Title"
                    value={bundleTitle}
                    onChange={handleBundleTitleChange}
                    autoComplete="off"
                  />
                </Box>
                <Box>
                  <Text>Product Description</Text>
                  <Box>
                    <ReactQuill
                      value={productDescription}
                      onChange={handleProductDescriptionChange}
                    />
                  </Box>
                </Box>
              </Card>
            </Box>
            <Box width="30%">
              <Card roundedAbove="sm">
                <Text fontWeight="bold">Status</Text>
                <Select
                  options={statusOptions}
                  onChange={handleStatusChange}
                  value={selectedStatusOption}
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
