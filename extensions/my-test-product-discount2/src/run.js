import { DiscountApplicationStrategy } from "../generated/api";

export const run = (input) => {
  const discounts = [];

  const bundleItems = input.cart.lines.filter(item => {
    return item?.attribute?.key === '_bundle_discount';
  })

  bundleItems.forEach((lineItem) => {
      const bundleValue = lineItem?.attribute?.value;
      discounts.push({
        targets: [{ productVariant: { id: lineItem.merchandise.id } }],
        value: {
          percentage: {
            value: bundleValue,
          },
        },
      });
  });

  return { 
    discounts,  
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};