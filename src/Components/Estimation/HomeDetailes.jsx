// import React, { useState, useEffect, useRef } from "react";
// import { Row, Col, Typography, Input, Select, message, Card, Table, Button, Tag, Badge } from "antd";
// import axios from "axios";
// import { ReloadOutlined , CloseOutlined, EditOutlined } from "@ant-design/icons";

// const { Option } = Select;
// const { Text, Title } = Typography;

// const ProductDetailsModal = () => {
//     const [products, setProducts] = useState([]);
//     const [mainProductOptions, setMainProductOptions] = useState([]);
//     const [selectedMainProduct, setSelectedMainProduct] = useState("");
//     const [selectedProduct, setSelectedProduct] = useState("");
//     const [pcs, setPcs] = useState(1);
//     const [gwt, setGwt] = useState(0);
//     const [breadsLess, setBreadsLess] = useState(0);
//     const [totalLess, setTotalLess] = useState(parseFloat(localStorage.getItem("finalTotalGrams")) || 0);
//     const [nwt, setNwt] = useState(0);
//     const pcsRef = useRef(null);
//     const pcssRef = useRef(null);
//     const gwtRef = useRef(null);
//     const breadsLessRef = useRef(null);
//     const totalLessRef = useRef(null);
//     const nwtRef = useRef(null);
//     const productNameRef = useRef(null);
//     const mainProductRef = useRef(null);
//     const categoryRef = useRef(null);
//     const [wastageData, setWastageData] = useState([
//         {
//             key: "1",
//             percentage: "",
//             direct: "",
//             total: "",
//             perGram: "",
//             newField1: "",
//             newField2: "",
//         },
//     ]);
//     const [stoneData, setStoneData] = useState([]);
//     const [stoneItems, setStoneItems] = useState([]);
//     const [formValues, setFormValues] = useState({
//         stoneItem: "",
//         pcs: "",
//         cts: "",
//         grams: "",
//         rate: "",
//         amount: "",
//         noPcs: "",
//         color: "",
//         cut: "",
//         clarity: ""
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingKey, setEditingKey] = useState(null);
//     const stoneItemRef = useRef(null);
//     const rateRef = useRef(null);
//     const noPcsRef = useRef(null);
//     const colorRef = useRef(null);
//     const cutRef = useRef(null);
//     const clarityRef = useRef(null);
//     const [stoneItemInputValue, setStoneItemInputValue] = useState("");
//     const [highlightedIndex, setHighlightedIndex] = useState(0);
//     const handleStoneChange = (value) => {
//         setFormValues({ ...formValues, stoneItem: value });
//         setStoneItemInputValue(""); // ✅ Clears input after selection
//     };
//     const handleRefresh = () => {
//         setSelectedMainProduct(null);
//         setSelectedProduct(null);
//         setPcs("");
//         setGwt("");
//         setBreadsLess("");
//         setTotalLess("");
//         setNwt("");
//         setSelectedCategory(null);
//         setWastageData([{ percentage: "", direct: "", total: "", perGram: "", newField1: "", newField2: "" }]);
//         setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
//         setStoneData([]);
//     };

//     const handleStoneSelect = (value) => {
//         setFormValues({ ...formValues, stoneItem: value });
//         setStoneItemInputValue(""); // ✅ Clears input after selection

//         setTimeout(() => {
//             if (pcssRef.current) {
//                 pcssRef.current.focus(); // ✅ Moves focus to next field
//             }
//         }, 100);
//     };
//     // Filter options based on input
//     const filteredOptions = stoneItems.filter((item) =>
//         item.ITEMNAME.toLowerCase().includes(stoneItemInputValue.toLowerCase())
//     );

//     // Handle key down (Enter & Arrow navigation)
//     const handleStoneKeyDown = (e) => {
//         if (e.key === "Enter" && filteredOptions?.length > 0) {
//             const selectedItem = filteredOptions[highlightedIndex]; // Get highlighted item
//             if (selectedItem) {
//                 handleStoneChange(selectedItem.ITEMNAME);
//                 handleStoneSelect(selectedItem.ITEMNAME);
//                 setStoneItemInputValue(selectedItem.ITEMNAME);
//             }
//         } else if (e.key === "ArrowDown") {
//             setHighlightedIndex((prev) =>
//                 prev < filteredOptions?.length - 1 ? prev + 1 : prev
//             );
//         } else if (e.key === "ArrowUp") {
//             setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
//         }
//     };
//     useEffect(() => {
//         axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterItemMasterList")
//             .then(response => {
//                 setStoneItems(response.data);
//             })
//             .catch(error => console.error("Error fetching stone items:", error));
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let updatedValues = { ...formValues, [name]: value };

//         if (name === "pcs" && value) {
//             updatedValues = { ...updatedValues, cts: "", grams: "" };
//         } else if (name === "cts" && value) {
//             updatedValues = { ...updatedValues, pcs: "", grams: "" };
//         } else if (name === "grams" && value) {
//             updatedValues = { ...updatedValues, pcs: "", cts: "" };
//         }

//         const rate = parseFloat(updatedValues.rate) || 0;
//         const pcs = parseFloat(updatedValues.pcs) || 0;
//         const cts = parseFloat(updatedValues.cts) || 0;
//         const grams = parseFloat(updatedValues.grams) || 0;
//         const amount = rate * (pcs + cts + grams);
//         updatedValues.amount = amount.toFixed(2);

//         setFormValues(updatedValues);
//     };

//     const handleEnterPress = (e, field) => {
//         if (e.key === "Enter") {
//             e.preventDefault(); // Prevent default behavior

//             const nextFieldMap = {
//                 stoneItem: pcsRef,
//                 pcs: rateRef,
//                 cts: rateRef,
//                 grams: rateRef,
//                 rate: noPcsRef,
//                 noPcs: colorRef,
//                 color: cutRef,
//                 cut: clarityRef,
//                 clarity: null // Submits the form
//             };

//             const nextField = nextFieldMap[field];

//             if (nextField && nextField.current) {
//                 nextField.current.focus();
//             } else {
//                 handleAddStone(); // Submit after clarity
//             }
//         }
//     };
//     const handleAddStone = () => {
//         if (!formValues.rate) {
//             alert("Enter required fields.");
//             return;
//         }

//         if (isEditing) {
//             setStoneData((stoneData || []).map(item => item.key === editingKey ? { ...formValues, key: editingKey } : item));
//             setIsEditing(false);
//             setEditingKey(null);
//         // } else {
//             const newStone = { ...formValues, key: (stoneData?.length || 0) + 1, sno: (stoneData?.length || 0) + 1 };
//             setStoneData([...(stoneData || []), newStone]);
//         }
//         setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
//     };
//     const handleRemoveStone = (key) => {
//         setStoneData(stoneData.filter(item => item.key !== key));
//     };

//     const handleEditStone = (record) => {
//         setFormValues(record);
//         setIsEditing(true);
//         setEditingKey(record.key);
//     };
//     const columns = [
//         { title: "S. No", key: "sno", render: (_, __, index) => index + 1 },
//         { title: "Stone Item", dataIndex: "stoneItem", key: "stoneItem" },
//         { title: "Pcs", dataIndex: "pcs", key: "pcs", align: "right" },
//         { title: "Cts", dataIndex: "cts", key: "cts", align: "right", render: (text) => text ? parseFloat(text).toFixed(3) : "" },
//         { title: "Grams", dataIndex: "grams", key: "grams", align: "right", render: (text) => text ? parseFloat(text).toFixed(3) : "" },
//         { title: "Rate", dataIndex: "rate", key: "rate", align: "right" },
//         { title: "Amount", dataIndex: "amount", key: "amount", align: "right" },
//         { title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", align: "right" },
//         { title: "Color", dataIndex: "color", key: "color" },
//         { title: "Cut", dataIndex: "cut", key: "cut" },
//         { title: "Clarity", dataIndex: "clarity", key: "clarity" },
//         {
//             title: "Action", key: "action", render: (_, record) => (
//                 <>
//                     <EditOutlined onClick={() => handleEditStone(record)} style={{ color: "blue", cursor: "pointer", marginRight: 8 }} />
//                     <CloseOutlined onClick={() => handleRemoveStone(record.key)} style={{ color: "red", cursor: "pointer" }} />
//                 </>
//             )
//         }
//     ];
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [, setIsEditable] = useState(false);

//     const directRef = useRef(null);
//     const direct1Ref = useRef(null);
//     const totalRef = useRef(null);
//     const total1Ref = useRef(null);
//     const perGramRef = useRef(null);
//     const percentageRef = useRef(null);
//     const counterRef = useRef(null);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterList");
//                 setCategories(response.data);
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     const handleKeyDown = (e, nextRef, prevRef) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             if (nextRef) nextRef.current.focus();
//         } else if (e.key === 'ArrowLeft' && prevRef) {
//             prevRef.current.focus();
//         }
//     };

//     const handleCategoryChange = (value) => {
//         setSelectedCategory("");
//         setTimeout(() => setSelectedCategory(value), 0);
//         setIsEditable(value === "OTHERS");
//         if (value === "OTHERS") {
//             setWastageData([{ key: "1", percentage: "", direct: "", total: "", perGram: "", newField1: "", newField2: "" }]);
//         } else {
//             const selectedOption = categories.find(item => item.categoryname === value);
//             if (selectedOption) {
//                 setWastageData([{ key: "1", percentage: selectedOption.wastage, direct: selectedOption.directwastage.toFixed(3), total: parseFloat(selectedOption.directwastage) > 0 ? selectedOption.directwastage.toFixed(3) : ((selectedOption.wastage * nwt) / 100 + selectedOption.directwastage).toFixed(3), perGram: selectedOption.makingcharges.toFixed(2), newField1: selectedOption.directmc.toFixed(2), newField2: (selectedOption.makingcharges * nwt).toFixed(2) }]);
//             }
//         }
//     };
//     useEffect(() => {
//         if (selectedCategory === "OTHERS" && percentageRef.current) {
//             percentageRef.current.focus();
//         }
//     }, [selectedCategory]);
//     useEffect(() => {
//         // Fetch Main Product List
//         const fetchMainProducts = async () => {
//             try {
//                 const response = await axios.get(`http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList`);
//                 const options = response.data.map((item) => item.MNAME);
//                 setMainProductOptions(options);
//             } catch (error) {
//                 message.error("Failed to fetch main products.");
//             }
//         };

//         fetchMainProducts();
//     }, []);

//     useEffect(() => {
//         if (!selectedMainProduct) return;
//         const url = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=PRODUCT_MASTER&where=MNAME='${selectedMainProduct}'&order=PRODUCTNAME`;
//         axios.get(url)
//             .then(response => {
//                 setProducts(response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching product data:", error);
//             });
//     }, [selectedMainProduct]);

//     useEffect(() => {
//         // Calculate NWT correctly whenever GWT, Breads Less, or Weight Less changes
//         const calculateNwt = () => {
//             const breadsLessValue = parseFloat(breadsLess) || 0;
//             const totalLessValue = parseFloat(totalLess) || 0;
//             const gwtValue = parseFloat(gwt) || 0;

//             const calculatedNwt = gwtValue - (breadsLessValue + totalLessValue);

//             // Update NWT only if the new value is different
//             setNwt((prevNwt) => (prevNwt !== calculatedNwt ? calculatedNwt : prevNwt));
//         };

//         calculateNwt();
//     }, [gwt, breadsLess, totalLess]); // Runs whenever these values change

//     const handleProductSelect = (value, option) => {
//         setSelectedProduct(value);

//         if (pcsRef.current) pcsRef.current.focus();
//     };

//     return (
//         <>
//             <Button
//                 type="primary"
//                 shape="circle"
//                 icon={<ReloadOutlined />}
//                 onClick={handleRefresh}
//                 style={{ marginBottom: "10px", backgroundColor: "#f5222d", color: "white", border: "none" }}
//             />
//             <Card title="Product Details" bordered={false} style={{ width: "100%" }}>
//                 <Card
//                     style={{
//                         background: "lightblue", // Matches the uploaded image
//                         borderRadius: 10,
//                     }}
//                 >
//                     <Row gutter={10} align="middle">
//                         {/* Main Product */}
//                         <Col span={5}>
//                             <Text>Main Product</Text>
//                             <Select
//                                 ref={mainProductRef}
//                                 style={{ width: "100%" }}
//                                 showSearch
//                                 placeholder="Select Main Product"
//                                 value={selectedMainProduct || undefined}
//                                 onChange={(value) => setSelectedMainProduct(value)}
//                                 filterOption={(input, option) =>
//                                     option.children.toLowerCase().includes(input.toLowerCase())
//                                 }
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         e.preventDefault();
//                                         if (productNameRef.current) productNameRef.current.focus();
//                                     }
//                                 }}
//                             >
//                                 {mainProductOptions.map((item) => (
//                                     <Option key={item} value={item}>
//                                         {item}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Col>

//                         {/* Product Name */}
//                         <Col span={5}>
//                             <Text>Product Name</Text>
//                             <Select
//                                 ref={productNameRef}
//                                 style={{ width: "100%" }}
//                                 showSearch
//                                 placeholder="Select a product"
//                                 value={selectedProduct || undefined}
//                                 onSelect={handleProductSelect}
//                                 disabled={!selectedMainProduct} // Disable if no main product is selected
//                             >
//                                 {products.map((product) => (
//                                     <Option key={product.PRODUCTCODE} value={product.PRODUCTNAME}>
//                                         {product.PRODUCTNAME}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Col>

//                         {/* PCS */}
//                         <Col span={2}>
//                             <Text>PCS</Text>
//                             <Input type="number" value={pcs} onChange={(e) => setPcs(e.target.value)} />
//                         </Col>

//                         {/* G.wt */}
//                         <Col span={3}>
//                             <Text>G.wt</Text>
//                             <Input type="number" placeholder="Enter GWT" value={gwt} onChange={(e) => setGwt(e.target.value)} />
//                         </Col>

//                         {/* Breads Less */}
//                         <Col span={3}>
//                             <Text>Breads Less</Text>
//                             <Input type="number" placeholder="Enter..." value={breadsLess} onChange={(e) => setBreadsLess(e.target.value)} />
//                         </Col>

//                         {/* Weight Less */}
//                         <Col span={3}>
//                             <Text>Weight Less</Text>
//                             <Input type="number" placeholder="Enter T..." value={totalLess} onChange={(e) => setTotalLess(e.target.value)} />
//                         </Col>

//                         {/* N.wt */}
//                         <Col span={3}>
//                             <Text>N.wt</Text>
//                             <Input type="number" value={nwt} readOnly />
//                         </Col>
//                     </Row>
//                 </Card>
//                 <Card title="Category Details" bordered={false} style={{ backgroundColor: "lightblue" }}>
//                     <Row gutter={16}>
//                         {/* Category Dropdown */}
//                         <Col xs={24} sm={4} style={{ marginTop: "20px" }}>
//                             <Text strong>Category</Text>
//                             <Select
//                                 showSearch
//                                 ref={categoryRef}
//                                 value={selectedCategory}
//                                 placeholder="%"
//                                 onChange={handleCategoryChange}
//                                 style={{ width: "100%", borderRadius: "8px" }}
//                                 optionFilterProp="children"
//                                 filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
//                             >
//                                 {categories.map((category) => (
//                                     <Option key={category.categoryname} value={category.categoryname}>
//                                         {category.categoryname}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Col>

//                         {/* Wastage Section */}
//                         <Col xs={24} sm={10}>
//                             <Card title="Wastage" bordered={false} style={{ background: "#F0F0F0", borderRadius: "8px", textAlign: "center" }}>
//                                 <Row gutter={8}>
//                                     <Col span={8}>
//                                         <Text>%</Text>
//                                         <Input
//                                             ref={percentageRef}
//                                             value={wastageData[0]?.percentage || ""}
//                                             placeholder="%"
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 setWastageData([{ ...wastageData[0], percentage: value, total: value ? ((parseFloat(value) * nwt) / 100).toFixed(3) : "" }]);
//                                             }}
//                                             onKeyDown={(e) => handleKeyDown(e, directRef, null)}
//                                         />
//                                     </Col>
//                                     <Col span={8}>
//                                         <Text>Direct</Text>
//                                         <Input
//                                             ref={directRef}
//                                             value={wastageData[0]?.direct || ""}
//                                             placeholder="Direct"
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 setWastageData([{ ...wastageData[0], direct: value, total: parseFloat(value).toFixed(3) }]);
//                                             }}
//                                             onKeyDown={(e) => handleKeyDown(e, perGramRef, percentageRef)}
//                                         />
//                                     </Col>
//                                     <Col span={8}>
//                                         <Text>Total</Text>
//                                         <Input ref={totalRef} value={wastageData[0]?.total || ""} placeholder="Total" readOnly />
//                                     </Col>
//                                 </Row>
//                             </Card>
//                         </Col>

//                         {/* Making Charges Section */}
//                         <Col xs={24} sm={10}>
//                             <Card title="Making Charges" bordered={false} style={{ background: "#F0F0F0", borderRadius: "8px", textAlign: "center" }}>
//                                 <Row gutter={8}>
//                                     <Col span={8}>
//                                         <Text>Gram</Text>
//                                         <Input
//                                             ref={perGramRef}
//                                             value={wastageData[0]?.perGram || ""}
//                                             placeholder="Per Gram"
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 setWastageData([{ ...wastageData[0], perGram: value, newField2: (parseFloat(value) * nwt).toFixed(2) }]);
//                                             }}
//                                             onKeyDown={(e) => handleKeyDown(e, direct1Ref, null)}
//                                         />
//                                     </Col>
//                                     <Col span={8}>
//                                         <Text>Direct</Text>
//                                         <Input
//                                             ref={direct1Ref}
//                                             value={wastageData[0]?.newField1 || ""}
//                                             placeholder="Direct"
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 setWastageData([{ ...wastageData[0], newField1: value, newField2: (parseFloat(wastageData[0]?.perGram || 0) * nwt).toFixed(2) }]);
//                                             }}
//                                             onKeyDown={(e) => handleKeyDown(e, total1Ref, perGramRef)}
//                                         />
//                                     </Col>
//                                     <Col span={8}>
//                                         <Text>Total</Text>
//                                         <Input ref={total1Ref} value={wastageData[0]?.newField1 || wastageData[0]?.newField2 || ""} placeholder="Total" readOnly />
//                                     </Col>
//                                 </Row>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Card>
//                 <Card title="Stone Details" style={{ backgroundColor: "lightblue" }}>
//                     <Row gutter={[8, 8]}>
//                         <Col span={4}>
//                             <Text style={{ display: "block" }}>Stone Item</Text>
//                             <Select
//                                 ref={stoneItemRef}
//                                 showSearch
//                                 value={formValues.stoneItem || stoneItemInputValue}
//                                 placeholder="Select Stone"
//                                 onChange={handleStoneChange}
//                                 onSelect={handleStoneSelect}
//                                 style={{ width: "100%" }}
//                                 onSearch={(value) => {
//                                     setStoneItemInputValue(value);
//                                     setHighlightedIndex(0);
//                                 }}
//                                 onKeyDown={handleStoneKeyDown}
//                                 filterOption={false}
//                                 defaultActiveFirstOption={false}
//                                 dropdownRender={(menu) => (
//                                     <div>
//                                         {menu}
//                                         <style jsx>{`
//                                             .ant-select-item-option-active {
//                                                 background-color: rgb(125, 248, 156) !important;
//                                             }
//                                         `}</style>
//                                     </div>
//                                 )}
//                             >
//                                 {filteredOptions.map((item, index) => (
//                                     <Option
//                                         key={item.ITEMCODE}
//                                         value={item.ITEMNAME}
//                                         className={index === highlightedIndex ? "highlighted-option" : ""}
//                                     >
//                                         {item.ITEMNAME}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Col>
//                         {[
//                             { name: "pcs", placeholder: "Enter Pcs", ref: pcssRef },
//                             { name: "cts", placeholder: "Enter Cts" },
//                             { name: "grams", placeholder: "Enter Grams" },
//                             { name: "rate", placeholder: "Enter Rate", ref: rateRef },
//                             { name: "amount", placeholder: "Auto-calculated", readOnly: true },
//                             { name: "noPcs", placeholder: "Enter No. Pcs", ref: noPcsRef },
//                             { name: "color", placeholder: "Enter Color", ref: colorRef },
//                             { name: "cut", placeholder: "Enter Cut", ref: cutRef },
//                             { name: "clarity", placeholder: "Enter Clarity", ref: clarityRef },
//                         ].map(({ name, placeholder, readOnly = false, ref }) => (
//                             <Col span={4} key={name}>
//                                 <Text>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
//                                 <Input
//                                     name={name}
//                                     value={formValues[name]}
//                                     onChange={handleInputChange}
//                                     onKeyDown={(e) => handleEnterPress(e, name)}
//                                     placeholder={placeholder}
//                                     readOnly={readOnly}
//                                     ref={ref}
//                                 />
//                             </Col>
//                         ))}
//                         <Button type="primary" onClick={() => { handleAddStone(); mainProductRef.current.focus(); }} style={{ marginTop: "20px" }}>
//                             Submit
//                         </Button>
//                     </Row>
//                 </Card>

//                 <Table size="small" columns={columns} dataSource={stoneData} pagination={false} />
                  
//             </Card>
            
//         </>
//     );
// };

// export default ProductDetailsModal;
