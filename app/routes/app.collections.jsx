import { Layout, Card, Text, Page } from '@shopify/polaris'
import { useLoaderData } from "@remix-run/react";
import React from 'react';
import { authenticate } from '../shopify.server';



export async function loader({request}) {
    const { admin } = await authenticate.admin(request);
     console.log("hit",admin)
const response = await admin.graphql(
  `#graphql
  query CustomCollectionList {
    collections(first: 50, query: "collection_type:custom") {
      nodes {
        id
        handle
        title
        updatedAt
        descriptionHtml
        publishedOnCurrentPublication
        sortOrder
        templateSuffix
      }
    }
  }`,
);
console.log("data is:",response)
// const data = await response.json();

return null
}

const collections = () => {
    const getCollections = useLoaderData();
    return (
        <Page fullWidth>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="h2" variant="bodyMd">
                            Collections List are below:
                        </Text>
                    </Card>
                </Layout.Section>

            </Layout>
        </Page>

    )
}

export default collections