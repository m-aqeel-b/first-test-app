import { DiscountApplicationStrategy } from "../generated/api";

export const run = (input) => {
  const discounts = [];

  const bundleItems = input.cart.lines.filter((item) => {
    return item?.bundleType?.value == "percentage_discount";
  });

  if (bundleItems.length > 0) {
    bundleItems.forEach((lineItem) => {
      const bundleValue = lineItem?.bundleDiscount?.value;
      console.log("percentage", bundleValue);
      discounts.push({
        targets: [{ productVariant: { id: lineItem.merchandise.id } }],
        value: {
          percentage: {
            value: bundleValue,
          },
        },
      });
    });
  }

  const bundleItems2 = input.cart.lines.filter((item) => {
    return item?.bundleType?.value === "fixed_discount";
  });
  console.log("get fix", bundleItems2);
  if (bundleItems2.length > 0) {
    bundleItems2.forEach((lineItem) => {
      const bundleValue = lineItem?.bundleDiscount?.value;
      console.log("fixed", bundleValue);
      discounts.push({
        targets: [{ productVariant: { id: lineItem.merchandise.id } }],
        value: {
          fixedAmount: {
            amount: bundleValue,
          },
        },
      });
    });
  }

  console.log("discount value1", discounts.length);

  return {
    discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
};
