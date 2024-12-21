import { Layout, Card, Text, Page } from "@shopify/polaris";
import { useLoaderData, json } from "@remix-run/react";
import React from "react";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  console.log("hit", admin);
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

const collections = () => {
  const getCollections = useLoaderData();
  console.log("check", getCollections);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {(getCollections ?? []).map((collection) => {
            return (
              <Card
                title="sotre collections"
                sectioned
                key={collection.node.id}
              >
                <p>{collection.node.title}</p>
              </Card>
            );
          })}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default collections;
