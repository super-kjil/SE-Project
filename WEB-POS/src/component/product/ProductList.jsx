import { Button, Image, Space } from "antd";
import React from "react";
import { Config } from "../../util/config";
import { FiEdit3 } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
function ProductList({
  id,
  name,
  description,
  image,
  category_name,
  brand,
  price,
  discount,
  barcode,
  handleEdit,
  handleDelete,
}) {
  var final_price = price;
  if (discount != 0 && discount != null) {
    final_price = price - (price * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <div className="p-3 rounded-xl bg-white shadow-lg">
      <Image src={Config.image_path + image} alt={name} />
      <div className="font-bold truncate-text text-md">{name}</div>
      <div className="font-bold mt-1 text-[10px]">
        {barcode} | {category_name} | {brand}
      </div>
      <div className="mt-1 text-xs text-gray-600">{description}</div>
      {discount != 0 && discount != null ? (
        <div className="mt-1 flex items-center justify-between">
          <div className="text-xs line-through text-slate-500">${price}</div>
          <div className="text-xs font-bold text-red-600">{discount}%</div>
          <div className="font-bold mt-1 text-md bg-slate-50 rounded-xl p-1">
            ${final_price}
          </div>
        </div>
      ) : (
        <div className="mt-1 flex">
          <div className="font-bold text-md"> {price}$</div>
        </div>
      )}
      <div className="mt-1">
        <Space>
          <Button
            className="shadow-md  rounded-xl bg-white"
            onClick={handleEdit}
            icon={<FiEdit3 />}
          ></Button>
          <Button
            className="shadow-md rounded-xl bg-white"
            onClick={handleDelete}
            icon={<BiTrash />}
          ></Button>
        </Space>
      </div>
    </div>
  );
}

export default ProductList;
