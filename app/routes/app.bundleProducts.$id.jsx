import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "../db.server";
import { Button, Layout, Page, TextField } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

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
    const productRequests = await getBundleProducts.bundleProducts.map(
      (product) => {
        console.log("idd", product.productId);
        return admin.graphql(
          `#graphql
      query {
        node(id: "gid://shopify/Product/7586415542479") {
          ... on Product {
            id
            title
          }
        }
      }`,
        );
      },
    );
    console.log("a11", JSON.stringify(productRequests, null, 2));
    // Execute all requests concurrently
    const responses = await Promise.all(productRequests);
    console.log("y2", JSON.stringify(responses, null, 2));
    // Extract product titles from responses
    responses.forEach((response) => {
      const productData = response.body?.data?.node; // Adjust path as per your API client
      if (productData) {
        console.log("h111", productData.title);
        productsList.push(productData.title);
      }
    });
  }

  console.log("g2", productsList);
  return json({ getBundleProducts, productsList });
}

const bundleProducts = () => {
  //const params = useParams();
  const data = useLoaderData();
  console.log("data from loader", data);
  // console.log("par", params.id);
  return (
    <>
      <Page fullWidth>
        <Layout>
          <ui-title-bar title={`Bundle Name: ${data?.getBundleProducts?.name}`}>
            <button variant="primary" onclick="console.log('Primary action')">
              Edit Bundle
            </button>
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
        </Layout>
      </Page>
    </>
  );
};
export default bundleProducts;
