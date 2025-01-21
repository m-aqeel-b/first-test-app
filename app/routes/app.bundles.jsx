import { useLoaderData, useNavigate } from "@remix-run/react";
import { Card, DataTable, Layout, Page, Button } from "@shopify/polaris";
import React from "react";
import db from "../db.server";

export async function loader() {
  const bundles = await db.bundles.findMany({
    include: {
      bundleProducts: true,
      bundleCollections: true,
    },
  });

  return bundles;
}

const bundles = () => {
  const getBundleList = useLoaderData();
  const navigate = useNavigate();
  console.log("b1", getBundleList);
  const tableRows = getBundleList.map((bundle) => [
    bundle.name,
    bundle.discountType,
    bundle.discountValue,
    bundle.bundleProducts.length,
    bundle.bundleCollections.length,
    <Button
      onClick={() => {
        if (bundle.bundleProducts.length > 0) {
          navigate(`/app/bundleProducts/${bundle.id}`);
        }
        if (bundle.bundleCollections.length > 0) {
          navigate(`/app/bundles/collections/${bundle.id}`);
        }
      }}
      size="slim"
    >
      Edit
    </Button>,
  ]);
  return (
    <Page fullWidth>
      <Layout>
        <ui-title-bar title="Bundles"></ui-title-bar>
        <Layout.Section>
          <Card title="Bundles" sectioned>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "numeric",
                "numeric",
                "numeric",
                "numeric",
              ]}
              headings={[
                "Name",
                "Discount Type",
                "Discount Value",
                "Number of Products",
                "Number of Collections",
                "Action",
              ]}
              rows={tableRows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default bundles;
