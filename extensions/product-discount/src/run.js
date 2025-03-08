// // @ts-check
// import { DiscountApplicationStrategy } from "../generated/api";

// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  */

// /**
//  * @type {FunctionRunResult}
//  */
// const EMPTY_DISCOUNT = {
//   discountApplicationStrategy: DiscountApplicationStrategy.First,
//   discounts: [],
// };

// /**
//  * @param {RunInput} input
//  * @returns {FunctionRunResult}
//  */
// export function run(input) {
//   const configuration = JSON.parse(
//     input?.discountNode?.metafield?.value ?? "{}"
//   );

//   return EMPTY_DISCOUNT;
// };
import { run } from "@shopify/shopify_function";

async function fetchBundleFromDB() {
  return {
    productIds: ["gid://shopify/Product/7596326912207"],
    discountValue: 10.0,
    discountType: "percentage", // or "fixedAmount"
  };
}

export default run(async (input) => {
  const bundleData = await fetchBundleFromDB();
  const discounts = [];

  console.log("Bundle Data:", bundleData);

  input.cart.lines.forEach((lineItem) => {
    if (bundleData.productIds.includes(lineItem.merchandise.id)) {
      discounts.push({
        targets: [{ productVariant: { id: lineItem.merchandise.id } }],
        value: {
          percentage: bundleData.discountType === "percentage" 
            ? { value: bundleData.discountValue }
            : undefined,
          fixedAmount: bundleData.discountType === "fixedAmount" 
            ? { amount: bundleData.discountValue }
            : undefined,
        },
      });
    }
  });

  return { discounts };
});



