import { DiscountApplicationStrategy } from "../generated/api";

export const run = (input) => {
  const discounts = [];

  const bundleItems = input.cart.lines.filter(item => {
    return item?.bundleType?.value == 'percentage_discount';
  })

  bundleItems.forEach((lineItem) => {
      const bundleValue = lineItem?.bundleDiscount?.value;
      console.log("check",bundleValue)
      discounts.push({
        targets: [{ productVariant: { id: lineItem.merchandise.id } }],
        value: {
          percentage: {
            value: bundleValue,
          },
        },
      });
  });
  console.log("discount value",discounts.length)

  return { 
    discounts,  
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
};