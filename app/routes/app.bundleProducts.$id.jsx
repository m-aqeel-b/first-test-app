import React, { useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "../db.server";
import {
  Button,
  Layout,
  Page,
  Frame,
  Modal,
  Form,
  TextField,
  FormLayout,
  Select,
  Spinner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useState, useCallback } from "react";

export async function loader({ params, request }) {
  const { id } = params;
  const { admin } = await authenticate.admin(request);
  const getBundleProducts = await db.bundles.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      bundleProducts: true,
    },
  });
  const productsList = [];

  if (getBundleProducts?.bundleProducts?.length > 0) {
    // Map product requests to promises
    const productRequests = getBundleProducts.bundleProducts.map((product) => {
      console.log("Product ID:", product.productId);

      // Return the promise for each GraphQL request
      return admin
        .graphql(
          `#graphql
          query {
            node(id: "gid://shopify/Product/7586415542479") {
              ... on Product {
                id
                title
              }
            }
          }`,
        )
        .then((response) => {
          console.log(
            "Full GraphQL Response:",
            JSON.stringify(response, null, 2),
          ); // Log the full response
          if (response.errors) {
            console.error("GraphQL Errors:", response.errors);
            throw new Error("GraphQL query failed");
          }
          return response; // Return the full response for further processing
        })
        .catch((error) => {
          console.error("GraphQL Request Failed:", error);
          return null; // Return null in case of a failed request
        });
    });

    try {
      // Execute all requests concurrently
      const responses = await Promise.all(productRequests);

      console.log("All Responses:", JSON.stringify(responses, null, 2));

      // Extract product titles from the responses
      responses.forEach((response) => {
        if (response && response.data?.node) {
          // Access `data` directly
          const productData = response.data.node;
          console.log("Product Data:", productData);
          productsList.push(productData.title); // Push title to the products list
        } else {
          console.warn("Invalid response or missing product data");
        }
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

  // Final list of product titles
  console.log("Product Titles:", productsList);

  console.log("g2", productsList);
  return json({ getBundleProducts, productsList });
}

export async function action({ request }) {
  const formData = await request.formData();
  //console.log("hit2", formData);
  const getBundle = await db.bundles.findUnique({
    where: {
      id: parseInt(formData.get("bundleId")),
    },
  });
  if (getBundle) {
    const updatedBundle = await db.bundles.update({
      where: {
        id: parseInt(formData.get("bundleId")),
      },
      data: {
        name: formData.get("name"),
        discountType: formData.get("discountType"),
        discountValue: parseFloat(formData.get("discountValue")),
      },
    });
  } else {
    console.log("Bundle not found");
  }

  // const savedData = await db.bundles.create({
  //   data: {
  //     name: formData.get("bundleName"),
  //     discountType: formData.get("discountType"),
  //     discountValue: formData.get("discountValue"),
  //   },
  // });
  // console.log("saved", savedData);

  return getBundle;
}

const bundleProducts = () => {
  //const params = useParams();
  const data = useLoaderData();
  console.log("data from loader", data);
  // console.log("par", params.id);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const [bundleId, setBundleId] = useState("");
  const [bundleName, setBundleName] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [bundleNameError, setBundleNameError] = useState(null);
  const [discountTypeError, setDiscountTypeError] = useState(null);
  const [discountValueError, setDiscountValueError] = useState(null);
  const options = [
    { label: "Select Discount Type", value: "" },
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
  ];

  const handleChange1 = useCallback(() => {
    setBundleId(data?.getBundleProducts?.id);
    setBundleName(data?.getBundleProducts?.name);
    setDiscountType(data?.getBundleProducts?.discountType);
    setDiscountValue(data?.getBundleProducts?.discountValue);
    //console.log("bname", bundleId);
    setActive(!active);
    setBundleNameError(null);
    setDiscountTypeError(null);
    setDiscountValueError(null);

    setLoading(false);
  }, [data, active]);
  useEffect(() => {
    console.log("State Updated:", {
      bundleId,
      bundleName,
      discountType,
      discountValue,
    });
  }, [bundleId, bundleName, discountType, discountValue]);
  const activator = <Button onClick={handleChange1}>Edit Bundle</Button>;
  return (
    <>
      <Page fullWidth>
        <Layout>
          <ui-title-bar title={`Bundle Name: ${data?.getBundleProducts?.name}`}>
            {/* <button variant="primary" onclick="console.log('Primary action')">
              Edit Bundle
            </button> */}
          </ui-title-bar>
          <Layout.Section>
            <TextField
              label="Discount Type"
              value={data?.getBundleProducts?.discountType}
            />

            <TextField
              label="Discount Value"
              value={data?.getBundleProducts?.discountValue}
            />
          </Layout.Section>
          <div style={{ height: "500px" }}>
            <Frame>
              <Modal
                activator={activator}
                open={active}
                onClose={handleChange1}
                title="Edit Bundles For Products"
                primaryAction={{
                  content: loading ? <Spinner size="small" /> : "Edit Bundle",
                  onAction: () => {
                    // Find the form element and submit it
                    const formElement = document.querySelector("form");
                    if (formElement) {
                      console.log("checkp", discountTypeError);
                      console.log("check2", bundleNameError);
                      if (!bundleName) {
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
                        value={bundleId}
                        name="bundleId"
                        type="hidden"
                      />

                      <TextField
                        value={bundleName}
                        onChange={(value) => setBundleName(value)}
                        label="Bundle Name"
                        name="name"
                        type="text"
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
          <Layout.Section>
            {data.productsList.map((product) => {
              return (
                <Card title="Online store dashboard" sectioned key={product}>
                  {/* <p>
                    <Checkbox
                      label={product.node.title}
                      checked={checked[product.node.id] || false}
                      onChange={handleChange(product.node.id)}
                    />
                  </p> */}
                </Card>
              );
            })}
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};
export default bundleProducts;
