import React from "react";
import { Config } from "../../util/config";
import { Button, Image, Space } from "antd";
import { FiEdit3 } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";

function UserCard({
  id,
  name,
  username,
  role_name,
  status,
  create_by,
  create_at,
  image,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="backdrop-blur-sm bg-white/30 p-3 rounded-xl shadow-lg">
      <img
        src={Config.image_path + image}
        alt={name}
        className="rounded-full"
      />
      <div className="font-bold truncate-text flex xl:text-md xl:justify-center">
        {name}
      </div>
      <div className="font-bold truncate-text xl:text-md">{username}</div>
      <div className="font-bold truncate-text xl:text-md">{role_name}</div>
      <div className="font-bold truncate-text xl:text-md">{status}</div>
      <div className="font-bold truncate-text xl:text-md">{create_by}</div>
      <div className="font-bold truncate-text xl:text-md">{create_at}</div>
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
  );
}

export default UserCard;
