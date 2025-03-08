
// import { run } from "@shopify/shopify_function";

// async function fetchBundleFromDB() {
//   return {
//     productIds: ["gid://shopify/Product/7596326912207"], 
//     discountValue: 10.0,
//     discountType: "percentage", 
//   };
// }

// export default run(async (input) => {
//   const bundleData = await fetchBundleFromDB(); 
//   const discounts = [];
//   console.log("data is,", bundleData)

//   input.cart.lines.forEach((lineItem) => {
//     if (bundleData.productIds.includes(lineItem.merchandise.id)) {
//       discounts.push({
//         value: bundleData.discountType === "percentage" 
//           ? -(bundleData.discountValue / 100) 
//           : -bundleData.discountValue, 
//         valueType: bundleData.discountType,
//       });
//     }
//   });

//   return { discounts };

// });
// export * from './run';
// export * from './run';