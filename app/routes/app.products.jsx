import React from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
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
  console.log("get product", getProducts);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {getProducts.map((product) => {
            return (
              <Card
                title="Online store dashboard"
                sectioned
                key={product.node.id}
              >
                <p>
                  {product.node.title}, {product.node.id}
                </p>
              </Card>
            );
          })}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Products;
