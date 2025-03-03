import React, { useCallback, useRef, useState, useEffect } from "react";
import { Form, Table, Button, Col, Row, Input, Card, Typography, Tag, message, Popover, Popconfirm, Modal, Select } from "antd";
import { DeleteOutlined, InfoCircleOutlined, ReloadOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import TodaysRates1 from "./TodaysRate1";
import axios from 'axios';
import TableHeaderStyles from "../Pages/TableHeaderStyles";

const { Option } = Select;
const { Text, Title } = Typography;
const EstimationTable = () => {
    const tagStyle = {
        fontSize: "12px",
        padding: "6px 12px",
        borderRadius: "16px",
        fontWeight: "bold",
        color: "white",
    };
    const [ratesAvailable, setRatesAvailable] = useState(false); // Track rate availability

    // Function to update rate availability from TodaysRates
    const handleRatesCheck = (available) => {
        setRatesAvailable(available);
    };

    const [tagNo, setTagNo] = useState("");
    const [data, setData] = useState([]);
    const [stoneDetailes, setStoneDetailes] = useState([]);
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [mainProductOptions, setMainProductOptions] = useState([]);
    const [selectedMainProduct, setSelectedMainProduct] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [pcs, setPcs] = useState(1);
    const [gwt, setGwt] = useState(0);
    const [breadsLess, setBreadsLess] = useState(0);
    const [totalLess, setTotalLess] = useState(parseFloat(localStorage.getItem("finalTotalGrams")) || 0);
    const [nwt, setNwt] = useState(0);
    const pcsRef = useRef(null);
    const pcssRef = useRef(null);
    const [huid, setHuid] = useState("");
    const [tagSize, setTagSize] = useState("");
    const [description, setDescription] = useState("");
    const gwtRef = useRef(null);
    const breadsLessRef = useRef(null);
    const totalLessRef = useRef(null);
    const nwtRef = useRef(null);
    const productNameRef = useRef(null);
    const mainProductRef = useRef(null);
    const categoryRef = useRef(null);
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
    const [stoneItems, setStoneItems] = useState([]);
    const [formValues, setFormValues] = useState({
        stoneItem: "",
        pcs: "",
        cts: "",
        grams: "",
        rate: "",
        amount: "",
        noPcs: "",
        color: "",
        cut: "",
        clarity: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const stoneItemRef = useRef(null);
    const rateRef = useRef(null);
    const noPcsRef = useRef(null);
    const colorRef = useRef(null);
    const cutRef = useRef(null);
    const clarityRef = useRef(null);
    const [stoneItemInputValue, setStoneItemInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [rates, setRates] = useState([]); // Store rates data

    const handleStoneChange = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
        setStoneItemInputValue(""); // ✅ Clears input after selection
    };
    const handleRefresh1 = () => {
        setSelectedMainProduct(null);
        setSelectedProduct(null);
        setPcs("");
        setGwt("");
        setBreadsLess("");
        setTotalLess("");
        setNwt("");
        setSelectedCategory(null);
        setWastageData([{ percentage: "", direct: "", total: "", perGram: "", newField1: "", newField2: "" }]);
        setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
        setStoneData([]);
        setHuid("");
        setTagSize("");
        setDescription("");
        setSelectedPurity(null);
    };

    const handleStoneSelect = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
        setStoneItemInputValue(""); // ✅ Clears input after selection

        setTimeout(() => {
            if (pcssRef.current) {
                pcssRef.current.focus(); // ✅ Moves focus to next field
            }
        }, 100);
    };
    // Filter options based on input
    const filteredOptions = stoneItems.filter((item) =>
        item.ITEMNAME.toLowerCase().includes(stoneItemInputValue.toLowerCase())
    );
    // State to hold purity options
    const [purityOptions, setPurityOptions] = useState([]);
    const purityRef = useRef(null);
    const huidRef = useRef(null);
    const tagSizeRef = useRef(null);
    const descriptionRef = useRef(null);


    const [selectedPurity, setSelectedPurity] = useState("");
    useEffect(() => {
        if (selectedMainProduct) {
            axios.get(`http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList`)
                .then(response => {
                    const filteredOptions = response.data.filter(item => item.MAINPRODUCT === selectedMainProduct);
                    setPurityOptions(filteredOptions);
                })
                .catch(error => {
                    console.error("Error fetching purity options:", error);
                });
        }
    }, [selectedMainProduct]);

    // Handle key down (Enter & Arrow navigation)
    const handleStoneKeyDown = (e) => {
        if (e.key === "Enter" && filteredOptions?.length > 0) {
            const selectedItem = filteredOptions[highlightedIndex]; // Get highlighted item
            if (selectedItem) {
                handleStoneChange(selectedItem.ITEMNAME);
                handleStoneSelect(selectedItem.ITEMNAME);
                setStoneItemInputValue(selectedItem.ITEMNAME);
            }
        } else if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                prev < filteredOptions?.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
    };
    useEffect(() => {
        axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterItemMasterList")
            .then(response => {
                setStoneItems(response.data);
            })
            .catch(error => console.error("Error fetching stone items:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValues = { ...formValues, [name]: value };

        if (name === "pcs" && value) {
            updatedValues = { ...updatedValues, cts: "", grams: "" };
        } else if (name === "cts" && value) {
            updatedValues = { ...updatedValues, pcs: "", grams: "" };
        } else if (name === "grams" && value) {
            updatedValues = { ...updatedValues, pcs: "", cts: "" };
        }

        const rate = parseFloat(updatedValues.rate) || 0;
        const pcs = parseFloat(updatedValues.pcs) || 0;
        const cts = parseFloat(updatedValues.cts) || 0;
        const grams = parseFloat(updatedValues.grams) || 0;
        const amount = rate * (pcs + cts + grams);
        updatedValues.amount = amount?.toFixed(2);

        setFormValues(updatedValues);
    };

    const handleEnterPress = (e, field) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior

            const nextFieldMap = {
                stoneItem: pcsRef,
                pcs: rateRef,
                cts: rateRef,
                grams: rateRef,
                rate: noPcsRef,
                noPcs: colorRef,
                color: cutRef,
                cut: clarityRef,
                clarity: null // Submits the form
            };

            const nextField = nextFieldMap[field];

            if (nextField && nextField.current) {
                nextField.current.focus();
            } else {
                handleAddStone(); // Submit after clarity
            }
        }
    };
    const handleAddStone = () => {
        if (!formValues.rate) {
            alert("Enter required fields.");
            return;
        }

        if (isEditing) {
            setStoneData((stoneData || []).map(item => item.key === editingKey ? { ...formValues, key: editingKey } : item));
            setIsEditing(false);
            setEditingKey(null);
        } else {
            const newStone = { ...formValues, key: (stoneData?.length || 0) + 1, sno: (stoneData?.length || 0) + 1 };
            setStoneData([...(stoneData || []), newStone]);
        }
        setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
    };
    const handleRemoveStone = (key) => {
        setStoneData(stoneData.filter(item => item.key !== key));
    };

    const handleEditStone = (record) => {
        setFormValues(record);
        setIsEditing(true);
        setEditingKey(record.key);
    };
    const columns2 = [
        { title: "S. No", key: "sno", render: (_, __, index) => index + 1 },
        { title: "Stone Item", dataIndex: "stoneItem", key: "stoneItem" },
        { title: "Pcs", dataIndex: "pcs", key: "pcs", align: "right" },
        { title: "Cts", dataIndex: "cts", key: "cts", align: "right", render: (text) => text ? parseFloat(text)?.toFixed(3) : "" },
        { title: "Grams", dataIndex: "grams", key: "grams", align: "right", render: (text) => text ? parseFloat(text)?.toFixed(3) : "" },
        { title: "Rate", dataIndex: "rate", key: "rate", align: "right" },
        { title: "Amount", dataIndex: "amount", key: "amount", align: "right" },
        { title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", align: "right" },
        { title: "Color", dataIndex: "color", key: "color" },
        { title: "Cut", dataIndex: "cut", key: "cut" },
        { title: "Clarity", dataIndex: "clarity", key: "clarity" },
        {
            title: "Cts-Grams",
            key: "ctsToGrams",
            align: "right",
            render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                if (item && item.DIAMONDS) {
                    return "0.000"; // Show zero if diamonds exist
                }
                if (!isNaN(parseFloat(record.grams)) && parseFloat(record.grams) !== 0) {
                    return "0.000"; // Show zero if grams exist
                }
                if (item && item.EFFECTON_GOLD) {
                    return (parseFloat(record.cts) / 5)?.toFixed(3) || "0.000";
                }
                return !isNaN(parseFloat(record.cts)) ? parseFloat(record.cts)?.toFixed(3) : "0.000";
            },
        },
        {
            title: "Dia Cts", key: "diaCts", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.DIAMONDS ? parseFloat(record.cts)?.toFixed(3) : "";
            }
        },
        {
            title: "Dia Amt", key: "diaAmount", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.DIAMONDS ? parseFloat(record.amount)?.toFixed(2) : "";
            }
        },
        {
            title: "CTS", key: "ctsCol", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.CTS ? parseFloat(record.cts)?.toFixed(3) : "";
            }
        },
        {
            title: "Uncuts", key: "uncutsCol", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.UNCUTS ? parseFloat(record.cts)?.toFixed(3) : "";
            }
        },
        {
            title: "Action", key: "action", render: (_, record) => (
                <>
                    <EditOutlined onClick={() => handleEditStone(record)} style={{ color: "blue", cursor: "pointer", marginRight: 8 }} />
                    <CloseOutlined onClick={() => handleRemoveStone(record.key)} style={{ color: "red", cursor: "pointer" }} />
                </>
            )
        }
    ];
    const totalCtsGrams = (stoneData && stoneData?.length > 0 ? stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        if (item && item.DIAMONDS) {
            return sum; // Skip diamonds, since we show 0 in Cts-Grams
        }
        if (parseFloat(record.grams)) {
            return sum; // Skip grams, since we show 0 in Cts-Grams
        }
        if (item && item.EFFECTON_GOLD) {
            return sum + (parseFloat(record.cts) / 5 || 0);
        }
        return sum + (parseFloat(record.cts) || 0);
    }, 0) : 0)?.toFixed(3);

    const totalGrams = stoneData?.reduce((sum, record) => sum + (parseFloat(record.grams) || 0), 0)?.toFixed(3);
    const finalTotalGrams = (parseFloat(totalCtsGrams) + parseFloat(totalGrams))?.toFixed(3);

    const totalDiaAmount = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        if (item && item.DIAMONDS) {
            return sum + (parseFloat(record.amount) || 0);
        }
        return sum;
    }, 0)?.toFixed(2);

    const totalDiamondCts = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.DIAMONDS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0)?.toFixed(3);
    const totalCTS = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.CTS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0)?.toFixed(3);

    const totalUncuts = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.UNCUTS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0)?.toFixed(3);

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
            e.preventDefault();
            if (nextRef) nextRef.current.focus();
        } else if (e.key === 'ArrowLeft' && prevRef) {
            prevRef.current.focus();
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory("");
        setTimeout(() => setSelectedCategory(value), 0);
        setIsEditable(value === "OTHERS");
        if (value === "OTHERS") {
            setWastageData([{ key: "1", percentage: "", direct: "", total: "", perGram: "", newField1: "", newField2: "" }]);
        } else {
            const selectedOption = categories.find(item => item.categoryname === value);
            if (selectedOption) {
                setWastageData([{ key: "1", percentage: selectedOption.wastage, direct: selectedOption.directwastage?.toFixed(3), total: parseFloat(selectedOption.directwastage) > 0 ? selectedOption.directwastage?.toFixed(3) : ((selectedOption.wastage * nwt) / 100 + selectedOption.directwastage)?.toFixed(3), perGram: selectedOption.makingcharges?.toFixed(2), newField1: selectedOption.directmc?.toFixed(2), newField2: (selectedOption.makingcharges * nwt)?.toFixed(2) }]);
            }
        }
    };
    useEffect(() => {
        if (selectedCategory === "OTHERS" && percentageRef.current) {
            percentageRef.current.focus();
        }
    }, [selectedCategory]);
    useEffect(() => {
        // Fetch Main Product List
        const fetchMainProducts = async () => {
            try {
                const response = await axios.get(`http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList`);
                const options = response.data.map((item) => item.MNAME);
                setMainProductOptions(options);
            } catch (error) {
                message.error("Failed to fetch main products.");
            }
        };

        fetchMainProducts();
    }, []);

    useEffect(() => {
        if (!selectedMainProduct) return;
        const url = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=PRODUCT_MASTER&where=MNAME='${selectedMainProduct}'&order=PRODUCTNAME`;
        axios.get(url)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    }, [selectedMainProduct]);

    useEffect(() => {
        // Calculate NWT correctly whenever GWT, Breads Less, or Weight Less changes
        const calculateNwt = () => {
            const breadsLessValue = parseFloat(breadsLess) || 0;
            const totalLessValue = parseFloat(totalLess) || 0;
            const gwtValue = parseFloat(gwt) || 0;

            const calculatedNwt = gwtValue - (breadsLessValue + totalLessValue);

            // Update NWT only if the new value is different
            setNwt((prevNwt) => (prevNwt !== calculatedNwt ? calculatedNwt : prevNwt));
        };

        calculateNwt();
    }, [gwt, breadsLess, totalLess]); // Runs whenever these values change


    // Close Popover when Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setVisible(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Home") {
                setIsProductModalOpen(true); // Open the modal when Home key is pressed
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const [discount, setDiscount] = useState(0);
    const tagNoInputRef = useRef(null);
    const debounceRef = useRef(null);
    const [rotating, setRotating] = useState(false);
    // Function to reset table data and totals
    const handleRefresh = () => {
        setRotating(true); // Start rotation effect
        setTimeout(() => setRotating(false), 1000); // Stop rotation after 1s
        setData([]); // Clear table data
        setTagNo(""); // Clear Tag No input
    };

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                fetchData();
            }, 300); // 300ms debounce time
        }
    }, [tagNo, data]);

    useEffect(() => {
        if (tagNoInputRef.current) {
            tagNoInputRef.current.focus();
        }
    }, [data]);



    const fetchRates = async () => {
        try {
            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate
                .getDate()
                .toString()
                .padStart(2, "0")}/${currentDate.getFullYear()}`;
    
            const ratesResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );
    
            setRates(ratesResponse.data);
            setRatesAvailable(ratesResponse.data.length > 0); // Enable input if rates exist
        } catch (error) {
            console.error("Error fetching rates:", error);
            message.error("Error fetching rates");
        }
    };
    
    // Fetch rates when the page loads
    useEffect(() => {
        fetchRates();
    }, []);

    const [vat, setVat] = useState(0);

    const fetchData = async () => {
        if (!tagNo) {
            message.error("Please enter a Tag No.");
            return;
        }

        const trimmedTagNo = tagNo.trim();
        const existingTagNos = new Set(data.map((item) => item.tagNo));

        if (existingTagNos.has(trimmedTagNo)) {
            message.warning("This Tag No. is already added to the table.");
            setTagNo("");
            return;
        }

        try {
            setTagNo(null);

            // Get current date in MM/DD/YYYY format
            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate
                .getDate()
                .toString()
                .padStart(2, "0")}/${currentDate.getFullYear()}`;

            // Fetch tag details
            const response = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Erp/TagGenerationSearch?tagNo=${trimmedTagNo}`
            );
            const responseData = response.data;

            if (responseData.length === 0) {
                message.warning("No data found for this Tag No.");
                return;
            }
            // Use already fetched rates (no extra API call)
            if (rates.length === 0) {
                message.warning("Rates not available. Cannot proceed.");
                return;
            }
            // Fetch daily rates using the current date
            const ratesResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );
            const allRates = ratesResponse.data;
            const processedData = responseData.map((item, index) => {
                const lessWeight = item.GWT - item.NWT;
                const totalWastage = item.WASTAGE > 0 ? (item.NWT * item.WASTAGE) / 100 : item.DIRECTWASTAGE;
                const actWt = item.NWT + totalWastage;
                const rateItem = allRates.find(rate => rate.PREFIX === item.PREFIX);
                const rate = rateItem ? rateItem.RATE : item.RATE;

                const metalValue = actWt * rate;
                const totalMC = item.MAKINGCHARGES > 0 ? actWt * item.MAKINGCHARGES : item.DIRECTMC;
                const amount = metalValue + totalMC + item.ITEM_TOTAMT;

                return {
                    key: `${trimmedTagNo}-${index}`,
                    sno: data.length + index + 1,
                    tagNo: trimmedTagNo,
                    mainProduct: item.MNAME,
                    productName: item.PRODUCTNAME,
                    purity: item.PREFIX,
                    pieces: item.PIECES,
                    grossWeight: item.GWT,
                    lessWeight,
                    netWeight: item.NWT,
                    rate,
                    metalValue,
                    stoneCost: item.ITEM_TOTAMT,
                    totalWastage,
                    actWt,
                    totalMC,
                    amount,
                    directWastage: item.DIRECTWASTAGE,
                    wastage: item.WASTAGE,
                    makingCharges: item.MAKINGCHARGES,
                    directMC: item.DIRECTMC,
                    DEALERNAME: item.DEALERNAME,
                    counterName: item.COUNTERNAME,
                    HUID: item.HUID,
                    TAGSIZE: item.TAGSIZE,
                    DESC1: item.DESC1,
                    CATEGORYNAME: item.CATEGORYNAME,
                };
            });
            // Get first record's MNAME in the table
            const firstRecordMName = data.length > 0 ? data[0].mainProduct : null;
            const newMName = processedData[0].mainProduct;

            // Allow only if MNAME matches the first record
            if (firstRecordMName && newMName !== firstRecordMName) {
                message.error(`Only MNAME "${firstRecordMName}" is allowed. Cannot add different MNAME "${newMName}".`);
                return;
            }
            setData((prevData) => [...prevData, ...processedData]);

            // Fetch VAT based on MNAME
            const vatResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductSearch?MName=${newMName}`
            );
            const vatData = vatResponse.data;
            const matchedVatRecord = vatData.find(record => record.MNAME === newMName);
            if (matchedVatRecord) {
                setVat(matchedVatRecord.VAT); // Set VAT from matched record
                console.log("Matched VAT Record:", matchedVatRecord.VAT);
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            setTagNo("");
        }
    };
    // Ensure calculations use valid numbers


    const getTotal = (key) => {
        return stoneData.reduce((sum, record) => sum + (parseFloat(record[key]) || 0), 0);
    };


    const handleOk = async () => {
        try {
            // Fetch daily rates using the current date
            const formattedDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
            const ratesResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );
            const allRates = ratesResponse.data; // Extract rates data

            // Calculate ActWt
            const totalWastage = wastageData[0]?.total ? parseFloat(wastageData[0]?.total) : 0;
            const actWt = nwt + totalWastage;

            // Find the rate based on selected purity (prefix)
            const rateItem = allRates.find(rate => rate.PREFIX === selectedPurity);
            const rate = rateItem ? parseFloat(rateItem.RATE) : 0;

            // Calculate Metal Value
            const metalValue = actWt * rate;

            // Calculate Total Stone Cost
            const totalStoneCost = stoneData.reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

            // Calculate Total Making Charges (totalMC)
            const totalMC =
                parseFloat(wastageData[0]?.newField1) > 0
                    ? parseFloat(wastageData[0]?.newField1)
                    : ((parseFloat(wastageData[0]?.total || 0) + nwt) * parseFloat(wastageData[0]?.perGram || 0));
            // Calculate Final Amount
            const amount = metalValue + totalMC + totalStoneCost;
            // Get first record's `mainProduct` in the table
            const firstRecordMainProduct = data.length > 0 ? data[0].mainProduct : null;

            // Allow only if `mainProduct` matches the first record's `mainProduct`
            if (firstRecordMainProduct && selectedMainProduct !== firstRecordMainProduct) {
                message.error(`Only mainProduct "${firstRecordMainProduct}" is allowed. Cannot add different mainProduct "${selectedMainProduct}".`);
                return;
            }
            // Construct New Data Object
            const newData = {
                key: `${selectedMainProduct}-${selectedProduct}-${pcs}-${gwt}-${nwt}`,
                sno: data.length + 1,
                mainProduct: selectedMainProduct,
                purity: selectedPurity, // Store selected purity (prefix)
                productName: selectedProduct,
                pieces: pcs,
                grossWeight: gwt,
                wastage: wastageData[0]?.percentage,
                lessWeight: (gwt - nwt)?.toFixed(3),
                netWeight: nwt,
                totalWastage: totalWastage?.toFixed(3),
                makingCharges: wastageData[0]?.perGram || "",
                directMC: wastageData[0]?.newField1 || "",
                directWastage: wastageData[0]?.direct || "",
                mcPerGram: wastageData[0]?.perGram || "",
                totalMC: totalMC?.toFixed(2), 
                actWt: actWt?.toFixed(3), // Add ActWt (NetWt + TotalWastage)
                metalValue: metalValue?.toFixed(2), // Add Metal Value (ActWt * Rate)
                rate: rate, // Store the rate used
                stoneCost: totalStoneCost, // Include total stone amount
                amount: amount, // ✅ Final Amount (Metal Value + MC + Stone Cost)
                stoneData: stoneData, // Include all stone data
                totals: calculateTotals(), // Include table data and totals
            };

            // Update Data State
            setData((prevData) => [...prevData, newData]);

            // Close the Modal
            setIsProductModalOpen(false);
            handleRefresh1();

            // Focus on Main Product Input
            if (mainProductRef.current) {
                mainProductRef.current.focus();
            }
        } catch (error) {
            console.error("Error fetching daily rates:", error);
        }
    };

    const ItemDetailsPopover = ({ record }) => {
        const [visible, setVisible] = useState(false);
        const [stoneDetailes, setStoneDetailes] = useState([]);

        useEffect(() => {
            if (visible) {
                fetchStoneDetails(record.tagNo);
            }
        }, [visible, record.tagNo]);

        const fetchStoneDetails = async (tagNo) => {
            if (!tagNo) return;

            const formattedTagNo = `'${tagNo}'`;
            const apiUrl = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder`;

            try {
                const response = await axios.get(apiUrl, {
                    params: {
                        tableName: "TAG_ITEMS",
                        where: `TAGNO=${formattedTagNo}`,
                        order: "SNO",
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setStoneDetailes(response.data);
            } catch (error) {
                console.error("Error fetching stone details:", error.response ? error.response.data : error.message);
            }
        };

        return (
            <Popover
                content={
                    <>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => setVisible(false)}
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                fontSize: "16px",
                            }}
                        />

                        <Card
                            style={{
                                width: "100%",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                borderRadius: "10px",
                                background: "lightblue",
                            }}
                            className="customedetailescard"
                        >
                            <h3 className="stone-details-heading">Product Details:</h3>

                            <div style={{ display: "flex", alignItems: "center" }}>

                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px" }}>
                                    <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}>Tag No</p>
                                    <div
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            border: "1px solid black",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {record?.tagNo || "N/A"}
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                        <Button style={{ backgroundColor: record?.TRAY ? "green" : "grey", color: "white" }}>
                                            TRAY
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, minmax(250px, 1fr))",
                                        gap: "10px",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ display: "grid", gridTemplateColumns: "150px 10px auto", gap: "5px", alignItems: "center" }}>
                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Product Name</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "left" }}>{record?.productName || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Gross Weight</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{Number(record?.grossWeight)?.toFixed(3) || "0.000"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Less Weight</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{Number(record?.lessWeight)?.toFixed(3) || "0.000"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Stone Weight</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{Number(record?.stoneWeight)?.toFixed(3) || "0.000"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Net Weight</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{Number(record?.netWeight)?.toFixed(3) || "0.000"}</div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "150px 10px auto", gap: "5px", alignItems: "center" }}>
                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Category</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "left" }}>{record?.CATEGORYNAME || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Wastage</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.wastage || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Total Wastage</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{Number(record?.totalWastage)?.toFixed(3) || "0.000"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>MC/G</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.makingCharges || "N/A"}/G</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>MC Amount</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.totalMC || "N/A"}</div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "150px 10px auto", gap: "5px", alignItems: "center" }}>
                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Dealer Name</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.DEALERNAME || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Counter Name</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "left" }}>{record?.counterName || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>HUID</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.HUID || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Tag Size</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "right" }}>{record?.TAGSIZE || "N/A"}</div>

                                        <div style={{ textAlign: "left", fontWeight: "bold" }}>Description</div>
                                        <div style={{ textAlign: "left" }}>:</div>
                                        <div style={{ textAlign: "left" }}>{record?.DESC1 || "N/A"}</div>
                                    </div>
                                </div>

                            </div>
                        </Card>
                        <Card
                            style={{
                                width: "100%",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                borderRadius: "10px",
                                background: "lightblue",
                            }}
                            className="customedetailescard"

                        >
                            <div className="stone-details-container">
                                <h3 className="stone-details-heading">Stone Details:</h3>

                                <div className="stone-details-cards">
                                    {[
                                        { label: "Stone Cost", value: (parseFloat(record?.stoneCost) || 0) },
                                        { label: "Total Pieces", value: stoneDetailes.reduce((sum, item) => sum + item.PIECES, 0) },
                                        { label: "Total Cts", value: stoneDetailes.reduce((sum, item) => sum + item.CTS, 0).toFixed(3) },
                                        { label: "Total Grms", value: stoneDetailes.reduce((sum, item) => sum + item.GRMS, 0).toFixed(3) },
                                        { label: "Dia Cts", value: data.filter(item => item.tagNo === record.tagNo && item.CATEGORYNAME === 'Diamond').reduce((sum, item) => sum + item.netWeight, 0).toFixed(3) },
                                        { label: "Dia Amt", value: data.filter(item => item.tagNo === record.tagNo && item.CATEGORYNAME === 'Diamond').reduce((sum, item) => sum + item.amount, 0).toFixed(3) },
                                    ].map((item, index) => (
                                        <Card key={index} className="custom-stone-card">
                                            <span className="custom-stone-label">{item.label}:</span>
                                            <span className="custom-stone-value">{item.value}</span>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Table
                            columns={columns1}
                            dataSource={stoneDetailes}
                            rowKey="SNO"
                            size="small"
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            className="customstonedetaile-table"
                        />
                    </>
                }
                title="Item Details"
                trigger="click"
                open={visible}
                onOpenChange={setVisible}
                overlayStyle={{
                    width: "80%",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1050,
                }}
                getPopupContainer={() => document.body}
                disabled={!record?.tagNo}
            >
                <Button icon={<InfoCircleOutlined />} shape="circle" style={{ marginLeft: 8 }} disabled={!record?.tagNo} />
            </Popover>
        );
    };
    const columns = [
        { title: "S.No", dataIndex: "sno", key: "sno", width: 50, render: (_, __, index) => index + 1 },
        { title: "Tag No", dataIndex: "tagNo", width: 60, key: "tagNo" },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => {
                console.log("Row Data:", record); // Debugging missing fields
                return (
                    <>
                        <ItemDetailsPopover record={record} />
                        <Popconfirm
                            title="Are you sure you want to delete?"
                            onConfirm={() => handleDelete(record.key)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
                        </Popconfirm>
                    </>
                );
            },
        },
        { title: "Main Product", dataIndex: "mainProduct", key: "mainProduct" },
        { title: "Product Name", dataIndex: "productName", key: "productName" },
        { title: "Purity", dataIndex: "purity", align: 'center', key: "purity" },
        { title: "Pieces", dataIndex: "pieces", align: 'right', key: "pieces" },
        { title: "Gross W.T", dataIndex: "grossWeight", align: 'right', key: "grossWeight" },
        { title: "Less W.T", dataIndex: "lessWeight", align: 'right', key: "lessWeight", render: (text) => Number(text)?.toFixed(3) },        { title: "Net W.T", dataIndex: "netWeight", align: 'right', key: "netWeight" },
        { title: "Rate", dataIndex: "rate", align: 'right', key: "rate" },
        { title: "Total Wastage", dataIndex: "totalWastage", align: 'right', key: "totalWastage", render: (text) => Number(text)?.toFixed(3) },
        { title: "ACT W.T", dataIndex: "actWt", align: 'right', key: "actWt" },
        { title: "Metal Value", dataIndex: "metalValue", align: 'right', key: "metalValue" },
        { title: "Total MC", dataIndex: "totalMC", align: 'right', key: "totalMC", },
        { title: "Stone Cost", dataIndex: "stoneCost", align: 'right', key: "stoneCost" },
        { title: "Amount", dataIndex: "amount", align: 'right', key: "amount" },
        { title: "Direct Wastage", align: 'right', dataIndex: "directWastage", key: "directWastage" },
        { title: "Wastage", dataIndex: "wastage", align: 'right', key: "wastage" },
        { title: "MC/Gram", dataIndex: "makingCharges", align: 'right', key: "makingCharges" },
        { title: "Direct MC", dataIndex: "directMC", align: 'right', key: "directMC" },
    ];
    useEffect(() => {
        if (tagNo) {
            fetchStoneDetails(tagNo);
        }
    }, [tagNo]);
    const fetchStoneDetails = async (tagNo) => {
        if (!tagNo) return;

        // Ensure tagNo is properly formatted with single quotes
        const formattedTagNo = `'${tagNo}'`; // Enclose in single quotes
        const apiUrl = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder`;

        console.log("Fetching stone details for TAGNO:", formattedTagNo); // Debugging

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    tableName: "TAG_ITEMS",
                    where: `TAGNO=${formattedTagNo}`, // Properly formatted WHERE clause
                    order: "SNO",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);
            setStoneDetailes(response.data);
        } catch (error) {
            console.error("Error fetching stone details:", error.response ? error.response.data : error.message);
        }
    };

    const columns1 = [
        { title: "S.No", dataIndex: "SNO", key: "SNO", width: 50 },
        { title: "Item Name", dataIndex: "ITEMNAME", key: "ITEMNAME" },
        { title: "Pieces", dataIndex: "PIECES", key: "PIECES", align: "right", },
        { title: "Carats (Cts)", dataIndex: "CTS", key: "CTS", align: "right", render: (text) => Number(text).toFixed(3) },
        { title: "Grams", dataIndex: "GRMS", key: "GRMS", align: "right", render: (text) => Number(text).toFixed(3) },
        { title: "Rate", dataIndex: "RATE", key: "RATE", align: "right", render: (text) => Number(text).toFixed(2) },
        { title: "Amount", dataIndex: "AMOUNT", key: "AMOUNT", align: "right", render: (text) => Number(text).toFixed(2) },
        { title: "Colour", dataIndex: "COLOUR", key: "COLOUR" },
        { title: "Cut", dataIndex: "CUT", key: "CUT" },
        { title: "Clarity", dataIndex: "CLARITY", key: "CLARITY" },
    ];

    const handleDelete = (key) => {
        setData((prevData) => prevData.filter((item) => item.key !== key));
    };

    const calculateTotals = () => {
        if (data.length === 0) {
            return {
                totalPcs: 0,
                totalGrossWeight: 0,
                totalLessWeight: 0,
                totalNetWeight: 0,
                totalWastage: 0,
                totalMakingCharges: 0,
                totalAmount: 0,
                totalStoneCost: 0,
            };
        }

        return data.reduce(
            (acc, item) => {
                acc.totalPcs += Number(item.pieces) || 0;
                acc.totalGrossWeight += Number(item.grossWeight) || 0;
                acc.totalLessWeight += Number(item.lessWeight) || 0;
                acc.totalNetWeight += Number(item.netWeight) || 0;
                acc.totalWastage += Number(item.totalWastage) || 0;
                acc.totalMakingCharges += Number(item.totalMC) || 0;
                acc.totalAmount += Number(item.amount) || 0;
                acc.totalStoneCost += Number(item.stoneCost) || 0;
                return acc;
            },
            {
                totalPcs: 0,
                totalGrossWeight: 0,
                totalLessWeight: 0,
                totalNetWeight: 0,
                totalWastage: 0,
                totalMakingCharges: 0,
                totalAmount: 0,
                totalStoneCost: 0,
            }
        );
    };
    useEffect(() => {
        if (isProductModalOpen) {
            setTimeout(() => {
                if (mainProductRef.current) {
                    mainProductRef.current.focus();
                }
            }, 300); // Delay slightly to ensure modal renders first
        }
    }, [isProductModalOpen]);
    const totals = calculateTotals();

    const cardStyle = {
        background: "linear-gradient(to bottom, #e0f7fa, #ffffff)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    };
    // Function to fetch VAT based on MNAME from API
    const totalAmount = parseFloat(totals.totalAmount) || 0;
    const gstAmount = ((totalAmount * vat) / 100).toFixed(2); // ✅ Define gstAmount
    const grossAmount = (totalAmount + parseFloat(gstAmount)).toFixed(2); // ✅ Define grossAmount
    const netAmount = (parseFloat(grossAmount) - parseFloat(discount || 0)).toFixed(2); // ✅ Define netAmount
    return (
        <div>
            <Row gutter={16} align="middle" style={{ marginBottom: "0.5rem" }}>
                <Col span={6} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2 style={{ fontSize: "1rem", lineHeight: "1.2", margin: 0, whiteSpace: "nowrap" }}>
                        TAG NO
                    </h2>
                    <Input
                        placeholder="Enter Tag No"
                        size="large"
                        style={{ height: "40px", fontSize: "16px", fontWeight: "bold", flex: 1, minWidth: "150px" }}
                        value={tagNo}
                        onChange={(e) => setTagNo(e.target.value)}
                        onKeyDown={handleKeyPress}
                        ref={tagNoInputRef}
                        disabled={!ratesAvailable} />
                    <Button type="primary" onClick={fetchData}>Fetch</Button>
                    <Button
                        icon={
                            <ReloadOutlined
                                style={{
                                    color: "orange",
                                    padding: "10px",
                                    fontSize: "15px",
                                    transition: "transform 1s ease-in-out",
                                    transform: rotating ? "rotate(360deg)" : "rotate(0deg)"
                                }}
                            />
                        }
                        onClick={handleRefresh}
                    />
                </Col>
                <Col span={12} style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "1rem", lineHeight: "1.2", margin: 0 }}>
                        Estimation No. 1344
                    </h2>
                </Col>

                <Col span={6}>
                    <TodaysRates1 onRatesCheck={handleRatesCheck} />
                </Col>
            </Row>
            <TableHeaderStyles>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                    scroll={{ x: "max-content" }}
                    className="custom-table"
                />
            </TableHeaderStyles>
            <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                <Col span={10}>
                    <Card style={cardStyle}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                {[
                                    { label: "Total Pcs", value: totals.totalPcs },
                                    { label: "Gross Weight", value: totals.totalGrossWeight.toFixed(3) },
                                    { label: "Less Weight", value: totals.totalLessWeight.toFixed(3) },
                                    { label: "Net Weight", value: totals.totalNetWeight.toFixed(3) },
                                ].map((item, index) => (
                                    <Row key={index} style={rowStyle}>
                                        <Text strong>{item.label}:</Text> <Text>{item.value}</Text>
                                    </Row>
                                ))}
                            </Col>

                            <Col span={1}>
                                <div style={{ borderLeft: "1px solid #d9d9d9", height: "100%" }}></div>
                            </Col>

                            <Col span={11}>
                                {[
                                    { label: "Total Wastage", value: totals.totalWastage?.toFixed(3) },
                                    { label: "Making Charges", value: Number(totals.totalMakingCharges) },
                                    { label: "Total Amount", value: totals.totalAmount },
                                    { label: "Stone Cost", value: totals.totalStoneCost },
                                ].map((item, index) => (
                                    <Row key={index} style={rowStyle}>
                                        <Text strong>{item.label}:</Text> <Text>{item.value}</Text>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={5}>
                    <Card style={cardStyle}>
                        <Text type="secondary">Empty Section</Text>
                    </Card>
                </Col>

                {/* Right Card */}
                <Col span={8}>
                    <Card style={cardStyle}>
                    {[
        { label: "Total Amount", value: totals.totalAmount.toFixed(2) },
        { label: `GST Amount - (${vat}%)`, value: gstAmount }, // Show VAT % in brackets
        { label: "Gross Amount", value: grossAmount },
        {
            label: "Discount (%)",
            value: (
                <Input
                    style={{ width: "80px", textAlign: "right" }}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />
            ),
        },
        { label: "Net Amount", value: netAmount, strong: true },
    ].map((item, index) => (
        <Row key={index} style={rowStyle}>
            <Text strong>{item.label}:</Text> {item.value}
        </Row>
    ))}
                    </Card>
                </Col>
            </Row>
            <Row justify="end" style={{ marginTop: "1rem" }}>
                <Button type="primary" style={{ marginRight: "8px" }}>Save</Button>
                <Button type="default">Print</Button>
            </Row>
            <Modal
                open={isProductModalOpen}
                onCancel={() => setIsProductModalOpen(false)}
                footer={null}
                centered
                width="80%"
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setIsProductModalOpen(false);
                    }
                }}
            >

                <Card title="Product Details" bordered={false} style={{ width: "100%" }} className="customeproductcard">
                    <Card
                        style={{
                            background: "lightblue", // Matches the uploaded image
                            borderRadius: 10,
                        }}
                        className="customeproductcard"
                    >
                        <Row gutter={10} align="middle">
                            {/* Main Product */}
                            <Col span={4}>
                                <Text>Main Product</Text>
                                <Select
                                    ref={mainProductRef}
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select Main Product"
                                    value={selectedMainProduct || undefined}
                                    onChange={(value) => {
                                        setSelectedMainProduct(value);
                                        setTimeout(() => {
                                            if (purityRef.current) purityRef.current.focus();
                                        }, 100); // Small delay to ensure state update before moving focus
                                    }}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={mainProductOptions.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />


                            </Col>
                            <Col span={3}>
                                <Text>Purity</Text>
                                <Form.Item name="prefix" rules={[{ message: "Please select purity" }]}>
                                    <Select
                                        ref={purityRef}
                                        showSearch
                                        placeholder="Select Purity"
                                        value={selectedPurity || undefined}
                                        onChange={(value) => {
                                            setSelectedPurity(value);
                                            setTimeout(() => {
                                                if (productNameRef.current) productNameRef.current.focus();
                                            }, 100);
                                        }}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={purityOptions.map((p) => ({
                                            value: p.Prefix,
                                            label: p.Prefix,
                                        }))}
                                    />


                                </Form.Item>
                            </Col>
                            {/* Product Name */}
                            <Col span={5}>
                                <Text>Product Name</Text>
                                <Select
                                    ref={productNameRef}
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a product"
                                    value={selectedProduct || undefined}
                                    onSelect={(value) => {
                                        setSelectedProduct(value);
                                        setTimeout(() => {
                                            if (pcsRef.current) pcsRef.current.focus();
                                        }, 100);
                                    }}
                                    disabled={!selectedMainProduct} // Disable if no main product is selected
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={products.map((product) => ({
                                        value: product.PRODUCTNAME,
                                        label: product.PRODUCTNAME,
                                    }))}
                                />

                            </Col>

                            {/* PCS */}
                            <Col span={2}>
                                <Text>PCS</Text>
                                <Input
                                    ref={pcsRef}
                                    type="number"
                                    value={pcs}
                                    onChange={(e) => setPcs(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (gwtRef.current) gwtRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />

                            </Col>

                            {/* G.wt */}
                            <Col span={3}>
                                <Text>G.wt</Text>
                                <Input
                                    ref={gwtRef}
                                    type="number"
                                    placeholder="Enter GWT"
                                    value={gwt}
                                    onChange={(e) => setGwt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (breadsLessRef.current) breadsLessRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />
                            </Col>

                            {/* Breads Less */}
                            <Col span={2}>
                                <Text>Breads Less</Text>
                                <Input
                                    ref={breadsLessRef}
                                    type="number"
                                    placeholder="Enter..."
                                    value={breadsLess}
                                    onChange={(e) => setBreadsLess(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (totalLessRef.current) totalLessRef.current.focus();
                                            }, 100);
                                        }
                                    }
                                    }
                                />
                            </Col>

                            <Col span={2}>
                                <Text>Weight Less</Text>
                                <Input
                                    ref={totalLessRef}
                                    type="number"
                                    placeholder="Enter T..."
                                    value={finalTotalGrams > 0 ? finalTotalGrams : totalLess}
                                    onChange={(e) => setTotalLess(e.target.value)}
                                    readOnly={finalTotalGrams > 0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (nwtRef.current) nwtRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />

                            </Col>

                            {/* N.wt */}
                            <Col span={3}>
                                <Text>N.wt</Text>
                                <Input
                                    ref={nwtRef}
                                    type="number"
                                    value={nwt}
                                    readOnly
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (huidRef.current) huidRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={3}>
                                <Text>HUID</Text>
                                <Input
                                    ref={huidRef}
                                    type="text"
                                    placeholder="Enter HUID"
                                    value={huid}
                                    onChange={(e) => setHuid(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (tagSizeRef.current) tagSizeRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />
                            </Col>

                            {/* Tag Size */}
                            <Col span={3}>
                                <Text>Tag Size</Text>
                                <Input
                                    ref={tagSizeRef}
                                    type="text"
                                    placeholder="Enter Tag Size"
                                    value={tagSize}
                                    onChange={(e) => setTagSize(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (descriptionRef.current) descriptionRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />
                            </Col>

                            {/* Description */}
                            <Col span={5}>
                                <Text>Description</Text>

                                <Input
                                    ref={descriptionRef}
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setTimeout(() => {
                                                if (categoryRef.current) categoryRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                    <Row><span style={{ padding: "6px", fontWeight: "bold" }}>Wastage and Macking Charges</span></Row>
                    <Card bordered={false} style={{ backgroundColor: "lightblue" }} className="customeproductcard">
                        <Row gutter={16}>
                            {/* Category Dropdown */}
                            <Col xs={24} sm={4} style={{ marginTop: "20px" }}>
                                <Text strong>Category</Text>
                                <Select
                                    showSearch
                                    ref={categoryRef}
                                    value={selectedCategory}
                                    placeholder="%"
                                    onChange={handleCategoryChange}
                                    style={{ width: "100%", borderRadius: "8px" }}
                                    optionFilterProp="children"

                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {categories.map((category) => (
                                        <Option key={category.categoryname} value={category.categoryname}>
                                            {category.categoryname}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            {/* Wastage Section */}
                            <Col xs={24} sm={10}>
                                <Card bordered={false} style={{ background: "#F0F0F0", borderRadius: "8px", textAlign: "center" }}>
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Text>%</Text>
                                            <Input
                                                ref={percentageRef}
                                                value={wastageData[0]?.percentage || ""}
                                                placeholder="%"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{ ...wastageData[0], percentage: value, total: value ? ((parseFloat(value) * nwt) / 100).toFixed(3) : "" }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, directRef, null)}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text>Direct</Text>
                                            <Input
                                                ref={directRef}
                                                value={wastageData[0]?.direct || ""}
                                                placeholder="Direct"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{ ...wastageData[0], direct: value, total: parseFloat(value).toFixed(3) }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, perGramRef, percentageRef)}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text>Total</Text>
                                            <Input ref={totalRef} value={wastageData[0]?.total || ""} placeholder="Total" readOnly />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            {/* Making Charges Section */}
                            <Col xs={24} sm={10}>
                                <Card bordered={false} style={{ background: "#F0F0F0", borderRadius: "8px", textAlign: "center" }}>
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Text>Gram</Text>
                                            <Input
                                                ref={perGramRef}
                                                value={wastageData[0]?.perGram || ""}
                                                placeholder="Per Gram"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{ ...wastageData[0], perGram: value, newField2: (parseFloat(value) * nwt).toFixed(2) }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, direct1Ref, null)}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text>Direct</Text>
                                            <Input
                                                ref={direct1Ref}
                                                value={wastageData[0]?.newField1 || ""}
                                                placeholder="Direct"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWastageData([{ ...wastageData[0], newField1: value, newField2: (parseFloat(wastageData[0]?.perGram || 0) * nwt).toFixed(2) }]);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, total1Ref, perGramRef)}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text>Total</Text>
                                            <Input ref={total1Ref} value={parseFloat(wastageData[0].newField1) > 0 ? wastageData[0].newField1 : ((parseFloat(wastageData[0].total) + nwt) * parseFloat(wastageData[0].perGram)).toFixed(2) || ""}
                                                placeholder="Total" readOnly />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                    <Row><span style={{ padding: "6px", fontWeight: "bold" }}>Stone Detailes</span></Row>

                    <Card style={{ backgroundColor: "lightblue" }} className="customeproductcard">
                        <Row gutter={[8, 8]}>
                            <Col span={4}>
                                <Text style={{ display: "block" }}>Stone Item</Text>
                                <Select
                                    ref={stoneItemRef}
                                    showSearch
                                    value={formValues.stoneItem || stoneItemInputValue}
                                    placeholder="Select Stone"
                                    onChange={handleStoneChange}
                                    onSelect={handleStoneSelect}
                                    style={{ width: "100%" }}
                                    onSearch={(value) => {
                                        setStoneItemInputValue(value);
                                        setHighlightedIndex(0);
                                    }}
                                    onKeyDown={handleStoneKeyDown}
                                    filterOption={false}
                                    defaultActiveFirstOption={false}
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
                                    {filteredOptions.map((item, index) => (
                                        <Option
                                            key={item.ITEMCODE}
                                            value={item.ITEMNAME}
                                            className={index === highlightedIndex ? "highlighted-option" : ""}
                                        >
                                            {item.ITEMNAME}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            {[
                                { name: "pcs", placeholder: "Enter Pcs", ref: pcssRef },
                                { name: "cts", placeholder: "Enter Cts" },
                                { name: "grams", placeholder: "Enter Grams" },
                                { name: "rate", placeholder: "Enter Rate", ref: rateRef },
                                { name: "amount", placeholder: "Auto-calculated", readOnly: true },
                                { name: "noPcs", placeholder: "Enter No. Pcs", ref: noPcsRef },
                                { name: "color", placeholder: "Enter Color", ref: colorRef },
                                { name: "cut", placeholder: "Enter Cut", ref: cutRef },
                                { name: "clarity", placeholder: "Enter Clarity", ref: clarityRef },
                            ].map(({ name, placeholder, readOnly = false, ref }) => (
                                <Col span={4} key={name}>
                                    <Text>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
                                    <Input
                                        name={name}
                                        value={formValues[name]}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleEnterPress(e, name)}
                                        placeholder={placeholder}
                                        readOnly={readOnly}
                                        ref={ref}
                                    />
                                </Col>
                            ))}
                            <Button type="primary" onClick={() => { handleAddStone(); mainProductRef.current.focus(); }} style={{ marginTop: "20px" }}>
                                Submit
                            </Button>
                        </Row>
                    </Card>
                    <Card className="customeproductcard">

                        <Table
                            scroll={{ x: "max-content" }}
                            className="custom-table"
                            size="small"
                            columns={columns2}
                            dataSource={stoneData}
                            pagination={false}
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}><b>Total</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} />
                                    <Table.Summary.Cell index={2} align="right"><b>{getTotal("pcs")}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right"><b>{getTotal("cts")}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right"><b>{getTotal("grams")}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} />
                                    <Table.Summary.Cell index={6} align="right"><b>{getTotal("amount")}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} align="right"><b>{getTotal("noPcs")}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} />
                                    <Table.Summary.Cell index={9} />
                                    <Table.Summary.Cell index={10} />
                                    <Table.Summary.Cell index={11} />
                                    <Table.Summary.Cell index={12} />
                                    <Table.Summary.Cell index={13} />
                                    <Table.Summary.Cell index={14} />
                                    <Table.Summary.Cell index={15} />
                                    <Table.Summary.Cell index={16} />
                                </Table.Summary.Row>
                            )}
                        />
                        <Row justify="start" style={{ marginTop: "5px", marginBottom: "10px" }}>

                            <Tag color="#32523A" style={tagStyle}>            Total Grms: {finalTotalGrams}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>            Total Dia Amount: {totalDiaAmount}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total Diamond Cts: {totalDiamondCts}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total CTS: {totalCTS}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total Uncuts: {totalUncuts}
                            </Tag>
                        </Row>
                        <Row justify="end" style={{ marginTop: "10px" }}>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh1}
                                style={{ backgroundColor: "#f5222d", color: "white", border: "none", marginRight: "8px" }}
                            />
                            <Button type="primary" onClick={handleOk}>
                                OK
                            </Button>

                        </Row></Card>
                </Card>

            </Modal>
        </div>

    );
};

export default EstimationTable;
