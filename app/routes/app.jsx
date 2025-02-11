import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const test = await authenticate.admin(request);
  console.log("test1", test);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  //console.log("key is", apiKey);
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {/* <Link to="/app/additKKKkional">Additional page</Link> */}
        {/* <Link to="/app/test">Test page</Link> */}
        {/* <Link to="/app/layout">Layout</Link> */}
        <Link to="/app/collections">Collections</Link>
        {/* <Link to="/app/createCollection">Create Collections</Link> */}
        <Link to="/app/products">Products</Link>
        <Link to="/app/bundles">Bundles</Link>
        {/* <Link to="/app/createProduct">Create Products</Link> */}
        {/* <Link to="/app/discounts">Add Discounts</Link> */}
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
