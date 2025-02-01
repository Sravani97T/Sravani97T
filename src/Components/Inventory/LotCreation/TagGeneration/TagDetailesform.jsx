import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Checkbox, Row, Col, Card, Table, Tag, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const TagDetailsForm = ({ mname, counter, prefix, manufacturer }) => {
    const [counterOptions, setCounterOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [dealerOptions, setDealerOptions] = useState([]);
    const [purityOptions, setPurityOptions] = useState([]);
    const [tableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    console.log("Prefix",prefix);
    console.log("counter",counter);


    const baseURL = "http://www.jewelerp.timeserasoftware.in/api/";

    useEffect(() => {
        fetchOptions();
    }, [mname]); // Refetch purity options when mname changes

    useEffect(() => {
        form.setFieldsValue({
            counter: counter || "",
            prefix: prefix || "",
            manufacturer: manufacturer || "",
        });
    }, [counter, prefix, manufacturer]);

    const fetchOptions = async () => {
        const fetchData = async (url, setState, filterFn = null) => {
            try {
                const response = await axios.get(url);
                const data = filterFn ? response.data.filter(filterFn) : response.data;
                setState(data);
            } catch (error) {
                message.error(`Failed to fetch data from ${url}`);
            }
        };

        fetchData(`${baseURL}Master/MasterCounterMasterList`, setCounterOptions);
        fetchData(`${baseURL}Master/MasterManufacturerMasterList`, setManufacturerOptions);
        fetchData(`${baseURL}Master/MasterDealerMasterList`, setDealerOptions);

        // Only fetch purity options if mname is available
        if (mname) {
            fetchData(
                `${baseURL}Master/MasterPrefixMasterList`,
                setPurityOptions,
                (item) => item.MAINPRODUCT === mname
            );
        }
    };

    const onFinish = (values) => {
        console.log('Form Values:', values);
    };

    const filteredData = tableData.filter((item) =>
        item.productName.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Purity',
            dataIndex: 'prefix',
            key: 'prefix',
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

    const totalGwt = tableData.reduce((sum, item) => sum + item.gwt, 0);
    const totalNwt = tableData.reduce((sum, item) => sum + item.nwt, 0);
    const totalLessWeight = tableData.reduce((sum, item) => sum + item.lessWeight, 0);

    return (
        <>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Counter</label>
                                    <Form.Item name="counter" rules={[{ message: 'Please select counter' }]}>
                                        <Select>
                                            {counterOptions.map((c, index) => (
                                                <Option key={index} value={c.COUNTERNAME}>{c.COUNTERNAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Purity</label>
                                    <Form.Item name="prefix" rules={[{ message: 'Please select purity' }]}>
                                        <Select>
                                            {purityOptions.map((p, index) => (
                                                <Option key={index} value={p.Prefix}>{p.Prefix}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Manufacturer</label>
                                    <Form.Item name="manufacturer" rules={[{ message: 'Please select manufacturer' }]}>
                                        <Select>
                                            {manufacturerOptions.map((m, index) => (
                                                <Option key={index} value={m.MANUFACTURER}>{m.MANUFACTURER}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Dealer Name</label>
                                    <Form.Item name="dealerName">
                                        <Select>
                                            {dealerOptions.map((dealer, index) => (
                                                <Option key={index} value={dealer.DEALERNAME}>{dealer.DEALERNAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>HUID</label>
                                    <Form.Item name="huid">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Size</label>
                                    <Form.Item name="size">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
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
                                            <span style={{ fontSize: "10px" }}>Lab Report</span>
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
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
                <Col xs={24} sm={4}>
                    <Card bordered={false} style={{ marginTop: "5px", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Form onFinish={onFinish}>
                            <Row gutter={[8, 16]} style={{ width: '100%' }}>
                                <Col xs={24} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ fontSize: "12px", marginBottom: "8px", fontWeight: "bold" }}>Tag No</div>
                                    <Input
                                        size="small"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            textAlign: "center",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                            margin: "0 auto",
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
            <Row justify="space-between" align="middle" style={{ marginBottom: '10px', marginTop: "5px" }}>
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
