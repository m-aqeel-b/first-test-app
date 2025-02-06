import React from "react";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Checkbox,
  Button,
  Frame,
  Modal,
  TextContainer,
  Form,
  TextField,
  FormLayout,
  Select,
  Spinner,
} from "@shopify/polaris";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useState, useCallback } from "react";
import db from "../db.server";
// import "../../public/style.css";
import fetch from "node-fetch";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 5, reverse: true) {
        edges {
          node {
            id
            title
            handle
            resourcePublicationOnCurrentPublication {
              publication {
                name
                id
              }
              publishDate
              isPublished
            }
            variants(first:1){
              edges{
                node{
                  price
                }
              }
            }
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
  return null;
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  console.log("hit2", formData);
  //console.log("checkdb", db);
  const savedData = await db.bundles.create({
    data: {
      name: formData.get("bundleName"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("discountValue"),
    },
  });
  console.log("saved", savedData);
  const productIds = formData.get("selectedProductIds").split(",");
  const savedEntries = await Promise.all(
    productIds.map(async (productId) => {
      // Save each product ID separately to the database
      return await db.BundleProducts.create({
        data: {
          productId: productId.trim(), // Remove any extra spaces
          bundleId: savedData.id,
        },
      });
    }),
  );
  console.log("pids", productIds);

  const SHOPIFY_STORE_URL = "https://aqeel-njs-store.myshopify.com";
  // const SHOPIFY_STORE_URL = "https://admin.shopify.com/store/aqeel-njs-store";
  const API_ACCESS_TOKEN = "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";
  // const API_VERSION = "first-test-app-6";
  const API_VERSION = "2025-01";

  const createPriceRule = async () => {
    const response = await fetch(
      `${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}/price_rules.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          price_rule: {
            title: savedData.name,
            target_type: "line_item",
            target_selection: "entitled",
            allocation_method: "across",
            value_type: savedData.discountType, // Use "fixed_amount" for fixed discounts
            //value: savedData.discountValue, // Negative value for discount (e.g., -10% discount)
            value: "-150", // Negative value for discount (e.g., -10% discount)
            customer_selection: "all",
            starts_at: new Date().toISOString(),
            entitled_product_ids: [7596326912207], // Replace with product IDs
          },
        }),
      },
    );

    const data = await response.json();
    console.log("ap data", data);
    // const data = await response.json();
    // console.log(data);

    const priceRuleId = data.price_rule.id;
    const responseDiscountCode = await fetch(
      `${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": API_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          discount_code: {
            code: "MYDISCOUNT2024", // Set your discount code here
          },
        }),
      },
    );

    const dataDiscountCode = await responseDiscountCode.json();
    console.log("Discount Code Data:", dataDiscountCode);
  };
  createPriceRule();

  return savedData;
}

const Products = () => {
  const getProducts = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const [bundleName, setBundleName] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [bundleNameError, setBundleNameError] = useState(null);
  const [discountTypeError, setDiscountTypeError] = useState(null);
  const [discountValueError, setDiscountValueError] = useState(null);
  const [selectedProductIdsErro, setSelectedProductIdsError] = useState(null);
  const options = [
    { label: "Select Discount Type", value: "" },
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed_amount" },
  ];

  const [checked, setChecked] = useState({});
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const handleChange = (id) => (newChecked) => {
    console.log("get is", id);
    setChecked((prev) => ({
      ...prev,
      [id]: newChecked,
    }));
    if (newChecked) {
      // Add product ID to the array
      setSelectedProductIds((prevIds) => [...prevIds, id]);
    } else {
      // Remove product ID from the array
      setSelectedProductIds((prevIds) => prevIds.filter((id1) => id1 !== id));
    }
  };
  const handleChange1 = useCallback(() => {
    setActive(!active);
    setBundleNameError(null);
    setDiscountTypeError(null);
    setDiscountValueError(null);
    setSelectedProductIdsError(null);
    setBundleName("");
    setDiscountType("");
    setDiscountValue("");
    setLoading(false);
  }, [active]);
  const activator = <Button onClick={handleChange1}>Add Bundle</Button>;

  //console.log("stored ids are: ", selectedProductIds);
  return (
    <Page fullWidth>
      <Layout>
        <ui-title-bar title="Products"></ui-title-bar>
        <Layout.Section>
          {getProducts.map((product) => {
            return (
              <Card
                title="Online store dashboard"
                sectioned
                key={product.node.id}
              >
                <p>
                  <Checkbox
                    label={product.node.title}
                    checked={checked[product.node.id] || false}
                    onChange={handleChange(product.node.id)}
                  />
                </p>
              </Card>
            );
          })}
        </Layout.Section>
        <div style={{ height: "500px" }}>
          <Frame>
            <Modal
              activator={activator}
              open={active}
              onClose={handleChange1}
              title="Add Bundles For Products"
              primaryAction={{
                content: loading ? <Spinner size="small" /> : "Add Bundle",
                onAction: () => {
                  // Find the form element and submit it
                  const formElement = document.querySelector("form");
                  if (formElement) {
                    console.log("checkp", discountTypeError);
                    console.log("check2", bundleNameError);
                    if (selectedProductIds.length <= 0) {
                      setSelectedProductIdsError("Please Select Some Products");
                    } else if (!bundleName) {
                      setBundleNameError("Bundle Name is Required.");
                    } else if (!discountType) {
                      setDiscountTypeError("Discount Type is Required.");
                    } else if (!discountValue) {
                      setDiscountValueError("Discount Value is Required.");
                    } else {
                      setBundleNameError(null);
                      setDiscountTypeError(null);
                      setDiscountValueError(null);
                      setLoading(true);
                      formElement.submit();
                    }
                  }
                },
              }}
              secondaryActions={[
                {
                  content: "Cancel",
                  onAction: handleChange1,
                },
              ]}
            >
              <Modal.Section>
                <Form method="POST">
                  <FormLayout>
                    <TextField
                      value={selectedProductIds}
                      name="selectedProductIds"
                      type="hidden"
                      error={selectedProductIdsErro}
                    />
                    <TextField
                      value={bundleName}
                      onChange={(value) => setBundleName(value)}
                      label="Bundle Name"
                      name="bundleName"
                      error={bundleNameError}
                    />

                    <Select
                      label="Discount Type"
                      options={options}
                      onChange={(value) => setDiscountType(value)}
                      value={discountType}
                      name="discountType"
                      error={discountTypeError}
                    />

                    <TextField
                      value={discountValue}
                      onChange={(value) => setDiscountValue(value)}
                      label="Discount Value"
                      name="discountValue"
                      type="number"
                      error={discountValueError}
                    />
                  </FormLayout>
                </Form>
              </Modal.Section>
            </Modal>
          </Frame>
        </div>
      </Layout>
    </Page>
  );
};

export default Products;
