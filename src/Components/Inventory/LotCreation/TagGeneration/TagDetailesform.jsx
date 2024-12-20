import React, { useState } from 'react';
import { Form, Input, Select, Button, Checkbox, Row, Col, Card, Table, Tag } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const TagDetailsForm = () => {
    const onFinish = (values) => {
        console.log('Form Values:', values);
    };
    const [searchText, setSearchText] = useState('');

    const dataSource = [
        {
            key: '1',
            productName: 'Gold Ring',
            purity: '22k',
            pieces: 2,
            gwt: 50,
            nwt: 48,
            lessWeight: 2,
            dealerName: 'Dealer A',
            tagNo: 'T123',
            counter: 'C1',
        },

    ];
    // Filtered Data
    const filteredData = dataSource.filter((item) =>
        item.productName.toLowerCase().includes(searchText.toLowerCase())
    );
    // Column definitions for the table
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Purity',
            dataIndex: 'purity',
            key: 'purity',
            align: "center"
        },
        {
            title: 'Pieces',
            dataIndex: 'pieces',
            key: 'pieces',
            align: "center"

        },
        {
            title: 'G.Wt',
            dataIndex: 'gwt',
            key: 'gwt',
            align: "center"

        },
        {
            title: 'N.Wt',
            dataIndex: 'nwt',
            key: 'nwt',
            align: "center"

        },
        {
            title: 'Less Weight',
            dataIndex: 'lessWeight',
            key: 'lessWeight',
            align: "center"

        },
        {
            title: 'Dealer Name',
            dataIndex: 'dealerName',
            key: 'dealerName',
            align: "center"

        },
        {
            title: 'Tag No',
            dataIndex: 'tagNo',
            key: 'tagNo',
            align: "center"

        },
        {
            title: 'Counter',
            dataIndex: 'counter',
            key: 'counter',
            align: "center"

        },
    ];
    // Calculations
    const totalGwt = dataSource.reduce((sum, item) => sum + item.gwt, 0);
    const totalNwt = dataSource.reduce((sum, item) => sum + item.nwt, 0);
    const totalLessWeight = dataSource.reduce((sum, item) => sum + item.lessWeight, 0);
    return (
        <div>

            <Row gutter={[16, 16]} justify="center">
                {/* Card 1 */}
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" onFinish={onFinish}>
                            {/* Purity and Manufacturer Row */}
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>  {/* Reduced the width of Purity column */}
                                    <Form.Item
                                        label="Purity"
                                        name="purity"
                                        rules={[{ message: 'Please select purity' }]}>
                                        <Select >
                                            <Option value="22k">22k</Option>
                                            <Option value="18k">18k</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>  {/* Adjusted width for Manufacturer */}
                                    <Form.Item
                                        label="Manufacturer"
                                        name="manufacturer"
                                        rules={[{ message: 'Please select manufacturer' }]}>
                                        <Select >
                                            <Option value="manufacturer1">Manufacturer 1</Option>
                                            <Option value="manufacturer2">Manufacturer 2</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Form.Item label="Dealer Name" name="dealerName">
                                        <Select >
                                            <Option value="dealer1">Dealer 1</Option>
                                            <Option value="dealer2">Dealer 2</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>


                            </Row>

                            {/* Certificate No., HUID and Dealer Name Row */}
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Counter" name="Counter">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Form.Item label="HUID" name="huid">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>  {/* Reduced the width of Size column */}
                                    <Form.Item label="Size" name="size">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Description Row */}
                            <Row gutter={[8, 16]}>
                            <Col xs={24} sm={8}>
                                    <Form.Item label="Certificate No." name="certificateNo">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Description" name="description">
                                        <TextArea rows={1} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item style={{ marginTop: "30px" }}>
                                        <Checkbox>
                                            <span style={{ marginLeft: '8px' }}>Lab Report</span>
                                        </Checkbox>
                                    </Form.Item>
                                </Col>

                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Card 2 - First Section (GWT, LES, NWT, Cost, MC/G, MC/Amount) */}
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" onFinish={onFinish}>
                            {/* First Section: GWT, LES, NWT, Cost, MC/G, MC/Amount */}
                            <Row gutter={[8, 16]}>
                                <Col xs={8}>
                                    <Form.Item label="GWT" name="gwt">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <Form.Item label="LES" name="les">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <Form.Item label="NWT" name="nwt">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={8}>
                                    <Form.Item label="Cost" name="cost">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <Form.Item label="MC/G" name="mcg">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <Form.Item label="MC/Amount" name="mcAmount">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Card 3 - Tag Number and Save Button */}
                <Col xs={24} sm={4}>
                    <Card bordered={false} style={{ marginTop: "5px", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Form onFinish={onFinish}>
                            {/* Tag Number and Save Button */}
                            <Row gutter={[8, 16]} style={{ width: '100%' }}>
                                <Col xs={24} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    {/* Tag No Label */}
                                    <div style={{ fontSize: "12px", marginBottom: "8px", fontWeight: "bold" }}>Tag No</div>

                                    {/* Tag No Input */}
                                    <Input
                                        size="small"
                                        style={{
                                            width: "50px", // Fixed width to make it square
                                            height: "50px", // Same height to create a square shape
                                            textAlign: "center", // Center the text
                                            borderRadius: "8px", // Rounded corners for better look
                                            fontSize: "16px", // Bigger font for better view
                                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Light shadow effect
                                            margin: "0 auto", // Center the input field in the card
                                        }}
                                    />
                                </Col>
                            </Row>


                            <Row gutter={[8, 16]} justify="center">
                                <Col>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" size="small">
                                            Save
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <div>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24}>
                        <div style={{
                            marginTop: '5px', backgroundColor: "#fff", padding: '6px', boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                        }}>
                            {/* Summary Section */}
                            <Row gutter={[16, 16]} align="middle" justify="end" style={{ marginBottom: '10px' }}>
                                <Col>
                                    <Tag color="lightgreen">Total G.Wt: {totalGwt} g</Tag>
                                </Col>
                                <Col>
                                    <Tag color='cyan-inverse'>Total N.Wt: {totalNwt} g</Tag>
                                </Col>
                                <Col>
                                    <Tag color="gold-inverse">Total Less Weight: {totalLessWeight} g</Tag>
                                </Col>
                                <Col>
                                    <Tag color="geekblue">Total Purity: 22k</Tag>
                                </Col>
                                <Col>
                                    <Input
                                        placeholder="Search Product"
                                        style={{
                                            width: '200px',
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Col>
                            </Row>

                            {/* Table */}
                            <Table
                                dataSource={filteredData}
                                columns={columns}
                                size="small"
                                pagination={{ pageSize: 5 }}
                                style={{ marginTop: '5px' }}
                            />
                        </div>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default TagDetailsForm;
