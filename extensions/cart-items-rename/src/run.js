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
export function run(input) {
  const operations = [];

  if (input.cart.lines.length >= 3) {
    const cartItems = input.cart.lines.filter((item) =>
      isProductVariant(item.merchandise),
    );

    const parentItem = input.cart.lines[0];
    const childItems = input.cart.lines.slice(1);

    childItems.forEach((item) => {
      operations.push({
        update: {
          cartLineId: item.id,
          attributes: [{ key: "_parent_id", value: parentItem.id }],
          title: `included in ${parentItem.merchandise.product.title}`,
        },
      });
    });

    operations.push({
      update: {
        cartLineId: parentItem.id,
        title: `Bundle: ${parentItem.merchandise.product.title}`,
      },
    });
  }

  return operations.length > 0 ? { operations } : NO_CHANGES;
}
