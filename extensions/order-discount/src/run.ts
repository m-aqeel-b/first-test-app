import type {
  RunInput,
  FunctionRunResult,
  ProductVariant
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const MIN_UNIQUE_PRODUCT=2;
const DISCOUNT_PER_PRODUCT=5;
const MAX_DISCOUNT = 20;

export function run(input: any): FunctionRunResult {
  const uniqueProducts = input.cart.lines.reduce((productIds: any, line: any)=>{
    productIds.add((line.merchandise as ProductVariant).product.id);
    return productIds;
  }, new Set<string>());

  if(uniqueProducts.Size < MIN_UNIQUE_PRODUCT){
    return EMPTY_DISCOUNT
  }
  else{
    const discount = Math.min(uniqueProducts.Size*DISCOUNT_PER_PRODUCT, MAX_DISCOUNT);
    const uniqueDiscountProducts = discount/DISCOUNT_PER_PRODUCT;
    return{
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts:[
        {
          message:`${discount}% off for buying ${uniqueDiscountProducts} unique products`,
          value:{
            percentage:{
              value:discount
            }
          },
          targets:[{
            orderSubtotal:{
              excludedVariantIds:[]
            }
          }]
        }
      ]
    }
  }
};