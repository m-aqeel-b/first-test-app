import React, { useState } from 'react'
import { authenticate } from '../shopify.server';
import { json } from "@remix-run/node";
import { useActionData, Form, replace, useSubmit } from '@remix-run/react';
import { Layout, Page, FormLayout, TextField, Button } from '@shopify/polaris';

export async function action({ request }) {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const discountTitle = formData.get("discountTitle");
    const discountCode = formData.get("discountCode")
    console.log("to save3",formData)

    const response = await admin.graphql(
        `#graphql
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                codes(first: 10) {
                  nodes {
                    code
                  }
                }
                startsAt
                endsAt
                customerSelection {
                  ... on DiscountCustomerAll {
                    allCustomers
                  }
                }
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                  }
                  items {
                    ... on AllDiscountItems {
                      allItems
                    }
                  }
                }
                appliesOncePerCustomer
              }
            }
          }
          userErrors {
            field
            code
            message
          }
        }
      }`,
        {
          variables: {
            basicCodeDiscount: {
              title: discountTitle,
              code: discountCode,
              startsAt: "2022-06-21T00:00:00Z",
              endsAt: "2026-09-21T00:00:00Z",
              customerSelection: {
                all: true,
              },
              customerGets: {
                value: {
                  percentage: 0.2,
                },
                items: {
                  all: true,
                },
              },
              appliesOncePerCustomer: true,
            },
          },
        },
      );

    const data = await response.json();
    return json({ discount: data });
}
const discounts = () => {
    const actionData = useActionData();
    console.log("discount Data:", actionData);
    const [discountTitle, setDiscountTitle] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const submit = useSubmit();
    const handleSubmit = () => submit({}, { replace: true, method: "POST" });
    return (
        <Page fullWidth>
            <Layout>
                <Layout.Section>
                    <Form onSubmit={handleSubmit} method="POST">
                        <FormLayout>

                            <TextField
                                value={discountTitle}
                                onChange={(value) => setDiscountTitle(value)}
                                label="Discount Title"
                                type="discountTitle"
                                name="discountTitle"
                                autoComplete="false"

                            />
                            <TextField
                                value={discountCode}
                                onChange={(value) => setDiscountCode(value)}
                                label="Discount Code"
                                type="discountCode"
                                autoComplete="false"
                                name="discountCode"

                            />

                            <Button submit>Add Discount</Button>
                        </FormLayout>
                    </Form>
                </Layout.Section>
            </Layout>
        </Page>

    )
}

export default discounts