import React, { useState, useEffect, useRef } from 'react';
import { Table, Row, Col, Input, Select, Button, Form, Breadcrumb, Card, message } from 'antd';
import PdfExcelPrint from '../../Utiles/PdfExcelPrint';
import axios from 'axios';
import { CREATE_jwel } from "../../../Config/Config";
import TableHeaderStyles from '../../Pages/TableHeaderStyles';

const { Option } = Select;

const EstimationPurchase = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [counter, setCounter] = useState(1);
    const [mainProducts, setMainProducts] = useState([]);
    const formRef = useRef(null);

    // Fetch Main Products from API
    useEffect(() => {
        const fetchMainProducts = async () => {
            try {
                const response = await axios.get(`${CREATE_jwel}/api/Master/MasterMainProductList`);
                const options = response.data.map((item) => item.MNAME);  // Assuming the response contains MNAME
                setMainProducts(options);
            } catch (error) {
                message.error("Failed to fetch main products.");
            }
        };

        fetchMainProducts();
    }, []);

    // Handle Input Calculations
    const handleValuesChange = (_, allValues) => {
        const { gwt, touch, rate, others } = allValues;
        const gwtValue = parseFloat(gwt) || 0;
        const touchValue = parseFloat(touch) || 0;
        const rateValue = parseFloat(rate) || 0;
        const othersValue = parseFloat(others) || 0;

        const nwt = (gwtValue * touchValue) / 100;
        const amount = nwt * rateValue;
        const total = amount + othersValue;

        form.setFieldsValue({
            nwt: nwt ? nwt.toFixed(3) : '',
            amount: amount ? amount.toFixed(2) : '',
            total: total ? total.toFixed(2) : ''
        });
    };

    // Handle Form Submission (Adding Records)
    const handleAdd = (values) => {
        setData([...data, { key: counter, sno: counter, ...values }]);
        setCounter(counter + 1);
        form.resetFields();
        formRef.current.getFieldInstance('mainProduct').focus();
    };

    // Handle Enter Key Navigation
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const formElements = formRef.current.getFieldsValue();
            const keys = Object.keys(formElements);
            const currentIndex = keys.findIndex(key => key === event.target.id);

            if (currentIndex >= 0 && currentIndex < keys.length - 1) {
                formRef.current.getFieldInstance(keys[currentIndex + 1]).focus();
            } else {
                form.submit();
            }
        }
    };

    // Handle Save Button Click
    const handleSave = () => {
        console.log('Saving Data:', data);
        // API call logic here...
    };

    // Calculate Totals
    const calculateTotals = () => {
        return data.reduce((totals, item) => {
            totals.gwt += parseFloat(item.gwt) || 0;
            totals.touch += parseFloat(item.touch) || 0;
            totals.nwt += parseFloat(item.nwt) || 0;
            totals.rate += parseFloat(item.rate) || 0;
            totals.amount += parseFloat(item.amount) || 0;
            totals.others += parseFloat(item.others) || 0;
            totals.total += parseFloat(item.total) || 0;
            return totals;
        }, {
            gwt: 0,
            touch: 0,
            nwt: 0,
            rate: 0,
            amount: 0,
            others: 0,
            total: 0
        });
    };

    const totals = calculateTotals();

    // Table Columns
    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', width: 50 },
        { title: 'Main Product', dataIndex: 'mainProduct', key: 'mainProduct' },
        { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
        { title: 'GWT', dataIndex: 'gwt', key: 'gwt', align: 'right',render: value => (value ? parseFloat(value).toFixed(3) : '') ,},
        { title: 'Touch (%)', dataIndex: 'touch', key: 'touch', align: 'right' },
        { title: 'NWT', dataIndex: 'nwt', key: 'nwt', align: 'right', render: value => (value ? parseFloat(value).toFixed(3) : '') },
        { title: 'Rate', dataIndex: 'rate', key: 'rate', align: 'right' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: value => (value ? parseFloat(value).toFixed(2) : '') },
        { title: 'Others', dataIndex: 'others', key: 'others', align: 'right' },
        { title: 'Total Amount', dataIndex: 'total', key: 'total', align: 'right', render: value => (value ? parseFloat(value).toFixed(2) : '') }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Estimation Purchase</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint data={data} columns={columns} fileName="EstimationPurchaseReport" />
                </Col>
            </Row>

            <Form
                form={form}
                onFinish={handleAdd}
                layout="vertical"
                onValuesChange={handleValuesChange}
                onKeyDown={handleKeyDown}
                ref={formRef}
            >
                <Card style={{
                    backgroundColor: "#fff", position: 'relative', boxShadow: "5px 4px 8px rgba(29, 26, 26, 0.1)",
                }}>
                    <Row>
                        <Col span={6}>
                            <Form.Item name="estimationNo" label="Estimation No">
                                <Input placeholder="Estimation No" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="mainProduct" label="Main Product">
                                <Select placeholder="Select Main Product" showSearch allowClear>
                                    {mainProducts.map((product, index) => (
                                        <Option key={index} value={product}>
                                            {product}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="productName" label="Product Name">
                                <Input placeholder="Enter Product Name" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="gwt" label="GWT">
                                <Input placeholder="Enter GWT" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="touch" label="Touch (%)">
                                <Input placeholder="Enter Touch" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="nwt" label="NWT">
                                <Input placeholder="NWT" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="rate" label="Rate">
                                <Input placeholder="Enter Rate" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="amount" label="Amount">
                                <Input placeholder="Amount" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="others" label="Others">
                                <Input placeholder="Others" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="total" label="Total">
                                <Input placeholder="Total" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end">
                        <Col>
                            <Button type="primary" htmlType="submit">Add</Button>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <TableHeaderStyles>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">{totals.gwt.toFixed(3)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right">{totals.touch.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right">{totals.nwt.toFixed(3)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right">{totals.rate.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right">{totals.amount.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align="right">{totals.others.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align="right">{totals.total.toFixed(2)}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </TableHeaderStyles>
            <Row>
                <Col>
                    {data.length > 0 && (
                        <Button
                            type="primary"
                            style={{ right: 10 }}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default EstimationPurchase;
