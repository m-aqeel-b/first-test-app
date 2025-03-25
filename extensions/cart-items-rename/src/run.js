// // @ts-check

// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  */

// /**
//  * @type {FunctionRunResult}
//  */
// const NO_CHANGES = {
//   operations: [],
// };

// // /**
// //  * @param {RunInput} input
// //  * @returns {FunctionRunResult}
// //  */

// function isProductVariant(merchandise) {
//   return (
//     merchandise.__typename === "ProductVariant" && "product" in merchandise
//   );
// }

// export function run(input) {
//   const operations = [];

//   const cartItems = input.cart.lines
//     .filter(
//       (item) =>
//         isProductVariant(item.merchandise) &&
//         item.merchandise.product.title.includes(":"),
//     )
//     .map((item) => {
//       //const merchandise = item.merchandise;
//       return {
//         update: {
//           cartLineId: item.id,
//           title: item.merchandise.product.title.split(":")[0],
//         },
//       };
//     });

//   operations.push(...cartItems);
//   console.log("get data is:", { operations });
//   return { operations };
// }

const NO_CHANGES = {
  operations: [],
};

function isProductVariant(merchandise) {
  return (
    merchandise &&
    merchandise.__typename === "ProductVariant" &&
    "product" in merchandise &&
    merchandise.product &&
    merchandise.product.title
  );
}

/**
 * @param {Object} input - The cart input object
 * @returns {Object} - The function run result with operations
 */
// export function run(input) {
//   const operations = [];

//   if (input.cart.lines.length >= 3) {
//     const parentItem = input.cart.lines[0];
//     const childItems = input.cart.lines.slice(1);

//     childItems.forEach((item) => {
//       operations.push({
//         update: {
//           cartLineId: item?.id,
//           marchandise: {
//             attributes: [{ key: "_child_id", value: item?.id }],
//           },
//           //title: `included in ${item.merchandise.product.title}`,
//           title: item.merchandise?.product.title,
//         },
//       });
//     });

//     operations.push({
//       update: {
//         cartLineId: parentItem?.id,
//         merchandise: {
//           attributes: [{ key: "_parent_id", value: parentItem?.id }],
//         },
//         //title: `Bundle: ${parentItem.merchandise.product.title}`,
//         title: parentItem.merchandise?.product.title,
//       },
//     });
//   }

//   return { operations };
// }

// This function transforms a cart with 3+ items into a merged bundle
export function run(input) {
  if (input.cart.lines.length < 3) {
    return { operations: [] };
  }
  const [parentItem, ...childItems] = input.cart.lines;

  return {
    operations: [
      {
        merge: {
          cartLines: childItems.map((item) => ({
            cartLineId: item.id,
            quantity: item.quantity || 1,
          })),
          parentVariantId: parentItem.merchandise.id,
          price: {
            percentageDecrease: {
              value: 10.0,
            },
          },

          title: `${parentItem.merchandise.product.title} Bundle`,

          attributes: [
            {
              key: "_bundle_type",
              value: "auto_generated",
            },
            {
              key: "_bundle_components",
              value: childItems
                .map((item) => item.merchandise.product.title)
                .join(", "),
            },
          ],
        },
      },
    ],
  };
}
