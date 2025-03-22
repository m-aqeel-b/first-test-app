// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

// /**
//  * @param {RunInput} input
//  * @returns {FunctionRunResult}
//  */

function isProductVariant(merchandise) {
  return (
    merchandise.__typename === "ProductVariant" && "product" in merchandise
  );
}

export function run(input) {
  const operations = [];

  const cartItems = input.cart.lines
    .filter(
      (item) =>
        isProductVariant(item.merchandise) &&
        item.merchandise.product.title.includes(":"),
    )
    .map((item) => {
      //const merchandise = item.merchandise;
      return {
        update: {
          cartLineId: item.id,
          title: item.merchandise.product.title.split(":")[0],
        },
      };
    });

  operations.push(...cartItems);
  console.log("get data is:", { operations });
  return { operations };
}
