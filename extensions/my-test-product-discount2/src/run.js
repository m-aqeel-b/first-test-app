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

// import { run } from "@shopify/shopify_function";

// async function fetchBundleFromDB() {
//   return {
//     productIds: ["gid://shopify/Product/7596326912207"],
//     discountValue: 10.0,
//     discountType: "percentage", // or "fixedAmount"
//   };
// }

// export default run(async (input) => {
//   const bundleData = await fetchBundleFromDB();
//   const discounts = [];

//   console.log("Bundle Data2:", bundleData);

//   input.cart.lines.forEach((lineItem) => {
//     if (bundleData.productIds.includes(lineItem.merchandise.id)) {
//       discounts.push({
//         targets: [{ productVariant: { id: lineItem.merchandise.id } }],
//         value: {
//           percentage: bundleData.discountType === "percentage" 
//             ? { value: bundleData.discountValue }
//             : undefined,
//           fixedAmount: bundleData.discountType === "fixedAmount" 
//             ? { amount: bundleData.discountValue }
//             : undefined,
//         },
//       });
//     }
//   });

//   return { discounts };
// });

// import { run } from "@shopify/shopify_function";

import { DiscountApplicationStrategy } from "../generated/api";


// Export the run function as a named export
export const run = (input) => {
  // const bundleData = await fetchBundleFromDB();
  const discounts = [];

  

  // console.log("Bundle Data2:", bundleData);

    // const targets = input.cart.lines
    // // Only include cart lines with a quantity of two or more
    // .filter((line) => line.quantity >= 2)
    // .map((line) => {
    //   return /** @type {Target} */ ({
    //     // Use the cart line ID to create a discount target
    //     cartLine: {
    //       id: line.id,
    //     },
    //   });
    // });

  input.cart.lines.forEach((lineItem) => {
    // if (bundleData.productIds.includes(lineItem.merchandise.id)) {
      discounts.push({
        targets: [{ productVariant: { id: 'gid://shopify/ProductVariant/44279117021379' } }],
        // targets,
        value: {
          percentage: {
            value: "10.0",
          },
        },
        // value: {
        //   percentage: bundleData.discountType === "percentage" 
        //     ? { value: bundleData.discountValue }
        //     : 0,
        //   // fixedAmount: bundleData.discountType === "fixedAmount" 
        //   //   ? { amount: bundleData.discountValue }
        //   //   : 0,
        // },
      });
    // }
  });

  return { 
    discounts,  
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};



// // @ts-check
// import { DiscountApplicationStrategy } from "../generated/api";

// // Use JSDoc annotations for type safety
// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  * @typedef {import("../generated/api").Target} Target
//  * @typedef {import("../generated/api").ProductVariant} ProductVariant
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
//   const targets = input.cart.lines
//     // Only include cart lines with a quantity of two or more
//     .filter((line) => line.quantity >= 2)
//     .map((line) => {
//       return /** @type {Target} */ ({
//         // Use the cart line ID to create a discount target
//         cartLine: {
//           id: line.id,
//         },
//       });
//     });
//   if (!targets.length) {
//     // You can use STDERR for debug logs in your function
//     console.error("No cart lines qualify for volume discount.");
//     return EMPTY_DISCOUNT;
//   }

//   return {
//     discounts: [
//       {
//         // Apply the discount to the collected targets
//         targets,
//         // Define a percentage-based discount
//         value: {
//           percentage: {
//             value: "10.0",
//           },
//         },
//       },
//     ],
//     discountApplicationStrategy: DiscountApplicationStrategy.First,
//   };
// }
