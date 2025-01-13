import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { MdAdd, MdHorizontalRule } from "react-icons/md";
import { FiTrash } from "react-icons/fi";

function AddedTocart({
  name,
  image,
  brand,
  category_name,
  price,
  discount,
  barcode,
  cart_qty,
  handleIncrease,
  handleDescrease,
  handleRemove,
  isPersistent,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isPersistent) {
      setVisible(true);
    }
  }, [isPersistent]);

  const finalPrice = discount
    ? (price - (price * discount) / 100).toFixed(2)
    : price;

  if (!visible) {
    return null;
  }

  return (
    <div className="shadow-lg rounded-lg bg-slate-100 mt-2 xs:mt-1 p-2">
      <div>
        <div className="flex-1 flex justify-between items-center">
          <div className="2xl:text-md 2xl:font-bold xs:text-xs xs:mt-0">
            {name}
          </div>
          <div>
            <button
              className="shadow-md rounded-lg text-md p-2 bg-white xs:text-md"
              onClick={() => {
                setVisible(false);
                handleRemove();
              }}
            >
              <FiTrash />
            </button>
          </div>
        </div>
        <div className="text-xs xs:text-[9px]">
          {barcode} | {category_name} | {brand}
        </div>
        <div className="flex justify-between items-center">
          {discount ? (
            <div className="mt-1 text-xs xs:mt-0 flex items-center justify-between">
              <div className="mr-1 text-xs xs:text-[9px] line-through text-slate-500">
                ${price}
              </div>
              <div className="ml-1 text-sm xs:text-[10px] font-bold text-red-600">
                {discount}%
              </div>
            </div>
          ) : null}
          <div className="font-bold xs:text-xs">
            {(cart_qty * finalPrice).toFixed(2) + "$"}
          </div>
        </div>
        <Space className="xs:mt-0">
          <Button
            onClick={handleDescrease}
            shape="circle"
            size="small"
            icon={<MdHorizontalRule />}
          />
          <div className="font-bold">{cart_qty}</div>
          <Button
            size="small"
            onClick={handleIncrease}
            shape="circle"
            icon={<MdAdd />}
          />
        </Space>
      </div>
    </div>
  );
}

export default AddedTocart;
