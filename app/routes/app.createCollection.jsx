import {
  Layout,
  Page,
  FormLayout,
  Card,
  Text,
  TextField,
  Button,
} from "@shopify/polaris";
import { useActionData, Form, replace, useSubmit } from "@remix-run/react";
import React, { useState } from "react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = formData.get("collectionTitle");
  console.log("test7", title);

  const response = await admin.graphql(
    `#graphql
  mutation createCollectionMetafields($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        metafields(first: 3) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }`,
    {
      variables: {
        input: {
          metafields: [
            {
              namespace: "my_field",
              key: "subtitle",
              type: "single_line_text_field",
              value: "Bold Colors",
            },
          ],
          title: title,
        },
      },
    },
  );

  const data = await response.json();

  return json({ collection: data });
}

const createCollection = () => {
  const [collectionTitle, setcollectionTitle] = useState("");
  const submit = useSubmit();
  const handleSubmit = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="bodyMd">
              Add Collections:
            </Text>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Form onSubmit={handleSubmit} method="POST">
            <FormLayout>
              <TextField
                value={collectionTitle}
                onChange={(value) => setcollectionTitle(value)}
                label="Product Title"
                type="text"
                name="collectionTitle"
                autoComplete="false"
              />
              <Button submit>Add</Button>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default createCollection;
