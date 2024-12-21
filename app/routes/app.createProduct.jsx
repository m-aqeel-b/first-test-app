import { Layout, Page, FormLayout, Card, Text, TextField, Button } from '@shopify/polaris'
import { useActionData, Form, replace, useSubmit } from '@remix-run/react';
import React, { useState } from 'react';
import { json } from "@remix-run/node";
import { authenticate } from '../shopify.server';

export async function action({ request }) {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const title = formData.get("title");

    const response = await admin.graphql(
        `#graphql
        mutation createProductMetafields($input: ProductInput!) {
          productCreate(input: $input) {
            product {
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
                "input": {
                    "metafields": [
                        {
                            "namespace": "my_field",
                            "key": "liner_material",
                            "type": "single_line_text_field",
                            "value": "Synthetic Leather"
                        }
                    ],
                    "title": title
                }
            },
        },
    );
    const data = await response.json();
    return json({ product: data });
}

const createProduct = () => {
    const [title, setTitle]=useState("");
    const submit = useSubmit();
        const handleSubmit = () => submit({}, { replace: true, method: "POST" });
    return (

        <Page fullWidth>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="h2" variant="bodyMd">
                            Add Product From Here:
                        </Text>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Form onSubmit={handleSubmit} method='POST'>
                        <FormLayout>


                            <TextField
                                value={title}
                                onChange={(value)=>setTitle(value)}
                                label="Product Title"
                                type="text"
                                name="title"
                                autoComplete="false"


                            />

                            

                            <Button submit>Submit</Button>
                        </FormLayout>
                    </Form>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export default createProduct