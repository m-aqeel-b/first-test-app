import { useLoaderData } from "@remix-run/react";
import { Card, DataTable, Layout, Page } from "@shopify/polaris";
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
  console.log("b1", getBundleList);
  const tableRows = getBundleList.map((bundle) => [
    bundle.name,
    bundle.discountType,
    bundle.discountValue,
    bundle.bundleProducts.length,
    bundle.bundleCollections.length,
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
              ]}
              headings={[
                "Name",
                "Discount Type",
                "Discount Value",
                "Number of Products",
                "Number of Collections",
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
