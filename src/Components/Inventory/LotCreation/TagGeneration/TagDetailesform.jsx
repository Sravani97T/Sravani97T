import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Checkbox, Row, Col, Card, Table, Tag, message } from 'antd';
import axios from 'axios';
import TableHeaderStyles from '../../../Pages/TableHeaderStyles';

const { Option } = Select;
const { TextArea } = Input;

const TagDetailsForm = ({ lotno, mname, nwt, counter, prefix, manufacturer, counterRef,setWastageData,setSelectedProduct,setSelectedCategory,
    dealername, hsncode, productcategory,
    productname, productcode, gwt, bswt, aswt, pieces, selectedCategory, wastage,
    directwastage, cattotwast, makingcharges, directmc, cattotmc, setGwt, setBreadsLess,
    setTotalLess, setNwt, pcsRef, gwtRef, breadsLessRef, totalLessRef, nwtRef, setPcs }) => {
    const [counterOptions, setCounterOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [dealerOptions, setDealerOptions] = useState([]);
    const [purityOptions, setPurityOptions] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const purityRef = useRef(null);
    const manufacturerRef = useRef(null);
    const dealerRef = useRef(null);
    const huidRef = useRef(null);

    const sizeRef = useRef(null);

    const certificatenoRef = useRef(null);
    const descriptionRef = useRef(null);

    const labreportRef = useRef(null);

    const baseURL = "http://www.jewelerp.timeserasoftware.in/api/";

    useEffect(() => {
        fetchOptions();
        fetchTableData();
    }, [mname]);

    useEffect(() => {
        form.setFieldsValue({
            counter: counter || "",
            prefix: prefix || "",
            manufacturer: manufacturer || "",
            productcategory: productcategory || "",
        });
    }, [counter, prefix, manufacturer, productcategory]);

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

        if (mname) {
            fetchData(
                `${baseURL}Master/MasterPrefixMasterList`,
                setPurityOptions,
                (item) => item.MAINPRODUCT === mname
            );
        }
    };

    const fetchTableData = async () => {
        try {
            const response = await axios.get(`${baseURL}Erp/GetTagGenerationDetailsList`);
            setTableData(response.data);
        } catch (error) {
            message.error('Failed to fetch table data');
        }
    };

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        } else if (e.key === "ArrowLeft" && prevRef && prevRef.current) {
            prevRef.current.focus();
        }
    };

    const handleSave = async () => {
        try {
            const aswtValue = form.getFieldValue('aswt') || 0;
            const bswtValue = form.getFieldValue('bswt') || 0;
            const stonewt = aswtValue + bswtValue;
            const payload = {
                ...form.getFieldsValue(), // Get all form values
                lotno,
                mname,
                dealername,
                productcategory,
                productname,
                productcode,
                gwt,
                bswt,
                aswt,
                pieces,
                selectedCategory,
                wastage: wastage.toString(),
                directwastage,
                cattotwast,
                makingcharges,
                directmc,
                cattotmc,
                DESC1: form.getFieldValue('description') || '',
                hsncode,
                COUNTERNAME: form.getFieldValue('counter') || '',
                CATEGORYNAME: selectedCategory || '',
                PRODUCTCATEGORY: productcategory || '',
                brandname: "-",
                brandamt: 0,
                brandcalc: "0",
                brandcalcamt: 0,
                nwt,
                tagno: 11,
                balpieces: 0,
                balweight: 0,
                tagdate: "2025-02-05",
                tagtime: "14:30",
                netamt: 0,
                tagsize: "Medium",
                iteM_TOTPIECES: 0,
                iteM_TOTGMS: 0,
                iteM_TOTCTS: 0,
                iteM_TOTAMT: 0,
                iteM_TOTNOPCS: 0,
                recycle: "No",
                suspence: "No",
                tray: true,
                regenrate: "No",
                scheck: true,
                status: "no",
                userId: "admin123",
                appcategory: "-",
                appname: "-",
                appsalesman: "-",
                appinchrg: "-",
                appDate: "2025-02-05",
                apptime: "15:00",
                lesS_WPER: 0,
                imgpath: "/images/necklace.jpg",
                lesscts: 0,
                diapcs: 0,
                diacts: 0,
                dealerApprovals: true,
                item_Cts: 0,
                item_diamonds: 0,
                item_Uncuts: 0,
                diamond_Amount: 0,
                cosT_GWT: 0,
                cosT_LESS: 0,
                cosT_NWT: 0,
                cosT_TOUCH: 0,
                cosT_WASTAGE: 0,
                cosT_FTOUCH: 0,
                cosT_MC: 0,
                cosT_STAMT: 0,
                purE_RATE: 0,
                colorstoneS_AMOUNT: 0,
                uncutS_AMOUNT: 0,
                orgcategory: "-",
                clouD_UPLOAD: true,
                cosT_MCPER: 0,
                itemcost: 0,
                vv: "-",
                stonewt,
                rate: 0,
                finerate: 0,
                atagno: "-",
                cosT_CATEGORY: "-",
                tagGeneration: "true"
            };
    
            const response = await axios.post(`${baseURL}Erp/TagGenerationInsert`, payload);
            if (response) {
                message.success('Data saved successfully');
                fetchTableData(); // Refresh table data after save
                const currentValues = form.getFieldsValue(['counter', 'prefix', 'manufacturer']);
                form.resetFields(); // Reset form fields
                form.setFieldsValue(currentValues); // Restore counter, prefix, and manufacturer fields
                setGwt();
                setBreadsLess();
                setTotalLess();
                setNwt();
                pcsRef.current = null;
                gwtRef.current = null;
                breadsLessRef.current = null;
                totalLessRef.current = null;
                nwtRef.current = null;
                setPcs();
                dealerRef.current = null;
                huidRef.current = null;
                sizeRef.current = null;
                certificatenoRef.current = null;
                descriptionRef.current = null;
                labreportRef.current = null;
                setSelectedProduct();
                setSelectedCategory(null);
                setWastageData([
                    {
                        key: "1",
                        percentage: "",
                        direct: "",
                        total: "",
                        perGram: "",
                        newField1: "",
                        newField2: "",
                    },
                ]);            }
        } catch (error) {
            message.error('Failed to save data');
        }
    };
    
    
    const filteredData = tableData.filter((item) =>
        item.PRODUCTNAME.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            render: (text, record, index) => index + 1,
            align: "center",
            className: 'blue-background-column',
            width: 50,
        },
        {
            title: 'Product Name',
            dataIndex: 'PRODUCTNAME',
            key: 'PRODUCTNAME',
        },
        {
            title: 'Purity',
            dataIndex: 'PREFIX',
            key: 'PREFIX',
            align: "center"
        },
        {
            title: 'Pieces',
            dataIndex: 'PIECES',
            key: 'PIECES',
            align: "center"
        },
        {
            title: 'Gross.Wt',
            dataIndex: 'GWT',
            key: 'GWT',
            align: "right",
            render: (text) => Number(text).toFixed(3)
        },
        {
            title: 'Net.Wt',
            dataIndex: 'NWT',
            key: 'NWT',
            align: "right",
            render: (text) => Number(text).toFixed(3)
        },
        {
            title: 'Dealer Name',
            dataIndex: 'DEALERNAME',
            key: 'DEALERNAME',
            align: "center"
        },
        {
            title: 'Tag No',
            dataIndex: 'TAGNO',
            key: 'TAGNO',
            align: "center"
        },
        {
            title: 'Counter',
            dataIndex: 'COUNTERNAME',
            key: 'COUNTERNAME',
            align: "center"
        },
    ];
    const totalGwt = tableData.reduce((sum, item) => sum + item.GWT, 0).toFixed(3);
    const totalNwt = tableData.reduce((sum, item) => sum + item.NWT, 0).toFixed(3);

    return (
        <>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ marginTop: "5px" }}>
                        <Form layout="vertical" form={form} onFinish={handleSave}>
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Counter</label>
                                    <Form.Item name="counter" rules={[{ message: 'Please select counter' }]}>
                                        <Select
                                            ref={counterRef}
                                            showSearch
                                            placeholder="Select a counter"
                                            onKeyDown={(e) => handleKeyDown(e, purityRef, null)}
                                        >
                                            {counterOptions.map((c, index) => (
                                                <Option key={index} value={c.COUNTERNAME}>{c.COUNTERNAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Purity</label>
                                    <Form.Item name="prefix" rules={[{ message: 'Please select purity' }]}>
                                        <Select
                                            ref={purityRef}
                                            showSearch
                                            placeholder="Select purity"
                                            onKeyDown={(e) => handleKeyDown(e, manufacturerRef, counterRef)}
                                        >
                                            {purityOptions.map((p, index) => (
                                                <Option key={index} value={p.Prefix}>{p.Prefix}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Manufacturer</label>
                                    <Form.Item name="manufacturer" rules={[{ message: 'Please select manufacturer' }]}>
                                        <Select
                                            ref={manufacturerRef}
                                            showSearch
                                            placeholder="Select manufacturer"
                                            onKeyDown={(e) => handleKeyDown(e, dealerRef, purityRef)}
                                        >
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
                                        <Select
                                            ref={dealerRef}
                                            showSearch
                                            placeholder="Select dealer"
                                            onKeyDown={(e) => handleKeyDown(e, null, manufacturerRef)}
                                        >
                                            {dealerOptions.map((dealer, index) => (
                                                <Option key={index} value={dealer.DEALERNAME}>{dealer.DEALERNAME}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>HUID</label>
                                    <Form.Item name="huid">
                                        <Input
                                            ref={huidRef}
                                            onKeyDown={(e) => handleKeyDown(e, counterRef, sizeRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Size</label>
                                    <Form.Item name="size">
                                        <Input
                                            ref={sizeRef}
                                            onKeyDown={(e) => handleKeyDown(e, counterRef, certificatenoRef)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Certificate No.</label>
                                    <Form.Item name="certificateNo">
                                        <Input
                                            ref={certificatenoRef}
                                            onKeyDown={(e) => handleKeyDown(e, counterRef, descriptionRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Description</label>
                                    <Form.Item name="description">
                                        <TextArea
                                            ref={descriptionRef}
                                            rows={1} onKeyDown={(e) => handleKeyDown(e, counterRef, labreportRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="labreport" valuePropName="checked" style={{ marginTop: "30px" }}>
                                        <Checkbox ref={labreportRef}
                                        >
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
                        <Form layout="vertical" form={form} onFinish={handleSave}>
                            <Row gutter={[8, 16]}>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>GWT</label>
                                    <Form.Item name="gwt">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>LES</label>
                                    <Form.Item name="les">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>NWT</label>
                                    <Form.Item name="nwt">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>Cost</label>
                                    <Form.Item name="cost">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>MC/G</label>
                                    <Form.Item name="mcg">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={8}>
                                    <label style={{ fontSize: "12px" }}>MC/Amount</label>
                                    <Form.Item name="mcAmount">
                                        <Input size="small" onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} sm={4}>
                    <Card bordered={false} style={{ marginTop: "5px", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Form onFinish={handleSave}>
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
                                        onKeyDown={(e) => handleKeyDown(e, counterRef, dealerRef)}
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
                        <strong>Total: </strong><Tag color="cyan-inverse"> GWT: {totalGwt}</Tag><Tag color="lime-inverse"> NWT: {totalNwt}</Tag>
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
                        <TableHeaderStyles>

                            <Table
                                dataSource={filteredData}
                                columns={columns}
                                size="small"
                                rowClassName="table-row"
                                pagination={{
                                    pageSize: 5,
                                    responsive: true,
                                }}
                            />
                        </TableHeaderStyles>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default TagDetailsForm;
