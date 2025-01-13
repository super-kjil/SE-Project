import { Button, Col, Image } from "antd";
import React from "react";
import { Config } from "../../util/config";
import { FaCartShopping } from "react-icons/fa6";

function ProductItem({
  name,
  description,
  image,
  category_name,
  brand,
  price,
  discount,
  barcode,
  handleAdd,
}) {
  var final_price = price;
  if (discount != 0 && discount != null) {
    final_price = price - (price * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <>
      {/* <div className="overflow-y-scroll scrollbar"></div> */}
      <div className="p-3 rounded-xl bg-white shadow-lg overflow-y-scroll scrollbar ">
        <img src={Config.image_path + image} alt={name} className="sm:w-8/12" />
        <div className="xl:font-bold xl:text-lg xl:truncate-text  xs:font-bold xs:text-[10px] x">
          {name}
        </div>
        <div className="mt-1 xl:font-bold xl:text-lg xl:truncate-text  xs:font-bold xs:text-[8px]">
          {barcode} | {category_name}
        </div>
        <div className="mt-1 xl:text-lg xl:truncate-text  xs:text-[7px]">
          {description}
        </div>
        {discount != 0 && discount != null ? (
          <div className="mt-1 flex xl:flex-row 2xl:items-center xl:items-center lg:items-center xs:mt-[3px] xs-item-center xs:justify-between xxs:item-center">
            <div className="text-xs lg:text-xs line-through text-slate-500 xs:text-[7px]">
              ${price}
            </div>
            <div className="xs:text-[9px] lg:text-xs font-bold text-red-600">
              {discount}%
            </div>
            <div className="xl:text-lg xs:text-[10px] font-bold text-md rounded-xl ">
              ${final_price}
            </div>
          </div>
        ) : (
          <div className="mt-1 flex">
            <div className="xl:text-lg font-bold text-md xs:text-xs">
              {" "}
              {price}$
            </div>
          </div>
        )}
        <div className="mt-1">
          <Button
            className="w-full shadow-md rounded-2xl bg-blue-500 xl:text-lg xl:h-10 xs:text-[10px] xs:h-6"
            onClick={handleAdd}
            icon={<FaCartShopping />}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </>
  );
}

export default ProductItem;
