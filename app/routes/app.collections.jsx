import {
  Layout,
  Card,
  Text,
  Page,
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
import { useLoaderData, json } from "@remix-run/react";
import React from "react";
import { authenticate } from "../shopify.server";
import { useState, useCallback } from "react";
import db from "../db.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  // console.log("hit", admin);
  const response = await admin.graphql(
    `#graphql
    query 
    {
      collections(first: 10, reverse:true) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
  );
  console.log("data is:", response);

  const data = await response.json();
  const {
    data: {
      collections: { edges },
    },
  } = data;
  return edges;
}

export async function action({ request }) {
  const formData = await request.formData();

  //setLoading(true);
  console.log("hit2", formData);
  //console.log("checkdb", db);
  const savedData = await db.bundles.create({
    data: {
      name: formData.get("bundleName"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("discountValue"),
    },
  });
  console.log("saved1", formData.get("selectedCollectionIds"));
  const collectionIds = formData.get("selectedCollectionIds").split(",");
  console.log("check11", savedData.id);
  const savedEntries = await Promise.all(
    collectionIds.map(async (collectionId) => {
      // Save each product ID separately to the database
      console.log("coll", collectionId);
      return await db.BundleCollections.create({
        data: {
          collectionId: collectionId.trim(), // Remove any extra spaces
          bundleId: savedData.id,
        },
      });
    }),
  );

  return savedData;
}

const collections = () => {
  const [loading, setLoading] = useState(false);
  const getCollections = useLoaderData();
  const [checked, setChecked] = useState({});
  const [selectedCollectionIds, setSelectedCollectionIds] = useState([]);
  const handleChange = (id) => (newChecked) => {
    console.log("get is", id);
    setChecked((prev) => ({
      ...prev,
      [id]: newChecked,
    }));
    if (newChecked) {
      // Add product ID to the array
      setSelectedCollectionIds((prevIds) => [...prevIds, id]);
    } else {
      // Remove product ID from the array
      setSelectedCollectionIds((prevIds) =>
        prevIds.filter((id1) => id1 !== id),
      );
    }
  };

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
  const handleChange1 = useCallback(() => {
    setActive(!active);
    setBundleNameError(null);
    setDiscountTypeError(null);
    setDiscountValueError(null);
    setBundleName("");
    setDiscountType("");
    setDiscountValue("");
    setLoading(false);
  }, [active]);
  const activator = <Button onClick={handleChange1}>Add Bundle</Button>;
  return (
    <Page fullWidth>
      <Layout>
        <ui-title-bar title="Collections">
          {/* <button variant="primary" onclick="console.log('Primary action')">
            Add Bundle
          </button> */}
        </ui-title-bar>
        <Layout.Section>
          {(getCollections ?? []).map((collection) => {
            return (
              <Card
                title="sotre collections"
                sectioned
                key={collection.node.id}
              >
                <p>
                  <Checkbox
                    label={collection.node.title}
                    checked={checked[collection.node.id] || false}
                    onChange={handleChange(collection.node.id)}
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
              title="Add Bundles For Collections"
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
                      value={selectedCollectionIds}
                      name="selectedCollectionIds"
                      labelHidden={true}
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

export default collections;
