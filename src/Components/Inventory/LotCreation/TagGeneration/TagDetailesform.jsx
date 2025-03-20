import React, { useState, useEffect, useRef } from 'react';
import {
    Form, Input, Select, Button, Checkbox, Row, Col, Card, Table, Tag, message, Pagination, Space, Typography
} from 'antd';
import axios from 'axios';
import TableHeaderStyles from '../../../Pages/TableHeaderStyles';
import ResetButton from "../TagGeneration/ResetFormTag";
import { CREATE_jwel } from "../../../../Config/Config";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const TagDetailsForm = ({ setStoneData, stoneData, focusProductName, updateTotals, feachTagno, tagInfo, lotno, mname, nwt, counter, prefix, manufacturer, counterRef, setWastageData, setSelectedProduct, setSelectedCategory,
    dealername, hsncode, productcategory,
    productname, productcode, gwt, bswt, aswt, pieces, selectedCategory, wastage,
    directwastage, cattotwast, makingcharges, directmc, cattotmc, setGwt, setBreadsLess,
    setTotalLess, setNwt, pcsRef, gwtRef, breadsLessRef, totalLessRef, nwtRef, setPcs }) => {
    const [counterOptions, setCounterOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [dealerOptions, setDealerOptions] = useState([]);
    console.log("stoneData", stoneData)

    const [purityOptions, setPurityOptions] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');

    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const purityRef = useRef(null);
    const manufacturerRef = useRef(null);
    const dealerRef = useRef(null);
    const huidRef = useRef(null);
    const sizeRef = useRef(null);

    const certificatenoRef = useRef(null);
    const descriptionRef = useRef(null);

    const labreportRef = useRef(null);
    const [selectedCounter, setSelectedCounter] = useState(""); // State for selected counter
    const [inputValue, setInputValue] = useState(""); // State for search input
    const [selectedPurity, setSelectedPurity] = useState(""); // State for selected purity
    const [purityInputValue, setPurityInputValue] = useState(""); // State for search input
    const [selectedManufacturer, setSelectedManufacturer] = useState(""); // State for selected manufacturer
    const [manufacturerInputValue, setManufacturerInputValue] = useState(""); // State for search input
    const [selectedDealer, setSelectedDealer] = useState(""); // State for selected dealer
    const [dealerInputValue, setDealerInputValue] = useState(""); // State for search input
    const tagStyle = {
        fontSize: "12px",
        padding: "6px 12px",
        borderRadius: "16px",
        fontWeight: "bold",
        color: "white",
    };

    useEffect(() => {
        fetchOptions();
        fetchTableData();

    }, [mname]);


    useEffect(() => {
        if (lotno) {
            feachTagno(lotno);
        }
    }, [lotno]);

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

        fetchData(`${CREATE_jwel}/api/Master/MasterCounterMasterList`, setCounterOptions);
        fetchData(`${CREATE_jwel}/api/Master/MasterManufacturerMasterList`, setManufacturerOptions);
        fetchData(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=DEALER_MASTER&where=CUSTTYPE%3D%27DEALER%27&order=DEALERNAME
`, setDealerOptions);

        if (mname) {
            fetchData(
                `${CREATE_jwel}/api/Master/MasterPrefixMasterList`,
                setPurityOptions,
                (item) => item.MAINPRODUCT === mname
            );
        }
    };

    const fetchTableData = async () => {
        try {
            const response = await axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=TAG_GENERATION&where=LOTNO%3D${lotno}&order=TAGNO`);
            setTableData(response.data);
            calculateTotals(response.data); // Call totals calculation
        } catch (error) {
            console.error('Failed to fetch table data', error);
        }
    };

    useEffect(() => {
        if (lotno) {
            fetchTableData();
        }
    }, [lotno]);

    const calculateTotals = (data) => {
        const totalGwt = data.reduce((sum, item) => sum + item.GWT, 0).toFixed(3);
        const totalNwt = data.reduce((sum, item) => sum + item.NWT, 0).toFixed(3);
        const totalPieces = data.reduce((sum, item) => sum + item.PIECES, 0);

        updateTotals(totalGwt, totalNwt, totalPieces); // Send totals to parent
    };

    useEffect(() => {
        calculateTotals(tableData);
    }, [tableData]);

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
    const stonePostFunction = async () => {
        if (!stoneData || stoneData.length === 0) {
            message.error('No stone data available to save');
            return;
        }

        try {
            const payload = stoneData.map((item) => ({
                mname: mname || "defaultMname",
                productcategory: productcategory || "defaultProductCategory",
                productcode: productcode || "defaultProductCode",
                productname: productname || "defaultProductName",
                tagno: parseInt(`${tagInfo.barcodePrefix}${tagInfo.maxTagNo}`, 10),
                sno: item.sno,
                itemname: item.stoneItem || "",
                pieces: parseInt(item.pcs, 10) || 0,
                grms: parseFloat(item.grams) || 0,
                cts: parseFloat(item.cts) || 0,
                rate: parseFloat(item.rate) || 0,
                nopcs: parseInt(item.noPcs, 10) || 0,
                amount: parseFloat(item.amount) || 0,
                colour: item.color || "defaultColor",
                cut: item.cut || "defaultCut",
                clarity: item.clarity || "defaultClarity",
                clouD_UPLOAD: true,
                itemcode: item.itemcode || "defaultItemCode",
                dprice: parseFloat(item.dprice) || 0,
                damt: parseFloat(item.damt) || 0,
                dname: item.dname || "defaultDname",
                vv: item.vv || "defaultVv",
                snO1: parseInt(item.snO1, 10) || 0,
            }));

            const response = await axios.post(`${CREATE_jwel}/api/Erp/TagItemMultiInsert`, payload);
            if (response.data === true) {
                message.success('Data saved successfully');
            } else {
                // message.error('Failed to save data');
            }
        } catch (error) {
            console.error('Failed to save data', error);
            // message.error('Failed to save data');
        }
    }
    const handleSave = async () => {
        stonePostFunction();
        try {
            const stonewt = parseFloat(gwt) - parseFloat(nwt); // Calculate stonewt as the difference between gwt and nwt
            console.log("stonewt", stonewt)
            const payload = {
                ...form.getFieldsValue(),
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
                tagno: `${tagInfo.barcodePrefix}` + `${tagInfo.maxTagNo}`,
                balpieces: 0,
                balweight: 0,
                tagdate: new Date().toISOString().split('T')[0], // Current date
                tagtime: new Date().toLocaleTimeString(), // Current time
                netamt: 0,
                tagsize: "Medium",
                iteM_TOTPIECES: localStorage.getItem('totalPcs') || 0,
                iteM_TOTGMS: localStorage.getItem('totalGrams') || 0,
                iteM_TOTCTS: localStorage.getItem('totalCts') || 0,
                iteM_TOTAMT: localStorage.getItem('totalAmount') || 0,
                iteM_TOTNOPCS: localStorage.getItem('totalNoPcs') || 0,
                recycle: "No",
                suspence: "No",
                tray: false,
                regenrate: "No",
                scheck: true,
                status: "no",
                userId: "admin123",
                appcategory: "-",
                appname: "-",
                appsalesman: "-",
                appinchrg: "-",
                appDate: new Date().toISOString().split('T')[0], // Current date
                apptime: new Date().toLocaleTimeString(), // Current time
                lesS_WPER: 0,
                imgpath: "/images/necklace.jpg",
                lesscts: 0,
                diapcs: 0,
                diacts: localStorage.getItem('totalDiamondCts') || 0, // Pass totalDiamondCts from localStorage
                item_diamonds: localStorage.getItem('totalDiamondCts') || 0,
                dealerApprovals: true,
                item_Cts: 0,
                item_Uncuts: 0,
                diamond_Amount: localStorage.getItem('totalDiaAmount') || 0,
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
                stonewt, // Pass the calculated stonewt
                rate: 0,
                finerate: 0,
                atagno: "-",
                cosT_CATEGORY: "-",
                tagGeneration: "true"
            };

            const response = await axios.post(`${CREATE_jwel}/api/Erp/TagGenerationInsert`, payload);
            if (response.status === 200) {
                message.success('Data saved successfully');
                if (focusProductName) {
                    focusProductName(); // Move cursor to Product Name in ProductDetails
                }
                setStoneData();
                fetchTableData(); // Refresh table data after save
                feachTagno(lotno); // Ensure feachTagno is called after successful save
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
                ]);
                // Reset localStorage
                localStorage.removeItem('totalPcs');
                localStorage.removeItem('totalGrams');
                localStorage.removeItem('totalCts');
                localStorage.removeItem('totalAmount');
                localStorage.removeItem('totalNoPcs');
                localStorage.removeItem('totalDiamondCts');
                localStorage.removeItem('totalDiaAmount');
                localStorage.removeItem('totalCTS');
                localStorage.removeItem('totalUncuts');
                localStorage.removeItem('finalTotalGrams');

                

                
            }
        } catch (error) {
            message.error('Failed to save data');
        }
    };

    const handleReset = () => {
        form.resetFields();
        setSelectedCounter("");
        setInputValue("");
        setSelectedPurity("");
        setPurityInputValue("");
        setSelectedManufacturer("");
        setManufacturerInputValue("");
        setSelectedDealer("");
        setDealerInputValue("");
        setGwt("");
        setBreadsLess("");
        setTotalLess("");
        setNwt("");
        setPcs("");
        setSelectedProduct("");
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
        ]);
        localStorage.removeItem('totalPcs');
        localStorage.removeItem('totalGrams');
        localStorage.removeItem('totalCts');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('totalNoPcs');
        localStorage.removeItem('totalDiamondCts');
        localStorage.removeItem('totalDiaAmount');
        localStorage.removeItem('totalCTS');
        localStorage.removeItem('totalUncuts');
        localStorage.removeItem('finalTotalGrams');
    };

    const filteredData = tableData.filter((item) =>
        item.PRODUCTNAME.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
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
    const totalPieces = tableData.reduce((sum, item) => sum + item.PIECES, 0);
    const handleCounterSelect = (value) => {
        setSelectedCounter(value);
        setInputValue(""); // Clear input after selection

        setTimeout(() => {
            if (purityRef.current) {
                purityRef.current.focus(); // Move to next input
            }
        }, 100);
    };

    // ✅ Properly handle typing + Enter to select an option
    const handleCounterKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission

            const typedValue = inputValue.trim();
            const matchedOption = counterOptions.find(
                (c) => c.COUNTERNAME.toLowerCase() === typedValue.toLowerCase()
            );

            if (matchedOption) {
                setSelectedCounter(matchedOption.COUNTERNAME);
                setInputValue(""); // Clear input for next search
            }

            setTimeout(() => {
                if (purityRef.current) {
                    purityRef.current.focus();
                }
            }, 100);
        }
    };

    const handlePuritySelect = (value) => {
        setSelectedPurity(value);
        setPurityInputValue(""); // Clear input after selection

        setTimeout(() => {
            if (manufacturerRef.current) {
                manufacturerRef.current.focus(); // Move focus to the next field
            }
        }, 100);
    };

    // ✅ Properly handle typing + Enter to select an option
    const handlePurityKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission

            const typedValue = purityInputValue.trim();
            const matchedOption = purityOptions.find(
                (p) => p.Prefix.toLowerCase() === typedValue.toLowerCase()
            );

            if (matchedOption) {
                setSelectedPurity(matchedOption.Prefix);
                setPurityInputValue(""); // Clear input for next search
            }

            setTimeout(() => {
                if (manufacturerRef.current) {
                    manufacturerRef.current.focus();
                }
            }, 100);
        }
    };
    const handleManufacturerSelect = (value) => {
        setSelectedManufacturer(value);
        setManufacturerInputValue(""); // Clear input after selection

        setTimeout(() => {
            if (dealerRef.current) {
                dealerRef.current.focus(); // Move focus to the next field
            }
        }, 100);
    };

    // ✅ Properly handle typing + Enter to select an option
    const handleManufacturerKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission

            const typedValue = manufacturerInputValue.trim();
            const matchedOption = manufacturerOptions.find(
                (m) => m.MANUFACTURER.toLowerCase() === typedValue.toLowerCase()
            );

            if (matchedOption) {
                setSelectedManufacturer(matchedOption.MANUFACTURER);
                setManufacturerInputValue(""); // Clear input for next search
            }

            setTimeout(() => {
                if (dealerRef.current) {
                    dealerRef.current.focus();
                }
            }, 100);
        }
    };
    const handleDealerChange = (value) => {
        setSelectedDealer(value);
        setDealerInputValue(""); // ✅ Clears input after selection
    };

    const handleDealerSelect = (value) => {
        setSelectedDealer(value);
        setDealerInputValue(""); // ✅ Clears input after selection

        setTimeout(() => {
            if (huidRef.current) {
                huidRef.current.focus(); // ✅ Moves focus to next field
            }
        }, 100);
    };

    const handleDealerKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // ✅ Prevents reopening dropdown

            const typedValue = dealerInputValue?.trim();
            if (!typedValue) return;

            const matchedOption = dealerOptions.find(
                (d) => d.Dealername?.toLowerCase() === typedValue.toLowerCase()
            );

            if (matchedOption) {
                setSelectedDealer(matchedOption.Dealername);
            } else {
                setSelectedDealer(typedValue); // ✅ Allows new entry if not in the list
            }

            setDealerInputValue(""); // ✅ Clears input after Enter

            setTimeout(() => {
                if (huidRef.current) {
                    huidRef.current.focus(); // ✅ Moves focus to next field
                }
            }, 100);
        }
    };

    return (
        <>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12}>
                    <div
                        style={{
                            width: "150px",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            textAlign: "center",
                            // backgroundColor:"#71769b",
                            padding: "5px",

                        }}
                        className="bgcolur"

                    >
                        <Text style={{ fontSize: "13px", color: "#fff" }}>
                            Others Detailes
                        </Text>
                    </div>
                    <Card bordered={false} style={{ marginTop: "5px", backgroundColor: "#d9d6d6" }}>
                        <Form layout="vertical" form={form} onFinish={handleSave}>
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Counter</label>
                                    <Form.Item name="counter" rules={[{ message: "Please select counter" }]}>
                                        <Select
                                            ref={counterRef}
                                            showSearch
                                            placeholder="Select a counter"
                                            value={selectedCounter || undefined} // ✅ Fix value binding
                                            onSelect={handleCounterSelect}
                                            onSearch={(value) => setInputValue(value)} // ✅ Keep track of typed value
                                            onKeyDown={handleCounterKeyDown}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            dropdownRender={menu => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                                            .ant-select-item-option-active {
                                              background-color: rgb(125, 248, 156) !important;
                                            }
                                          `}</style>
                                                </div>
                                            )}
                                        >
                                            {counterOptions.map((c, index) => (
                                                <Option key={index} value={c.COUNTERNAME}>
                                                    {c.COUNTERNAME}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Purity</label>
                                    <Form.Item name="prefix" rules={[{ message: "Please select purity" }]}>
                                        <Select
                                            ref={purityRef}
                                            showSearch
                                            placeholder="Select purity"
                                            value={selectedPurity || undefined} // ✅ Fix value binding
                                            onSelect={handlePuritySelect}
                                            onSearch={(value) => setPurityInputValue(value)} // ✅ Track typed value
                                            onKeyDown={handlePurityKeyDown}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            dropdownRender={menu => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                .ant-select-item-option-active {
                  background-color: rgb(125, 248, 156) !important;
                }
              `}</style>
                                                </div>
                                            )}
                                        >
                                            {purityOptions.map((p, index) => (
                                                <Option key={index} value={p.Prefix}>
                                                    {p.Prefix}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Manufacturer</label>
                                    <Form.Item name="manufacturer" rules={[{ message: "Please select manufacturer" }]}>
                                        <Select
                                            ref={manufacturerRef}
                                            showSearch
                                            placeholder="Select manufacturer"
                                            value={selectedManufacturer || undefined} // ✅ Fix value binding
                                            onSelect={handleManufacturerSelect}
                                            onSearch={(value) => setManufacturerInputValue(value)} // ✅ Track typed value
                                            onKeyDown={handleManufacturerKeyDown}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {manufacturerOptions.map((m, index) => (
                                                <Option key={index} value={m.MANUFACTURER}>
                                                    {m.MANUFACTURER}
                                                </Option>
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
                                            value={selectedDealer || dealerInputValue} // ✅ Ensures correct value display
                                            placeholder="Select dealer"
                                            onChange={handleDealerChange} // ✅ Updates selected value when changed
                                            onSelect={handleDealerSelect} // ✅ Handles item selection
                                            onSearch={(value) => setDealerInputValue(value)} // ✅ Captures user input
                                            onKeyDown={handleDealerKeyDown} // ✅ Handles Enter & Arrow navigation
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option?.children?.toLowerCase().includes(input?.toLowerCase())
                                            }
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
        .ant-select-item-option-active {
          background-color: rgb(125, 248, 156) !important;
        }
      `}</style>
                                                </div>
                                            )}
                                        >
                                            {dealerOptions.map((dealer, index) => (
                                                <Option key={index} value={dealer.Dealername}>
                                                    {dealer.Dealername}
                                                </Option>
                                            ))}
                                        </Select>

                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <label style={{ fontSize: "12px" }}>HUID</label>
                                    <Form.Item name="huid">
                                        <Input
                                            ref={huidRef}
                                            onKeyDown={(e) => handleKeyDown(e, sizeRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Size</label>
                                    <Form.Item name="size">
                                        <Input
                                            ref={sizeRef}
                                            onKeyDown={(e) => handleKeyDown(e, certificatenoRef)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 16]}>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Certificate No.</label>
                                    <Form.Item name="certificateNo">
                                        <Input
                                            ref={certificatenoRef}
                                            onKeyDown={(e) => handleKeyDown(e, descriptionRef)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <label style={{ fontSize: "12px" }}>Description</label>
                                    <Form.Item name="description">
                                        <TextArea
                                            ref={descriptionRef}
                                            rows={1} onKeyDown={(e) => handleKeyDown(e, labreportRef)} />
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
                    <div
                        style={{
                            width: "150px",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            textAlign: "center",
                            // backgroundColor:"#71769b",
                            padding: "5px",

                        }}
                        className="bgcolur"

                    >
                        <Text style={{ fontSize: "13px", color: "#fff" }}>
                            Cost
                        </Text>
                    </div>
                    <Card bordered={false} style={{ marginTop: "5px", backgroundColor: "#d9d6d6" }}>
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
                <Col xs={24} sm={4} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
    {/* Reset Button aligned to the right */}
    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <ResetButton onReset={handleReset} />
    </div>

    <Card bordered={false} style={{
        marginTop: "36px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: "0px 4px 12px rgba(189, 187, 187, 0.91)",
    }}>
        <Form onFinish={handleSave}>

            <Row gutter={[8, 16]} style={{ width: '100%' }}>
                <Col xs={24} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ fontSize: "16px", marginBottom: "10px", fontWeight: "bold" }}>Tag No</div>
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            textAlign: "center",
                            borderRadius: "8px",
                            fontSize: "24px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "blue"
                        }}
                    >
                        {tagInfo.barcodePrefix}{tagInfo.maxTagNo !== null ? tagInfo.maxTagNo : "-"}
                    </div>
                </Col>
            </Row>

            <Row gutter={[8, 16]} justify="center">
                <Col>
                    <Form.Item>
                        <Button style={{
                            backgroundColor: "#0d094e",
                            borderColor: "#4A90E2",
                            width: '120px',
                        }} type="primary" htmlType="submit" size="large">
                            Save
                        </Button>
                    </Form.Item>
                </Col>
            </Row>

        </Form>
    </Card>
</Col>

            </Row>
            <Row justify="space-between" align="middle" style={{ marginBottom: '10px', marginTop: "12px" }}>

                <Col>
                    <Space size="small">
                        <strong>Total:  </strong>
                        <Tag color="#555E9F" style={tagStyle}>Gross.Wt: {totalGwt}</Tag>
                        <Tag color="#555E9F" style={tagStyle}>Net.Wt: {totalNwt}</Tag>
                        <Tag color="#555E9F" style={tagStyle}>Pieces: {totalPieces}</Tag>
                    </Space>
                </Col>

                {/* Middle Section: Search Bar */}
                <Col>
                    <Input
                        placeholder="Search Product"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "200px", borderRadius: "8px" }}
                    />
                </Col>

                {/* Right Section: Pagination */}
                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <div style={{ overflowX: 'auto' }}>
                        <TableHeaderStyles>
                            <Table
                                dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                columns={columns}
                                size="small"
                                rowClassName="table-row"
                                pagination={false}
                            />
                        </TableHeaderStyles>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default TagDetailsForm;
