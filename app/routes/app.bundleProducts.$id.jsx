import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "../db.server";

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
  return <h1>hellooooo bundle products= {data.getBundleProducts.name}</h1>;
};
export default bundleProducts;
