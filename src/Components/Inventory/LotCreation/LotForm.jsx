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
    const [lotNumber, setLotNumber] = useState(null); // State to store Lot No

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
                setLotNumber(response.data[0].Column1); // Set lot number to state
                form.setFieldsValue({ lotNo: response.data[0].Column1 }); // Set form field value
            }
        } catch (error) {
            message.error("Failed to fetch Lot Number.");
        }
    };

    fetchLotNumber();
}, [form]);

    useEffect(() => {
        // Fetch Main Product data
        const fetchMainProducts = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList"
                );
                const options = response.data.map((item) => item.MNAME); // Assuming the response contains MNAME
                setMainProductOptions(options);
            } catch (error) {
                message.error("Failed to fetch main products.");
            }
        };

        // Fetch Manufacturer data
        const fetchManufacturerData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterManufacturerMasterList"
                );
                const options = response.data.map((item) => item.MANUFACTURER); // Assuming the response contains MANUFACTURER
                setManufacturerOptions(options);
            } catch (error) {
                message.error("Failed to fetch manufacturer data.");
            }
        };

        // Fetch Prefix data
        const fetchPrefixData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList"
                );
                const options = response.data.map((item) => item.Prefix); // Assuming the response contains Prefix
                setPrefixOptions(options);
            } catch (error) {
                message.error("Failed to fetch prefix data.");
            }
        };

        // Fetch Counter data
        const fetchCounterData = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/MasterCounterMasterList"
                );
                const options = response.data.map((item) => item.Counter); // Assuming the response contains Counter
                setCounterOptions(options);
            } catch (error) {
                message.error("Failed to fetch counter data.");
            }
        };

        // Call all the fetch functions
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

    // Handle form submit and API call
    const handleSubmit = async (values) => {
        const requestBody = {
            mname: values.mainProduct,  // Main Product
            lotno: lotNumber,        // Lot No.
            pieces: values.pieces,      // Pieces
            weight: 0,                  // Assuming weight is zero, you may modify this if needed
            dealerName: values.dealer,  // Dealer Name
            manufacturer: values.manufacturer, // Manufacturer
            balpieces: 0,               // Assuming balance pieces is zero
            balweight: 0,               // Assuming balance weight is zero
            prefix: values.prefix,      // Prefix
            counter: values.counter,    // Counter
            lotdate: "2024-12-16",      // Placeholder for lot date (you can modify this)
            lottime: "12:00:00",        // Placeholder for lot time
            approvals: values.approvals, // Approval status
            touch: 0,                   // Placeholder for touch
            wastage: 0,                 // Placeholder for wastage
            suspence: true,             // Placeholder for suspence
            purecost: 0,                // Placeholder for pure cost
            mcper: 0,                   // Placeholder for mcper
            mcamt: 0,                   // Placeholder for mcamt
            cosT_CATEGORY: "General",   // Placeholder for cost category
            cloud_upload: true,         // Placeholder for cloud upload status
        };

        try {
            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Erp/LotCreationInsert",
                requestBody
            );
            if (response.status === 200) {
                message.success("Lot created successfully!");
                onSubmit(values); // Notify parent about successful submit
            } else {
                message.error("Failed to create Lot.");
            }
        } catch (error) {
            message.error("An error occurred while submitting the form.");
        }
    };

    const handleKeyDown = (e, ref) => {
        if (e.key === "Enter") {
            // Select the item if dropdown is open
            if (ref.current) {
                ref.current.blur();
                ref.current.focus(); // To simulate a select on enter
            }
            // Move to next field after Enter
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
            form.submit(); // Submit the form if all fields are filled
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                {/* Lot No. */}
                <Col xs={24} sm={12} lg={12}>
                <Form.Item name="lotNo" label="Lot No.">
                        <Input placeholder="Fetching Lot No..." disabled value={lotNumber} />
                    </Form.Item>
                </Col>

                {/* Approvals Checkbox */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item name="approvals" label="Approval" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                {/* Main Product Dropdown */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="mainProduct"
                        label="Main Product"
                        rules={[{ required: true, message: "Main Product is required" }]}>
                        <Select
                            ref={mainProductRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, mainProductRef)}
                            placeholder="Select Main Product">
                            {mainProductOptions.map((product, index) => (
                                <Option key={index} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                {/* Pieces */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="pieces"
                        label="Pieces"
                        rules={[{ required: true, message: "Pieces are required" }]}>
                        <Input ref={piecesRef} placeholder="Enter Number of Pieces" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                {/* Dealer Dropdown */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="dealer"
                        label="Dealer"
                        rules={[{ required: true, message: "Dealer is required" }]}>
                        <Select
                            onKeyDown={(e) => handleKeyDown(e, manufacturerRef)}
                            ref={manufacturerRef}
                            showSearch
                            placeholder="Select Dealer">
                            <Option value="dealer1">Dealer 1</Option>
                            <Option value="dealer2">Dealer 2</Option>
                        </Select>
                    </Form.Item>
                </Col>

                {/* Manufacturer Dropdown */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="manufacturer"
                        label="Manufacturer"
                        rules={[{ required: true, message: "Manufacturer is required" }]}>
                        <Select
                            onKeyDown={(e) => handleKeyDown(e, prefixRef)}
                            ref={prefixRef}
                            showSearch
                            placeholder="Select Manufacturer">
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
                {/* Prefix Dropdown */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="prefix"
                        label="Prefix"
                        rules={[{ required: true, message: "Prefix is required" }]}>
                        <Select
                            ref={prefixRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, counterRef)}
                            placeholder="Select Prefix">
                            {prefixOptions.length > 0 ? (
                                prefixOptions.map((prefix, index) => (
                                    <Option key={index} value={prefix}>
                                        {prefix}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>No Prefix Available</Option>
                            )}
                        </Select>
                    </Form.Item>
                </Col>

                {/* Counter Dropdown */}
                <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                        name="counter"
                        label="Counter"
                        rules={[{ required: true, message: "Counter is required" }]}>
                        <Select
                            ref={counterRef}
                            showSearch
                            onKeyDown={(e) => handleKeyDown(e, piecesRef)}
                            placeholder="Select Counter">
                            {counterOptions.length > 0 ? (
                                counterOptions.map((counter, index) => (
                                    <Option key={index} value={counter}>
                                        {counter}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>No Counter Available</Option>
                            )}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            {/* Submit and Cancel buttons */}
            <div style={{ textAlign: "right", marginTop: "16px" }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
                    Submit
                </Button>
                <Button onClick={onCancel} style={{ backgroundColor: "#f0f0f0" }}>
                    Cancel
                </Button>
            </div>
        </Form>
    );
};

export default LotForm;
