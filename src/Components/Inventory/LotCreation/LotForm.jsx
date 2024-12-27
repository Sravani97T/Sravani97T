import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, Row, Col, Checkbox, message } from "antd";
import axios from "axios";

const { Option } = Select;

const LotForm = ({ onSubmit, onCancel, initialValues, tenantNameHeader }) => {
    const [form] = Form.useForm();
    const [mainProductOptions, setMainProductOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [prefixOptions, setPrefixOptions] = useState([]);
    const [counterOptions, setCounterOptions] = useState([]);
    const [lotNumber, setLotNumber] = useState(null);

    const mainProductRef = useRef(null);
    const manufacturerRef = useRef(null);
    const prefixRef = useRef(null);
    const counterRef = useRef(null);
    const piecesRef = useRef(null);

    // Fetch Lot No on Form load
    useEffect(() => {
        const fetchLotNumber = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationMaxNumber"
                );
                if (response.data && response.data.length > 0) {
                    setLotNumber(response.data[0].LOTMAXNUMBER);
                    form.setFieldsValue({ lotNo: response.data[0].LOTMAXNUMBER });
                }
            } catch (error) {
                message.error("Failed to fetch Lot Number.");
            }
        };

        fetchLotNumber();
    }, [form]);

    useEffect(() => {
        const fetchMainProducts = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList"
                );
                const options = response.data.map((item) => item.MNAME);
                setMainProductOptions(options);
            } catch (error) {
                message.error("Failed to fetch main products.");
            }
        };

        const fetchManufacturerData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterManufacturerMasterList"
                );
                const options = response.data.map((item) => item.MANUFACTURER);
                setManufacturerOptions(options);
            } catch (error) {
                message.error("Failed to fetch manufacturer data.");
            }
        };

        const fetchPrefixData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList"
                );
                const options = response.data.map((item) => item.Prefix);
                setPrefixOptions(options);
            } catch (error) {
                message.error("Failed to fetch prefix data.");
            }
        };

        const fetchCounterData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterCounterMasterList"
                );
                const options = response.data.map((item) => item.Counter);
                setCounterOptions(options);
            } catch (error) {
                message.error("Failed to fetch counter data.");
            }
        };

        fetchMainProducts();
        fetchManufacturerData();
        fetchPrefixData();
        fetchCounterData();
    }, [tenantNameHeader]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);
    const handleSubmit = async (values) => {
        const requestBody = {
            mname: values.mainProduct,
            lotno: lotNumber,
            pieces: values.pieces || 0,
            weight: 0,
            dealerName: values.dealer,
            manufacturer: values.manufacturer,
            balpieces: 0,
            balweight: 0,
            prefix: values.prefix,
            counter: values.counter,
            lotdate: "12/17/2024", // Use the required date format
            lottime: "23:07", // Adjust time accordingly
            approvals: values.approvals,
            touch: 0,
            wastage: 0,
            suspence: true,
            purecost: 0,
            mcper: 0,
            mcamt: 0,
            cosT_CATEGORY: "TESTLOT", // Adjust based on your use case
            cloud_upload: true,
        };

        try {
            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationInsert",
                requestBody
            );

            if (response.data === true) {
                onSubmit(values);
            } else {
                message.error("Failed to create Lot. Unexpected response from server.");
            }
        } catch (error) {
            message.error("An error occurred while submitting the form.");
        }
    };


    const handleKeyDown = (e, ref) => {
        if (e.key === "Enter") {
            if (ref.current) {
                ref.current.blur();
                ref.current.focus();
            }
            moveToNextField(ref);
        }
    };

    const moveToNextField = (ref) => {
        if (ref === mainProductRef.current) {
            manufacturerRef.current?.focus();
        } else if (ref === manufacturerRef.current) {
            prefixRef.current?.focus();
        } else if (ref === prefixRef.current) {
            counterRef.current?.focus();
        } else if (ref === counterRef.current) {
            piecesRef.current?.focus();
        } else {
            form.submit();
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item name="lotNo" label="Lot No.">
                        <Input placeholder="Fetching Lot No..." disabled value={lotNumber} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item name="approvals" label="Approval" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="mainProduct"
                        label="Main Product"
                        rules={[{ required: true, message: "Main Product is required" }]}
                    >
                        <Select
                            ref={mainProductRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, mainProductRef)}
                            placeholder="Select Main Product"
                        >
                            {mainProductOptions.map((product, index) => (
                                <Option key={index} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="pieces"
                        label="Pieces"
                        rules={[{ required: true, message: "Pieces are required" }]}
                    >
                        <Input ref={piecesRef} placeholder="Enter Number of Pieces" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="dealer"
                        label="Dealer"
                        rules={[{ required: true, message: "Dealer is required" }]}
                    >
                        <Select
                            ref={manufacturerRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, manufacturerRef)}
                            placeholder="Select Dealer"
                        >
                            <Option value="dealer1">Dealer 1</Option>
                            <Option value="dealer2">Dealer 2</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="manufacturer"
                        label="Manufacturer"
                        rules={[{ required: true, message: "Manufacturer is required" }]}
                    >
                        <Select
                            ref={prefixRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, prefixRef)}
                            placeholder="Select Manufacturer"
                        >
                            {manufacturerOptions.map((manufacturer, index) => (
                                <Option key={index} value={manufacturer}>
                                    {manufacturer}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="prefix"
                        label="Prefix"
                        rules={[{ required: true, message: "Prefix is required" }]}
                    >
                        <Select
                            ref={counterRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, counterRef)}
                            placeholder="Select Prefix"
                        >
                            {prefixOptions.map((prefix, index) => (
                                <Option key={index} value={prefix}>
                                    {prefix}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="counter"
                        label="Counter"
                        rules={[{ required: true, message: "Counter is required" }]}
                    >
                        <Select
                            placeholder="Select Counter"
                        >
                            {counterOptions.map((counter, index) => (
                                <Option key={index} value={counter}>
                                    {counter}
                                </Option>
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
