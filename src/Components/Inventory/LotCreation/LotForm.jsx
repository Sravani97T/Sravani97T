import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, Checkbox, Card, message } from "antd";
import axios from "axios";

const { Option } = Select;

const LotForm = ({ onSubmit, onCancel, initialValues, tenantNameHeader }) => {
    const [form] = Form.useForm();
    const [mainProductOptions, setMainProductOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [prefixOptions, setPrefixOptions] = useState([]);
    const [counterOptions, setCounterOptions] = useState([]);
    const [lotNumber, setLotNumber] = useState(1); // Default to 1 if null

    // Fetch Lot No on Form load
    useEffect(() => {
        const fetchLotNumber = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationMaxNumber"
                );
    
                // If API returns null, default to 1
                const lotNo = response.data?.[0]?.LOTMAXNUMBER ?? 1;
    
                setLotNumber(lotNo);
                form.setFieldsValue({ lotNo });
            } catch (error) {
                message.error("Failed to fetch Lot Number.");
                setLotNumber(1);  // Default to 1 if API fails
                form.setFieldsValue({ lotNo: 1 });
            }
        };
    
        fetchLotNumber();
    }, [form]);
    

    useEffect(() => {
        const fetchData = async (url, setState, key) => {
            try {
                const response = await axios.get(url);
                const options = response.data.map(item => item[key]);
                setState(options);
            } catch (error) {
                message.error(`Failed to fetch data from ${url}`);
            }
        };

        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList", setMainProductOptions, "MNAME");
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterManufacturerMasterList", setManufacturerOptions, "MANUFACTURER");
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList", setPrefixOptions, "Prefix");
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCounterMasterList", setCounterOptions, "Counter");
    }, [tenantNameHeader]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const handleSubmit = async (values) => {
        try {
            // Fetch latest Lot No before submission
            const lotNumberResponse = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationMaxNumber"
            );
            
            const nextLotNo = lotNumberResponse.data?.[0]?.LOTMAXNUMBER ?? 1;
    
            // Set the Lot No in the form
            setLotNumber(nextLotNo);
            form.setFieldsValue({ lotNo: nextLotNo });
    
            const requestBody = {
                lotno: nextLotNo,
                balpieces: 0,
                balweight: 0,
                lotdate: new Date().toLocaleDateString(),
                lottime: new Date().toLocaleTimeString(),
                suspence: true,
                cosT_CATEGORY: "TESTLOT",
                cloud_upload: true,
                mname: values.mainProduct,  // Corrected field mapping
                dealerName: values.dealer,  // Corrected field mapping
                pieces: values.pieces,
                weight: values.weight,
                manufacturer: values.manufacturer,
                prefix: values.prefix,
                counter: values.counter,
            };
    
            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationInsert",
                requestBody
            );
    
            if (response.data === true) {
                message.success("Lot created successfully!");
                onSubmit(values);
            } else {
                message.error("Failed to create Lot.");
                throw new Error("API returned false");
            }
        } catch (error) {
            message.error("An error occurred while submitting the form.");
            
            // Reset Lot No to the previous value if submission fails
            const lotNumberResponse = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationMaxNumber"
            );
            const currentLotNo = lotNumberResponse.data?.[0]?.LOTMAXNUMBER ?? 1;
            setLotNumber(currentLotNo);
            form.setFieldsValue({ lotNo: currentLotNo });
        }
    };
    

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                    <Form.Item name="lotNo" label="Lot No.">
    <Input value={lotNumber || "1"} disabled />
</Form.Item>

                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="approvals" valuePropName="checked">
                        <Checkbox>Approval</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="mainProduct" label="Main Product" rules={[{ required: true }]}>
                        <Select placeholder="Select Main Product">
                            {mainProductOptions.map((product, index) => (
                                <Option key={index} value={product}>{product}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="pieces" label="Pieces" rules={[{ required: true }]}>
                        <Input placeholder="Enter Pieces" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
                        <Input placeholder="Enter Weight" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="dealer" label="Dealer" rules={[{ required: true }]}>
                        <Select placeholder="Select Dealer">
                            <Option value="dealer1">Dealer 1</Option>
                            <Option value="dealer2">Dealer 2</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}>
                        <Select placeholder="Select Manufacturer">
                            {manufacturerOptions.map((manufacturer, index) => (
                                <Option key={index} value={manufacturer}>{manufacturer}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="prefix" label="Prefix" rules={[{ required: true }]}>
                        <Select placeholder="Select Prefix">
                            {prefixOptions.map((prefix, index) => (
                                <Option key={index} value={prefix}>{prefix}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item name="counter" label="Counter" rules={[{ required: true }]}>
                        <Select placeholder="Select Counter">
                            {counterOptions.map((counter, index) => (
                                <Option key={index} value={counter}>{counter}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <div style={{ textAlign: "right", marginTop: "16px" }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
                    Submit
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </div>
        </Form>
    );
};

export default LotForm;
