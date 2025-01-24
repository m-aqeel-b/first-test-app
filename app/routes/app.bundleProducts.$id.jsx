import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "../db.server";
import { Layout, Page, TextField } from "@shopify/polaris";

export async function loader({ params }) {
  const { id } = params;

  const getBundleProducts = await db.bundles.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      bundleProducts: true,
    },
  });

  return json({ getBundleProducts });
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
          <ui-title-bar
            title={`Bundle Name: ${data?.getBundleProducts?.name}`}
          ></ui-title-bar>
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
