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

    const parentItem = cartItems[0];
    const childItems = cartItems.slice(1);

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
