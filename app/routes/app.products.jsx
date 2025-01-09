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
} from "@shopify/polaris";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useState, useCallback } from "react";
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
}

const Products = () => {
  const getProducts = useLoaderData();
  const [active, setActive] = useState(false);
  const handleChange1 = useCallback(() => setActive(!active), [active]);
  const activator = <Button onClick={handleChange1}>Open</Button>;
  const [bundleName, setBundleName] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const options = [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
  ];
  const handleSubmit = useCallback(() => {
    console.log("form submited");
  }, []);
  // console.log("get product", getProducts);
  // const rows = [
  //   ["Emerald Silk Gown", "$875.00", 124689, 140, "$122,500.00"],
  //   ["Mauve Cashmere Scarf", "$230.00", 124533, 83, "$19,090.00"],
  //   [
  //     "Navy Merino Wool Blazer with khaki chinos and yellow belt",
  //     "$445.00",
  //     124518,
  //     32,
  //     "$14,240.00",
  //   ],
  // ];
  const [checked, setChecked] = useState({});
  const handleChange = (id) => (newChecked) => {
    console.log("get is", id);
    setChecked((prev) => ({
      ...prev,
      [id]: newChecked,
    }));
  };

  return (
    <Page fullWidth>
      <Layout>
        <ui-title-bar title="Products">
          <button variant="primary" onclick="console.log('Primary action')">
            Add Bundle
          </button>
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
                content: "Add Bundle",
                onAction: handleChange1,
              }}
              secondaryActions={[
                {
                  content: "Cancel",
                  onAction: handleChange1,
                },
              ]}
            >
              <Modal.Section>
                <TextContainer>
                  <Form onSubmit={handleSubmit}>
                    <FormLayout>
                      <TextField
                        value={bundleName}
                        //onChange={handleBundleNameChange}
                        label="Bundle Name"
                        type="bundleName"
                      />

                      <Select
                        label="Discount Type"
                        options={options}
                        // onChange={handleSelectChange}
                        value={discountType}
                      />

                      <TextField
                        value={discountValue}
                        //onChange={handleBundleNameChange}
                        label="Discount Value"
                        type="discountValue"
                      />

                      {/* <Button submit>Submit</Button> */}
                    </FormLayout>
                  </Form>
                </TextContainer>
              </Modal.Section>
            </Modal>
          </Frame>
        </div>
      </Layout>
    </Page>
  );
};

export default Products;
