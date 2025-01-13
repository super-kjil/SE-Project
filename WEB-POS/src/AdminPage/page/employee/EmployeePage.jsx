import React, { useEffect, useState } from "react";
import { formatDateClient, request } from "../../../util/helper";
import MainPage from "../../../component/layout/MainPage";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { create } from "qrcode";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeePage() {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
    txtSearch: "",
  });
  const [uploadedData, setUploadedData] = useState([]);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState((p) => ({
      ...p,
      loading: true,
    }));
    var param = {
      txtSearch: state.txtSearch,
    };
    const res = await request("employee", "get", param);
    //setloading(false);
    if (res && !res.error) {
      setState((p) => ({
        ...p,
        list: res.list,
        loading: false,
      }));
    }
  };
  const openModal = () => {
    setState((p) => ({
      ...p,
      visible: true,
    }));
  };

  const closeModal = () => {
    setState((p) => ({
      ...p,
      visible: false,
    }));
    form.resetFields();
  };

  const onClickEdit = (items, index) => {
    form.setFieldsValue({
      ...items,
      id: items.id,
    });
    openModal();
  };

  const onClickDelete = async (items, index) => {
    Modal.confirm({
      title: "Delete employee",
      content: "Are you sure to delete?",
      //okText: "យល់ព្រម",
      onOk: async () => {
        setState((p) => ({
          ...p,
          loading: true,
        }));
        const res = await request("employee", "delete", {
          id: items.id,
        });
        if (res && !res.error) {
          const newList = state.list.filter((item) => item.id != items.id);
          setState((p) => ({
            ...p,
            list: newList,
            loading: false,
          }));
          // getList();
          message.success(res.message);
        }
      },
    });
  };

  const onFinish = async (items) => {
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }
    setState((p) => ({
      ...p,
      loading: true,
    }));
    const res = await request("employee", method, {
      ...items,
      id: form.getFieldValue("id"),
    });
    if (res && !res.error) {
      getList();
      closeModal();
      message.success(res.message);
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setUploadedData(worksheet);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const exportExcel = () => {
    const data = state.list.map((item) => ({
      ...item,
      gender: item.gender == 1 ? "Male" : "Female",
      dob: formatDateClient(item.dob),
      create_at: formatDateClient(item.create_at),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Employee.xlsx");
  };
  // const exportPDF = () => {
  //   const doc = new jsPDF({
  //     orientation: 'landscape', // or 'landscape'
  //     unit: 'mm',
  //     format: 'a4'
  //   });
  //   doc.text("Employee Data", 20, 10);
  //   const data = state.list.map((item) => ({
  //     ...item,
  //     gender: item.gender == 1 ? "Male" : "Female",
  //     dob: formatDateClient(item.dob),
  //     create_at: formatDateClient(item.create_at),
  //   }));
  //   doc.autoTable({
  //     head: [Object.keys(data[0] || {})],
  //     body: data.map((row) => Object.values(row)),
  //   });
  //   doc.save("Employee.pdf");
  // };
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // or 'portrait'
      unit: "mm",
      format: "a4",
    });
    doc.text("Employee Data", 20, 10);
    const data = state.list.map((item) => ({
      ...item,
      gender: item.gender == 1 ? "Male" : "Female",
      dob: formatDateClient(item.dob),
      create_at: formatDateClient(item.create_at),
    }));

    // Calculate column widths
    const columnWidths = Object.keys(data[0] || {}).map(() => 22); // Adjust the width as needed

    doc.autoTable({
      head: [Object.keys(data[0] || {})],
      body: data.map((row) => Object.values(row)),
      styles: { fontSize: 8, cellPadding: 2 }, // Adjust font size and cell padding as needed
      columnStyles: Object.keys(data[0] || {}).reduce((acc, key, index) => {
        acc[index] = { cellWidth: columnWidths[index] };
        return acc;
      }, {}),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 20, left: 5, right: 5, bottom: 10 }, // Adjust margins as needed
    });

    doc.save("Employee.pdf");
  };
  return (
    <MainPage loading={state.loading}>
      <div className="pageHeader">
        <Space>
          <div style={{ fontWeight: "bold" }}>Employee</div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </Space>
        <Button type="primary" onClick={openModal}>
          NEW
        </Button>
        <Button type="primary" onClick={exportExcel}>
          Export
        </Button>
        <Button type="primary" onClick={exportPDF}>
          Export PDF
        </Button>
      </div>
      <Modal
        open={state.visible}
        title={form.getFieldValue("id") ? "Edit employee" : "New employee"}
        onCancel={closeModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name={"firstname"}
                label="Employee firstname"
                rules={[
                  {
                    required: true,
                    message: "Firstname required!",
                  },
                ]}
              >
                <Input placeholder="Input employee firstname" />
              </Form.Item>
              <Form.Item
                name={"lastname"}
                label="Employee lastname"
                rules={[
                  {
                    required: true,
                    message: "Lastname required!",
                  },
                ]}
              >
                <Input placeholder="Input employee lastname" />
              </Form.Item>
              <Form.Item
                name={"dob"}
                label="Date of birth"
                rules={[
                  {
                    required: true,
                    message: "Date of birth required!",
                  },
                ]}
              >
                <Input placeholder="Date of birth" />
              </Form.Item>
              <Form.Item name={"gender"} label="Gender">
                <Select
                  placeholder="Select Gender"
                  options={[
                    {
                      label: "Male",
                      value: 1,
                    },
                    {
                      label: "Female",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name={"card_id"}
                label="Card ID"
                rules={[
                  {
                    required: true,
                    message: "Card ID required!",
                  },
                ]}
              >
                <Input placeholder="Card ID" />
              </Form.Item>
              <Form.Item
                name={"tel"}
                label="Telephone"
                rules={[
                  {
                    required: true,
                    message: "Telephone required!",
                  },
                ]}
              >
                <Input placeholder="Telephone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"card_id"}
                label="Card ID"
                rules={[
                  {
                    required: true,
                    message: "Card ID required!",
                  },
                ]}
              >
                <Input placeholder="Card ID" />
              </Form.Item>
              <Form.Item
                name={"tel"}
                label="Telephone"
                rules={[
                  {
                    required: true,
                    message: "Telephone required!",
                  },
                ]}
              >
                <Input placeholder="Telephone" />
              </Form.Item>
              <Form.Item
                name={"email"}
                label="Employee email"
                rules={[
                  {
                    required: true,
                    message: "Email required!",
                  },
                ]}
              >
                <Input placeholder="Input email" />
              </Form.Item>

              <Form.Item
                name={"position"}
                label="Position"
                rules={[
                  {
                    required: true,
                    message: "Position required!",
                  },
                ]}
              >
                <Input placeholder="Position" />
              </Form.Item>
              <Form.Item
                name={"base_salary"}
                label="Base Salary"
                rules={[
                  {
                    required: true,
                    message: "Base Salary required!",
                  },
                ]}
              >
                <Input placeholder="Base Salary" />
              </Form.Item>
              <Form.Item
                name={"address"}
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Address required!",
                  },
                ]}
              >
                <Input placeholder="Inputaddress" />
              </Form.Item>
              {/* <Form.Item 
                name={"address"} 
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Address required!",
                  },
                ]}
                >
                <Input.TextArea placeholder="Address" />
              </Form.Item>
              <Form.Item name={"type"} label="Type">
                <Select
                  placeholder="Select Type"
                  options={[
                    {
                      label: "Regular",
                      value: "Regular",
                    },
                    {
                      label: "Premium",
                      value: "Premium",
                    },
                  ]}
                />
              </Form.Item> */}
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "No",
            title: "No.",
            render: (item, data, index) => index + 1,
          },
          {
            key: "firstname",
            title: "Firstname",
            dataIndex: "firstname",
          },
          {
            key: "lastname",
            title: "Lastname",
            dataIndex: "lastname",
          },
          {
            key: "dob",
            title: "Date Of Birth",
            dataIndex: "dob",
            render: (value) => dayjs(value).format("DD-MMM-YYYY"),
          },
          {
            key: "gender",
            title: "Gender",
            dataIndex: "gender",
            render: (gender) => (gender ? "Male" : "Female"),
          },
          {
            key: "card_id",
            title: "Card ID",
            dataIndex: "card_id",
          },
          {
            key: "tel",
            title: "Telephone",
            dataIndex: "tel",
          },
          {
            key: "email",
            title: "Email",
            dataIndex: "email",
          },
          {
            key: "address",
            title: "Address",
            dataIndex: "address",
          },
          {
            key: "position",
            title: "Position",
            dataIndex: "position",
          },
          {
            key: "base_salary",
            title: "Base Salary",
            dataIndex: "base_salary",
          },
          {
            key: "create_by",
            title: "Create By",
            dataIndex: "create_by",
          },
          {
            key: "create_at",
            title: "Create At",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD-MMM-YYYY"),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  //icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                >
                  {" "}
                  EDIT
                </Button>
                <Button
                  type="primary"
                  danger
                  //icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                >
                  DELETE
                </Button>
              </Space>
            ),
          },
        ]}
      />
      {/* Test Render data  */}
      {/* <Table dataSource={uploadedData} columns={Object.keys(uploadedData[0] || {}).map((key) => ({
          title: key,
          dataIndex: key,
          key,
        }))} /> */}
    </MainPage>
  );
}

export default EmployeePage;
