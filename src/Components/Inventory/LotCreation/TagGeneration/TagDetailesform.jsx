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
            title: 'Gross.Wt',
            dataIndex: 'gwt',
            key: 'gwt',
            align: "center"

        },
        {
            title: 'Less Wt',
            dataIndex: 'lessWeight',
            key: 'lessWeight',
            align: "center"

        },
        {
            title: 'Net.Wt',
            dataIndex: 'nwt',
            key: 'nwt',
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
        <>

            <Row gutter={[16, 16]} justify="center">
                {/* Card 1 */}
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" onFinish={onFinish}>
                            {/* Purity and Manufacturer Row */}
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>  {/* Reduced the width of Purity column */}
                                    <label style={{ fontSize: "12px" }}>Counter</label>
                                    <Form.Item
                                        name="purity"

                                        rules={[{ message: 'Please select purity' }]}>
                                        <Select >
                                            <Option value="22k">22k</Option>
                                            <Option value="18k">18k</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>  {/* Reduced the width of Purity column */}
                                    <label style={{ fontSize: "12px" }}>Purity</label>

                                    <Form.Item
                                        name="purity"
                                        rules={[{ message: 'Please select purity' }]}>
                                        <Select >
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>  {/* Adjusted width for Manufacturer */}
                                    <label style={{ fontSize: "12px" }}>Manufacturer</label>

                                    <Form.Item
                                        name="manufacturer"
                                        rules={[{ message: 'Please select manufacturer' }]}>
                                        <Select >
                                            <Option value="manufacturer1">Manufacturer 1</Option>
                                            <Option value="manufacturer2">Manufacturer 2</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>


                            </Row>

                            {/* Certificate No., HUID and Dealer Name Row */}
                            <Row gutter={[8, 16]}>
                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Dealer Name</label>

                                    <Form.Item name="dealerName">
                                        <Select >
                                            <Option value="dealer1">Dealer 1</Option>
                                            <Option value="dealer2">Dealer 2</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>HUID</label>

                                    <Form.Item name="huid">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>  {/* Reduced the width of Size column */}
                                    <label style={{ fontSize: "12px" }}>Size</label>

                                    <Form.Item name="size">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Description Row */}
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Certificate No.</label>

                                    <Form.Item name="certificateNo">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Description</label>

                                    <Form.Item name="description">
                                        <TextArea rows={1} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>

                                    <Form.Item style={{ marginTop: "30px" }}>
                                        <Checkbox>
                                            <span style={{  fontSize: "10px" }}>Lab Report</span>
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
                                    <label style={{ fontSize: "12px" }}>GWT</label>

                                    <Form.Item name="gwt">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>LES</label>

                                    <Form.Item name="les">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>NWT</label>

                                    <Form.Item name="nwt">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>Cost</label>

                                    <Form.Item name="cost">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>MC/G</label>

                                    <Form.Item name="mcg">
                                        <Input size="small" />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>MC/Amount</label>

                                    <Form.Item name="mcAmount">
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

            <Row justify="space-between" align="middle" style={{ marginBottom: '10px',marginTop:"5px" }}>
                <Col>
                    <div>
                        <strong>Total: </strong><Tag color="cyan-inverse"> GWT: {totalGwt}</Tag><Tag color="lime-inverse"> NWT: {totalNwt}</Tag><Tag color="volcano-inverse"> Less Wt: {totalLessWeight}</Tag>
                    </div>
                </Col>
                <Col>
                    <Input
                        placeholder="Search Product"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
            </Row>
            {/* Table */}
            <Row gutter={[16, 16]}>

                <Col xs={24}>
                    <div style={{ overflowX: 'auto' }}>
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            size="small"
                            pagination={{
                                pageSize: 5,
                                responsive: true,
                            }}
                        />
                    </div>
                </Col>
            </Row>

        </>

    );
};

export default TagDetailsForm;
