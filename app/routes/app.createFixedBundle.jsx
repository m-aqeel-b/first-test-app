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
  DropZone,
  Icon,
  DatePicker,
  Frame,
  Modal,
  Checkbox,
  Form,
} from "@shopify/polaris";
import {
  ArrowLeftIcon,
  CalendarIcon,
  SearchIcon,
} from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 100, reverse: true) {
        edges {
          node {
            id
            title
            }
        }
      }
    }`,
  );
  const data = await response.json();
  const {
    data: {
      products: { edges },
    },
  } = data;
  console.log("edges1:", edges);
  return edges;
}

export async function action({ request }) {
  const formData = await request.formData();

  //my local db s
  console.log("hit2", formData);
  const savedData = await db.fbp_Bundles.create({
    data: {
      name: formData.get("title"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("discountValue"),
      status: formData.get("status"),
    },
  });
  const productIds = formData.get("selectedProductIds").split(",");
  const savedEntries = await Promise.all(
    productIds.map(async (productId) => {
      // Save each product ID separately to the database
      return await db.fbp_BundleProducts.create({
        data: {
          productId: productId.trim(),
          bundleId: savedData.id,
        },
      });
    }),
  );

  return savedData;
}

const createFixedBundle = () => {
  const getProducts = useLoaderData();
  console.log("getprod1", getProducts);
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
  const [{ month, year }, setDate] = useState({ month: 1, year: 2018 });
  const [selectedSartDates, setSelectedStartDates] = useState({
    start: new Date("Wed Feb 07 2018 00:00:00 GMT-0500 (EST)"),
    end: new Date("Wed Feb 07 2018 00:00:00 GMT-0500 (EST)"),
  });

  const handleStartMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const handleClose = () => {
    handleModalChange();
  };

  //for select product in the modal
  const [checked, setChecked] = useState({});
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const handleCheckbox = (id) => (newChecked) => {
    console.log("get is", id);
    setChecked((prev) => ({
      ...prev,
      [id]: newChecked,
    }));
    if (newChecked) {
      // Add product ID to the array
      setSelectedProductIds((prevIds) => [...prevIds, id]);
      console.log("sel", selectedProductIds);
    } else {
      // Remove product ID from the array
      setSelectedProductIds((prevIds) => prevIds.filter((id1) => id1 !== id));
    }
  };
  const handleFormSubmit = useCallback((e) => {
    console.log("sumit complete");
    // const formElement = document.querySelector("form");
    // formElement.submit();
    e.preventDefault();
    const form = e.target;
    form.submit();
  }, []);
  if (!ReactQuill) return null;
  return (
    <Page fullWidth>
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
          <Form onSubmit={handleFormSubmit} method="POST">
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
                        prefix={<Icon source={SearchIcon} tone="base" />}
                      />
                      <TextField
                        value={selectedProductIds}
                        name="selectedProductIds"
                        type="hidden"
                      />
                    </Box>
                    <Box width="10%">
                      <Button onClick={handleModalChange}> Browse</Button>
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
                        name="discountType"
                      />
                    </Box>
                    <Box width="40%">
                      <TextField
                        label="Value"
                        value={discountValue}
                        onChange={handleDiscountValueChange}
                        autoComplete="off"
                        type="number"
                        name="discountValue"
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
                      name="title"
                    />
                  </Box>
                  <Box>
                    <Text>Product Description</Text>
                    <Box>
                      <ReactQuill
                        value={productDescription}
                        onChange={handleProductDescriptionChange}
                        name="description"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <DropZone label="Media">
                      <DropZone.FileUpload />
                    </DropZone>
                  </Box>
                </Card>
                <Card roundedAbove="sm">
                  <InlineStack gap="100" align="space-between">
                    {/* <Box>
                    <DatePicker
                      month={month}
                      year={year}
                      onChange={setSelectedStartDates}
                      onMonthChange={handleStartMonthChange}
                      selected={selectedSartDates}
                      prefix={<Icon source={CalendarIcon} tone="base" />}
                    />
                  </Box> */}
                    <Box></Box>
                  </InlineStack>
                </Card>
                <Card roundedAbove="sm">
                  <Button submit>Submit</Button>
                </Card>
              </Box>
              <Box width="30%">
                <Card roundedAbove="sm">
                  <Text fontWeight="bold">Status</Text>
                  <Select
                    options={statusOptions}
                    onChange={handleStatusChange}
                    value={selectedStatusOption}
                    name="status"
                  />
                </Card>
                <Box style={{ height: "300px" }}>
                  <Card>
                    <Text fontWeight="bold">Preview</Text>
                  </Card>
                </Box>
              </Box>
            </InlineStack>
            <div style={{ height: "500px" }}>
              <Frame>
                <Modal
                  open={active}
                  onClose={handleClose}
                  title="Select Products"
                  primaryAction={{
                    content: "Done",
                    onAction: handleClose,
                  }}
                  secondaryActions={[
                    {
                      content: "Cancel",
                      onAction: handleClose,
                    },
                  ]}
                >
                  <Modal.Section>
                    {getProducts.map((prod) => {
                      return (
                        <Text>
                          <Checkbox
                            label={prod.node.title}
                            checked={checked[prod.node.id] || false}
                            onChange={handleCheckbox(prod.node.id)}
                          />
                        </Text>
                      );
                    })}
                  </Modal.Section>
                </Modal>
              </Frame>
            </div>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default createFixedBundle;
