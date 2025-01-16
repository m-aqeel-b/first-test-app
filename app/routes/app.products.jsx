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
//
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
  const options = [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
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
    setLoading(false);
  }, [active]);
  const activator = <Button onClick={handleChange1}>Add Bundle</Button>;
  //console.log("stored ids are: ", selectedProductIds);
  return (
    <Page fullWidth>
      <Layout>
        <ui-title-bar title="Products">
          {/* <button variant="primary" onclick="console.log('Primary action')">
            Add Bundle
          </button> */}
        </ui-title-bar>
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
                    if (!bundleName) {
                      setBundleNameError("Bundle Name is Required.");
                    }
                    if (!discountTypeError) {
                      setDiscountTypeError("Discount Type is Required.");
                    }
                    if (!discountValue) {
                      setDiscountValueError("Discount Value is Required.");
                    } else {
                      setBundleNameError(null);
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
