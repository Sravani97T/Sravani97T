import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select } from "antd";
import StoneDetails from "../TagGeneration/StoneDetailes";
import axios from 'axios';
import TagDetailsForm from "./TagDetailesform";
import OrderItem from "./OrderItem";
import ResetButton from "../TagGeneration/ResetFormTag"
const { Text } = Typography;
const { Option } = Select;

const WastageDetails = ({ focusProductName, updateTotals, feachTagno, tagInfo, categoryRef, nwt, mname, setGwt, setBreadsLess, setTotalLess, nwtRef, setSelectedProduct, setPcs, setNwt, pcsRef, gwtRef, breadsLessRef, totalLessRef, counter, prefix, manufacturer, dealername, lotno, productcategory, hsncode, productname, productcode, gwt, bswt, aswt, pieces }) => {
    const [wastageData, setWastageData] = useState([
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
    const [stoneData, setStoneData] = useState([]);
    console.log("stonecount", stoneData);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [, setIsEditable] = useState(false);

    const directRef = useRef(null);
    const direct1Ref = useRef(null);

    const totalRef = useRef(null);
    const total1Ref = useRef(null);

    const perGramRef = useRef(null);
    const percentageRef = useRef(null);
    const counterRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterList");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent any unintended behavior
            if (nextRef) {
                nextRef.current.focus();
            }
        } else if (e.key === 'ArrowLeft' && prevRef) {
            prevRef.current.focus();
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory("");
        setTimeout(() => {
            setSelectedCategory(value);
        }, 0); // Small delay to ensure state update

        setIsEditable(value === "OTHERS");

        if (value === "OTHERS") {
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
        } else {
            const selectedOption = categories.find((item) => item.categoryname === value);
            if (selectedOption) {
                setWastageData([
                    {
                        key: "1",
                        percentage: selectedOption.wastage,
                        direct: selectedOption.directwastage.toFixed(3),
                        total: parseFloat(selectedOption.directwastage) > 0
                            ? selectedOption.directwastage.toFixed(3)
                            : ((selectedOption.wastage * nwt) / 100 + selectedOption.directwastage).toFixed(3),
                        perGram: selectedOption.makingcharges.toFixed(2),
                        newField1: selectedOption.directmc.toFixed(2),
                        newField2: (selectedOption.makingcharges * nwt).toFixed(2),
                    },
                ]);
            }
        }
    };


    const handleCategorySelect = (value) => {
        setSelectedCategory("");  // Reset first
        setTimeout(() => {
            setSelectedCategory(value);
            const selectedOption = categories.find(item => item.categoryname === value);
            if (selectedOption) {
                setWastageData(wastageData.map(item => ({
                    ...item,
                    percentage: selectedOption.wastage,
                    direct: selectedOption.directwastage.toFixed(3),
                    total: parseFloat(selectedOption.directwastage) > 0
                        ? selectedOption.directwastage.toFixed(3)
                        : ((selectedOption.wastage * nwt) / 100 + selectedOption.directwastage).toFixed(3),
                    perGram: selectedOption.makingcharges.toFixed(2),
                    newField1: selectedOption.directmc.toFixed(2),
                    newField2: (selectedOption.makingcharges * nwt).toFixed(2),
                })));
            }
        }, 0); // Ensures state updates correctly
    };

    const handleCategoryKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent dropdown from reopening

            setTimeout(() => {
                const selectedOption = categories.find(item => item.categoryname === selectedCategory);
                if (selectedOption && selectedOption.categoryname !== "OTHERS") {
                    if (counterRef.current) {
                        counterRef.current.focus();
                    }
                }
            }, 100);
        }
    };

    const handleReset = () => {
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
        setStoneData([]);
        setSelectedCategory(null);
        setIsEditable(false);
    };

    useEffect(() => {
        if (selectedCategory === "OTHERS" && percentageRef.current) {
            percentageRef.current.focus();
        }
    }, [selectedCategory]);

    return (
        <>
            <div>
                {/* Wastage Section */}
                <Row gutter={16}>
                    {/* First Column: Wastage & Making */}
                    <Col xs={24} sm={4} style={{ marginTop: "33px" }}>
                        <div
                            style={{
                                borderRadius: "10px",
                                padding: "10px",
                                backgroundColor: "#d9d6d6",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr",
                                    gap: "10px",
                                    textAlign: "center",
                                }}
                            >
                                <Text style={{ textAlign: "center", fontSize: "12px" }}>
                                    Category
                                </Text>
                                <Select
                                    showSearch
                                    ref={categoryRef}
                                    value={selectedCategory}
                                    placeholder="%"
                                    onChange={handleCategoryChange}
                                    onSelect={handleCategorySelect}
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                        marginTop: "4px",
                                    }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onKeyDown={handleCategoryKeyDown} // Attach keydown event
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
                                    {categories.map((category) => (
                                        <Option key={category.categoryname} value={category.categoryname}>
                                            {category.categoryname}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
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
                                justifyContent: "center",
                                // backgroundColor:"#71769b",
                                padding: "5px",
                            }}
                            className="bgcolur"

                        >
                            <Text style={{ fontSize: "13px", color: "#fff" }}>
                                Wastage
                            </Text>
                        </div>
                        <div
                            style={{
                                borderRadius: "10px",
                                padding: "10px",
                                backgroundColor: "#d9d6d6",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "10px",
                                    textAlign: "center",
                                }}
                            >
                                {["%", "Direct", "Total"].map((header) => (
                                    <Text key={header} style={{ textAlign: "center", fontSize: "12px" }}>
                                        {header}
                                    </Text>
                                ))}
                                {wastageData?.map((item) => (
                                    <React.Fragment key={item.key}>
                                        {selectedCategory === "OTHERS" ? (
                                            <Input
                                                ref={percentageRef}
                                                value={wastageData[0]?.percentage || ""}
                                                placeholder="%"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{
                                                        ...wastageData[0],
                                                        percentage: value,
                                                        direct: "", // Clear direct field when % is entered
                                                        total: parseFloat(wastageData[0].direct || 0) > 0
                                                            ? parseFloat(wastageData[0].direct).toFixed(3)
                                                            : value
                                                                ? ((parseFloat(value) * nwt) / 100).toFixed(3)
                                                                : ""
                                                    }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, directRef, null)}
                                            />
                                        ) : (
                                            <Input
                                                value={wastageData[0].percentage || ""}
                                                placeholder="%"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                readOnly
                                            />
                                        )}

                                        {selectedCategory === "OTHERS" ? (
                                            <Input
                                                ref={directRef}
                                                value={wastageData[0].direct || ""}
                                                placeholder="Direct"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{
                                                        ...wastageData[0],
                                                        direct: value,
                                                        percentage: "", // Clear percentage field when direct is entered
                                                        total: parseFloat(value) > 0
                                                            ? parseFloat(value).toFixed(3)
                                                            : wastageData[0].percentage
                                                                ? ((parseFloat(wastageData[0].percentage) * nwt) / 100).toFixed(3)
                                                                : ""
                                                    }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, perGramRef, percentageRef)}
                                            // Select the entire value on focus
                                            />
                                        ) : (
                                            <Input
                                                value={wastageData[0].direct || ""}
                                                placeholder="Direct"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                readOnly
                                            />
                                        )}

                                        <Input
                                            ref={totalRef}
                                            value={parseFloat(wastageData[0].direct) > 0 ? wastageData[0].direct : wastageData[0].total || ""}
                                            placeholder="Total"
                                            style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                            readOnly
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
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
                                padding: "5px",

                            }}
                            className="bgcolur"

                        >
                            <Text style={{ fontSize: "13px", color: "#fff" }}>
                                Making Charges
                            </Text>
                        </div>
                        <div
                            style={{
                                borderRadius: "10px",
                                padding: "10px",
                                backgroundColor: "#d9d6d6",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "10px",
                                    textAlign: "center",
                                }}
                            >
                                {["Gram", "Direct", "Total"].map((header) => (
                                    <Text key={header} style={{ textAlign: "center", fontSize: "12px" }}>
                                        {header}
                                    </Text>
                                ))}
                                {wastageData.map((item) => (
                                    <React.Fragment key={item.key}>
                                        {selectedCategory === "OTHERS" ? (
                                            <Input
                                                ref={perGramRef}
                                                value={wastageData[0].perGram || ""}
                                                placeholder="Per Gram"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{
                                                        ...wastageData[0],
                                                        perGram: value,
                                                        newField1: "", // Clear direct field when per gram is entered
                                                        newField2: (parseFloat(value) * nwt).toFixed(2)
                                                    }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, direct1Ref, null)}
                                                onFocus={(e) => e.target.select()} // Select the entire value on focus
                                            />
                                        ) : (
                                            <Input
                                                value={wastageData[0].perGram || ""}
                                                placeholder="Per Gram"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                readOnly
                                            />
                                        )}

                                        {selectedCategory === "OTHERS" ? (
                                            <Input
                                                ref={direct1Ref}
                                                value={wastageData[0].newField1 || ""}
                                                placeholder="Direct"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{
                                                        ...wastageData[0],
                                                        newField1: value,
                                                        perGram: "", // Clear per gram field when direct is entered
                                                        newField2: (parseFloat(wastageData[0].perGram) * nwt).toFixed(2)
                                                    }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, counterRef, perGramRef)}
                                            // Select the entire value on focus
                                            />
                                        ) : (
                                            <Input
                                                value={wastageData[0].newField1 || ""}
                                                placeholder="Direct"
                                                style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                                readOnly
                                            />
                                        )}

                                        <Input
                                            ref={total1Ref}
                                            value={parseFloat(wastageData[0].newField1) > 0 ? wastageData[0].newField1 : ((parseFloat(wastageData[0].total) + nwt) * parseFloat(wastageData[0].perGram)).toFixed(2) || ""}
                                            placeholder="Total"
                                            style={{ width: "100%", borderRadius: "8px", textAlign: "right" }}
                                            readOnly
                                        />
                                      
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={4} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <ResetButton onReset={handleReset} />
                        <div
                            style={{
                                borderRadius: "10px",
                                marginBottom: "5px",
                                padding: "7px",
                                backgroundColor: "#b9bbcf",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                width: "100%"
                            }}
                        >
                            <StoneDetails
                                lotno={lotno}
                                productname={productname}
                                gwt={gwt}
                                pieces={pieces}
                                stoneData={stoneData}
                                setStoneData={setStoneData}
                            />
                        </div>
                        <div
                            style={{
                                borderRadius: "10px",
                                padding: "7px",
                                backgroundColor: "#b9bbcf",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                width: "100%"
                            }}
                        >
                            <OrderItem
                                lotno={lotno}
                                productname={productname}
                                gwt={gwt}
                                pieces={pieces}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            <TagDetailsForm
                stoneData={stoneData}
                setStoneData={setStoneData}
                focusProductName={focusProductName}
                updateTotals={updateTotals}
                feachTagno={feachTagno}
                tagInfo={tagInfo}
                setGwt={setGwt}
                setBreadsLess={setBreadsLess}
                setTotalLess={setTotalLess}
                setNwt={setNwt}
                pcsRef={pcsRef}
                gwtRef={gwtRef}
                breadsLessRef={breadsLessRef}
                totalLessRef={totalLessRef}
                nwtRef={nwtRef}
                setPcs={setPcs}
                setSelectedProduct={setSelectedProduct}
                setWastageData={setWastageData}
                setSelectedCategory={setSelectedCategory}
                counterRef={counterRef}
                mname={mname}
                counter={counter}
                prefix={prefix}
                lotno={lotno}
                manufacturer={manufacturer}
                dealername={dealername}
                productcategory={productcategory}
                hsncode={hsncode}
                productname={productname}
                productcode={productcode}
                gwt={gwt}
                bswt={bswt}
                nwt={nwt}
                aswt={aswt}
                pieces={pieces} // Pass pieces to TagDetailsForm
                selectedCategory={selectedCategory} // Pass selectedCategory to TagDetailsForm
                wastage={wastageData[0].percentage} // Pass percentage as wastage
                directwastage={wastageData[0].direct} // Pass direct as directwastage
                cattotwast={wastageData[0].total} // Pass total as cattotwast
                makingcharges={wastageData[0].perGram} // Pass perGram as makingcharges
                directmc={wastageData[0].newField1} // Pass newField1 as directmc
                cattotmc={wastageData[0].newField2} // Pass newField2 as cattotmc
            />
        </>
    );
};

export default WastageDetails;
