import React, { useCallback, useRef, useState, useEffect } from "react";
import { Form, Table, Button, Col, Row, Input, Card, Typography, Tag, message, Popover, Popconfirm, Modal, Select, Checkbox, } from "antd";
import { DeleteOutlined, InfoCircleOutlined, FolderAddOutlined, PlusOutlined, ReloadOutlined, CloseOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import TodaysRates1 from "./TodaysRate1";
import axios from 'axios';
const loadingIcon = <LoadingOutlined style={{ color: "red", fontSize: 16 }} spin />; // Customize color and size

const { Option } = Select;
const { Text, } = Typography;
const EstimationTable = () => {
    const tagStyle = {
        fontSize: "12px",
        padding: "6px 12px",
        borderRadius: "16px",
        fontWeight: "bold",
        color: "white",
    };
    const snostyle = {
        backgroundColor: "#78ec95", // Light gray background
        fontWeight: "bold",
        textAlign: "center"

    };
    const [ratesAvailable, setRatesAvailable] = useState(false); // Track rate availability
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef(null);

    const modalRef = useRef(null);
    const [tagNo, setTagNo] = useState("");
    const [data, setData] = useState([]);
    console.log("Data", data)
    const [, setStoneDetailes] = useState([]);
    const [, setVisible] = useState(false);
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
    const custNameRef = useRef(null);
    const mobileRef = useRef(null);
    const [customerData, setCustomerData] = useState(null);
    console.log("customerData", customerData);
    const [form] = Form.useForm();
    const [stoneItemInputValue, setStoneItemInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [rates, setRates] = useState([]); // Store rates data
    const [visibleDetailes, setVisibleDetailes] = useState(false);

    useEffect(() => {
        if (visibleDetailes) {
            setTimeout(() => {
                custNameRef.current?.focus();
            }, 100); // Small delay to ensure focus after modal opens
        }
    }, [visibleDetailes]);
    const handleKeyPressc = (event, nextFieldRef) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (nextFieldRef) {
                nextFieldRef.current.focus();
            } else {
                form.submit();
            }
        }
    };

    const handleSubmit1 = (values) => {
        setCustomerData(values);
        setVisibleDetailes(false);
        form.resetFields();
    };

    const handleStoneChange = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
        setStoneItemInputValue(""); // ✅ Clears input after selection
    };
    const [estimationNo, setEstimationNo] = useState("");

    useEffect(() => {
        fetchEstimationNo();
    }, []);
    const fetchEstimationNo = async () => {
        try {
            const response = await fetch(
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/GetSchemeMaxNumberInTable?tableName=ESTIMATION_MAST&column=ESTIMATIONNO",
                {
                    headers: {
                        tenantName: "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="
                    }
                }
            );
            const data = await response.json();
            const maxEstimationNo = parseInt(data[0]?.Column1 ?? 0, 10); // If null, set to 0
            const newEstimationNo = maxEstimationNo + 1;
            console.log("Fetched Estimation No:", newEstimationNo); // Log the fetched number
            setEstimationNo(newEstimationNo); // Increment by 1
        } catch (error) {
            console.error("Error fetching estimation number:", error);
        }
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
    const ctsRef = useRef(null);
    const gramsRef = useRef(null);
    const amountRef = useRef(null);

    const handleEnterPress = (e, fieldName) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (fieldName === "pcs") {
                if (!formValues.pcs || formValues.pcs.trim() === "") {
                    ctsRef.current?.focus();
                } else {
                    rateRef.current?.focus(); // Move to Rate if pcs has a value
                }
            } else if (fieldName === "cts") {
                if (!formValues.cts || formValues.cts.trim() === "") {
                    gramsRef.current?.focus(); // Move to Grams if Cts is empty
                } else {
                    rateRef.current?.focus(); // Move to Rate if Cts has a value
                }
            } else if (fieldName === "grams") {
                if (!formValues.grams || formValues.grams.trim() === "") {
                    rateRef.current?.focus(); // Move to Rate if Grams is empty
                } else {
                    rateRef.current?.focus(); // Move to Rate if Cts has a value
                }
            } else if (fieldName === "rate") {
                noPcsRef.current?.focus(); // Move to No Pcs
            } else if (fieldName === "noPcs") {

                handleAddStone(); // Submit Form
                stoneItemRef.current?.focus();

            } else if (fieldName === "cut") {
                colorRef.current?.focus();
            } else if (fieldName === "color") {
                clarityRef.current?.focus();
            } else if (fieldName === "clarity") {
                handleAddStone(); // Submit Form
                stoneItemRef.current?.focus();
            }
        }
    };


    const handleAddStone = () => {
        // if (!formValues.rate) {
        //     alert("Enter required fields.");
        //     return;
        // }

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
        {
            title: "S.No", key: "sno", onHeaderCell: () => ({ style: snostyle }),
            onCell: () => ({ style: snostyle }), render: (_, __, index) => index + 1
        },
        { title: "Stone Item", dataIndex: "stoneItem", key: "stoneItem" },
        { title: "Pcs", dataIndex: "pcs", key: "pcs", align: "right" },
        { title: "Cts", dataIndex: "cts", key: "cts", align: "right", render: (text) => text ? parseFloat(text)?.toFixed(3) : "" },
        { title: "Grams", dataIndex: "grams", key: "grams", align: "right", render: (text) => text ? parseFloat(text)?.toFixed(3) : "" },
        { title: "Rate", dataIndex: "rate", key: "rate", align: "right" },
        { title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", align: "right" },
        { title: "Color", dataIndex: "color", key: "color" },
        { title: "Cut", dataIndex: "cut", key: "cut" },
        { title: "Clarity", dataIndex: "clarity", key: "clarity" },
        { title: "Amount", dataIndex: "amount", key: "amount", align: "right", render: (value) => Math.ceil(value) },

        // {
        //     title: "Cts-Grams",
        //     key: "ctsToGrams",
        //     align: "right",
        //     render: (_, record) => {
        //         const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        //         if (item && item.DIAMONDS) {
        //             return "0.000"; // Show zero if diamonds exist
        //         }
        //         if (!isNaN(parseFloat(record.grams)) && parseFloat(record.grams) !== 0) {
        //             return "0.000"; // Show zero if grams exist
        //         }
        //         if (item && item.EFFECTON_GOLD) {
        //             return (parseFloat(record.cts) / 5)?.toFixed(3) || "0.000";
        //         }
        //         return !isNaN(parseFloat(record.cts)) ? parseFloat(record.cts)?.toFixed(3) : "0.000";
        //     },
        // },
        // {
        //     title: "Dia Cts", key: "diaCts", align: "right", render: (_, record) => {
        //         const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        //         return item && item.DIAMONDS ? parseFloat(record.cts)?.toFixed(3) : "";
        //     }
        // },
        // {
        //     title: "Dia Amt", key: "diaAmount", align: "right", render: (_, record) => {
        //         const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        //         return item && item.DIAMONDS ? parseFloat(record.amount)?.toFixed(2) : "";
        //     }
        // },
        // {
        //     title: "CTS", key: "ctsCol", align: "right", render: (_, record) => {
        //         const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        //         return item && item.CTS ? parseFloat(record.cts)?.toFixed(3) : "";
        //     }
        // },
        // {
        //     title: "Uncuts", key: "uncutsCol", align: "right", render: (_, record) => {
        //         const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        //         return item && item.UNCUTS ? parseFloat(record.cts)?.toFixed(3) : "";
        //     }
        // },
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
            console.log("selectedOption", selectedOption)
            if (selectedOption) {
                setWastageData([{ key: "1", percentage: selectedOption.wastage, direct: selectedOption.directwastage?.toFixed(3), total: parseFloat(selectedOption.directwastage) > 0 ? selectedOption.directwastage?.toFixed(3) : ((selectedOption.wastage * nwt) / 100 + selectedOption.directwastage)?.toFixed(3), perGram: selectedOption.makingcharges?.toFixed(2), newField1: selectedOption.directmc?.toFixed(2), newField2: (selectedOption.makingcharges * nwt)?.toFixed(2) }]);
            }
        }
    };
    useEffect(() => {
        if (selectedCategory === "OTHERS" && percentageRef.current) {
            percentageRef.current.focus();
        }
        if (selectedCategory !== "OTHERS" && stoneItemRef.current) {
            stoneItemRef.current.focus();
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
    useEffect(() => {
        form.setFieldsValue({
            customerName: customerData?.customerName,
            mobileNumber: customerData?.mobileNumber
        });
    }, [customerData, form]);

    // Function to reset table data and totals
    const handleRefresh = () => {
        setRotating(true); // Start rotation effect
        setTimeout(() => setRotating(false), 1000); // Stop rotation after 1s
        setData([]); // Clear table data
        setTagNo(""); // Clear Tag No input
        setEstimationNo();
        fetchEstimationNo();
        setCustomerData("");
    };
    const [visibleHis, setVisiblehis] = useState(false);

    const [datahis, setDatahis] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    console.log("filterData", filteredData)

    const [loading, setLoading] = useState(false);

    // Fetch data from API
    const fetchDataHis = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithOrder",
                {
                    params: { tableName: "ESTIMATION_MAST", order: "ESTIMATIONNO" },
                    headers: {
                        tenantName: "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=",
                    },
                }
            );
            setDatahis(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };
    // Open modal and fetch data
    const showModal = () => {
        setVisiblehis(true);
        fetchDataHis();
        if (tagNoInputRef.current) {
            tagNoInputRef.current.focus();
        }
        
    };
    const showModal1 = () => {
        setVisibleDetailes(true);
        if (tagNoInputRef.current) {
            tagNoInputRef.current.focus();
        }
    };
    // Handle search input change




    // const handleKeyPress = useCallback((e) => {
    //     if (e.key === 'Enter') {
    //         if (debounceRef.current) clearTimeout(debounceRef.current);
    //         debounceRef.current = setTimeout(() => {
    //             fetchData();
    //         }, 300); // 300ms debounce time
    //     }
    // }, [fetchData]);

    // useEffect(() => {
    //     if (tagNoInputRef.current) {
    //         tagNoInputRef.current.focus();
    //     }
    // }, [estimationNo,]);

    useEffect(() => {
        if (tagNoInputRef.current) {
            tagNoInputRef.current.focus();
        }
    }, [estimationNo, visibleHis, visibleDetailes, isProductModalOpen,]);
    useEffect(() => {
        const handleClick = (event) => {
            if (tagNoInputRef.current && modalRef.current && !modalRef.current.contains(event.target)) {
                tagNoInputRef.current.focus();
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);
    useEffect(() => {
        fetchRates();
    }, []);

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

            const hasRates = ratesResponse.data.length > 0;
            setRates(ratesResponse.data);
        } catch (error) {
            message.error("Error fetching rates");
        }
    };

    const [vat, setVat] = useState(0);

    const trimmedTagNo = parseInt(tagNo);
    const existingTagNos = data.map((item) => item.tagNo);
    const fetchData = useCallback(async () => {
        if (!tagNo) {
            message.error("Please enter a Tag No.");
            return;
        }

        console.log("existingTagNos", existingTagNos)
        if (existingTagNos.includes(trimmedTagNo)) {
            message.warning("This Tag No. is already added to the table.");
            setTagNo("");
            return;
        }

        try {
            setIsLoading(true);
            setTagNo(null);
            // Ensure rates are available before proceeding
            if (rates.length === 0 && !ratesAvailable) {
                message.warning("Fetching rates. Please wait...");
                return;
            }
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

            if (rates.length === 0) {
                message.warning("Rates not available. Cannot proceed.");
                return;
            }

            // Fetch daily rates
            const ratesResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );
            const allRates = ratesResponse.data;

            // Fetch additional item details for the tag
            const tagItemsResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=TAG_ITEMS&where=TAGNO%3D${trimmedTagNo}&order=SNO`
            );
            const tagItemsData = tagItemsResponse.data;

            const processedData = responseData.map((item, index) => {
                const lessWeight = item.GWT - item.NWT;
                const totalWastage = item.WASTAGE > 0 ? (item.NWT * item.WASTAGE) / 100 : item.DIRECTWASTAGE;
                const actWt = item.NWT + totalWastage;
                const rateItem = allRates.find(rate => rate.PREFIX === item.PREFIX);
                const rate = rateItem ? rateItem.RATE : item.RATE;

                const metalValue = actWt * rate;
                const totalMC = item.MAKINGCHARGES > 0 ? actWt * item.MAKINGCHARGES : item.DIRECTMC;
                const amount = metalValue + totalMC + item.ITEM_TOTAMT;

                // Merge item details from TAG_ITEMS API response
                const tagItemDetails = tagItemsData.filter(tagItem => tagItem.TAGNO === item.TAGNO);

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
                    productCode: item.PRODUCTCODE,
                    productCategory: item.PRODUCTCATEGORY,
                    iteM_CTS: item.Item_Cts,
                    iteM_DIAMONDS: item.Item_diamonds,
                    diamonD_AMOUNT: item.diamonD_AMOUNT || item.Diamond_Amount || 0,
                    iteM_UNCUTS: item.Item_Uncuts,
                    hsncode: item.HSNCODE,
                    brandName: item.BRANDNAME,
                    tagItemDetails, // Store additional item details
                };
            });

            // Ensure all records belong to the same MNAME
            const firstRecordMName = data.length > 0 ? data[0].mainProduct : null;
            const newMName = processedData[0].mainProduct;


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
                setVat(matchedVatRecord.VAT);
                console.log("Matched VAT Record:", matchedVatRecord.VAT);
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            setIsLoading(false);
            setTagNo("");
        }
    }, [tagNo, data, rates, existingTagNos, trimmedTagNo]);
    // Ensure calculations use valid numbers

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                fetchData();
            }, 300); // 300ms debounce time
        }
    }, [fetchData]);
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
            const generateHomeKey = () => {
                return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a unique 4-digit number
            };
            // Example usage:
            const homeKey = generateHomeKey();
            // Find selected product details
            const selectedProductDetails = products.find(product => product.PRODUCTNAME === selectedProduct);
            const productCategory = selectedProductDetails?.PRODUCTCATEGORY || "";
            const productCode = selectedProductDetails?.PRODUCTCODE || "";
            const hsncode = selectedProductDetails?.HSNCODE || "";

            const newData = {
                key: `${selectedMainProduct}-${selectedProduct}-${pcs}-${gwt}-${nwt}`,
                sno: data.length + 1,
                homeKey,
                mainProduct: selectedMainProduct,
                categoryName: selectedCategory,
                purity: selectedPurity, // Store selected purity (prefix)
                productName: selectedProduct,
                productCategory,
                productCode,
                hsncode,
                pieces: pcs,
                grossWeight: gwt,
                wastage: wastageData[0]?.percentage,
                lessWeight: (gwt - nwt)?.toFixed(3),
                netWeight: nwt,
                totalWastage: totalWastage?.toFixed(3),
                makingCharges: wastageData[0]?.perGram || "",
                directMC: wastageData[0]?.newField1 || "",
                directWastage: wastageData[0]?.direct || "",
                totalMC: totalMC?.toFixed(2),
                actWt: actWt?.toFixed(3), // Add ActWt (NetWt + TotalWastage)
                metalValue: metalValue?.toFixed(2), // Add Metal Value (ActWt * Rate)
                rate: rate, // Store the rate used
                stoneCost: totalStoneCost, // Include total stone amount
                amount: amount, // ✅ Final Amount (Metal Value + MC + Stone Cost)
                stoneData: stoneData.map(stone => ({
                    ...stone,
                    homeKey // ✅ Assign the same homeKey to all stone items
                })), totals: calculateTotals(), // Include table data and totals
                huid,
                tagSize,
                description,
                iteM_CTS: totalCTS,
                iteM_DIAMONDS: totalDiamondCts,
                diamonD_AMOUNT: totalDiaAmount,
                iteM_UNCUTS: totalUncuts,
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
    // useEffect(() => {
    //     if (nwt && wastageData.length > 0) {
    //         const updatedTotalWastage = ((parseFloat(wastageData[0].percentage || 0) * nwt) / 100).toFixed(3);
    //         setWastageData([{ ...wastageData[0], total: updatedTotalWastage }]);
    //     }
    // }, [gwt, nwt, wastageData[0]?.percentage]);
    useEffect(() => {
        if (nwt && wastageData.length > 0) {
            const updatedTotalWastage = ((parseFloat(wastageData[0].percentage || 0) * nwt) / 100).toFixed(3);
            setWastageData((prevWastageData) =>
                prevWastageData.length > 0
                    ? [{ ...prevWastageData[0], total: updatedTotalWastage }]
                    : prevWastageData
            );
        }
    }, [gwt, nwt, wastageData]);

    useEffect(() => {
        setNwt(gwt - totalLess);
    }, [gwt, totalLess]);

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
                                        <div style={{ textAlign: "right" }}>{record?.totalMC ? Math.round(record.totalMC) : "N/A"}</div>
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
    const handleSubmit = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning("Please select an estimation record.");
            return;
        }

        const selectedEstimationNo = selectedRowKeys[0];
        const custData = filteredData.filter(item => item.EstimationNo === selectedEstimationNo);
        console.log("custData", custData);
        try {
            // Fetch Estimation Data

            const response = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO%3D${selectedEstimationNo}`
            );
            console.log("resp", response);
            if (!response.data.length) {
                message.warning("No data found for the selected Estimation No.");
                return;
            }

            // Fetch Daily Rates
            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getDate().toString().padStart(2, "0")}/${currentDate.getFullYear()}`;

            const ratesResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );
            const allRates = ratesResponse.data || [];

            // Fetch Estimation Items (Tag Item Details)
            const tagItemsResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=ESTIMATION_ITEMS&where=ESTIMATIONNO%3D${selectedEstimationNo}`
            );
            const tagItems = tagItemsResponse.data || [];

            setEstimationNo(selectedEstimationNo);


            // Process Data & Map to Table Structure
            const processedData = response.data.map((item, index) => {
                const grossWeight = parseFloat(item.Gwt) || 0;
                const netWeight = parseFloat(item.Nwt) || 0;
                const lessWeight = grossWeight - netWeight;

                const wastagePercent = parseFloat(item.Wastage) || 0;
                const directWastage = parseFloat(item.DirectWastage) || 0;
                const totalWastage = wastagePercent > 0 ? (netWeight * wastagePercent) / 100 : directWastage;
                const actWt = netWeight + totalWastage;

                const rateItem = allRates.find((rate) => rate.PREFIX === item.Prefix);
                const rate = parseFloat(rateItem?.RATE) || parseFloat(item.Rate) || 0;
                const metalValue = actWt * rate;

                const makingCharges = parseFloat(item.MakingCharges) || 0;
                const directMC = parseFloat(item.DirectMc) || 0;
                const totalMC = makingCharges > 0 ? actWt * makingCharges : directMC;

                const stoneCost = parseFloat(item.Itemamt) || 0;
                const amount = metalValue + totalMC + stoneCost;

                return {
                    key: `${item.EstimationNo}-${index}`,
                    sno: index + 1,
                    tagNo: parseFloat(item.TagNo) || 0,
                    mainProduct: item.Mname || "N/A",
                    homeKey: Number(item.Homekey),
                    productName: item.ProductName || "N/A",
                    productCode: item.ProductCode || "N/A",
                    productCategory: item.ProductCategory || "N/A", // ✅ Added missing field
                    purity: item.Prefix || "N/A",
                    pieces: parseFloat(item.Pieces) || 0,
                    grossWeight: grossWeight.toFixed(3),
                    lessWeight: lessWeight.toFixed(3),
                    netWeight: netWeight.toFixed(3),
                    rate: rate.toFixed(2),
                    metalValue: metalValue.toFixed(2),
                    stoneCost: stoneCost.toFixed(2),
                    totalWastage: totalWastage.toFixed(3),
                    actWt: actWt.toFixed(3),
                    totalMC: Math.round(totalMC),
                    amount: Math.round(amount),
                    directWastage: directWastage.toFixed(3),
                    wastage: wastagePercent.toFixed(2),
                    makingCharges: makingCharges.toFixed(2),
                    directMC: directMC.toFixed(2),
                    // counterName: item.CounterName || "N/A",
                    hsncode: item.HSNCODE || "-",
                    brandName: item.BrandName || "N/A",
                    description: item.descrption || "N/A", // ✅ Fixed: Corrected from 'descrption'
                    tagItemDetails: tagItems.filter((t) =>
                        t.EstimationNo === item.EstimationNo &&
                        // t.TagNo === item.TagNo &&
                        t.HomeKey === item.Homekey
                    ),                          // ✅ Additional Fields from API (Mapped Correctly)
                    estimationNo: item.EstimationNo || "N/A",

                    brandAmount: parseFloat(item.BrandAmt) || 0,
                    totalAmount: parseFloat(item.Totamt) || 0,
                    estimationDate: item.EstDate || "N/A",
                    estimationTime: item.EstTime || "N/A",
                    tray: item.Tray || false,
                    tagDate: item.TagDate || "N/A",
                    dealerName: item.DealerName || "N/A",
                    counterName: item.CounterName || "N/A",
                    prefix: item.Prefix || "N/A",
                    suspence: item.Suspence || "No",
                    smCode: item.SMCode || "N/A",
                    less_Wper: parseFloat(item.Less_Wper) || 0,
                    discountAmount: parseFloat(item.DisAmt) || 0,
                    itemCts: parseFloat(item.ITEM_CTS) || 0,
                    itemDiamonds: parseFloat(item.ITEM_DIAMONDS) || 0,
                    itemUncuts: parseFloat(item.ITEM_UNCUTS) || 0,
                    diamondAmount: parseFloat(item.DIAMOND_AMOUNT) || 0,
                    labReport: item.LABREPORT || false,
                    huid: item.HUID || "N/A",
                    tagSize: item.tagsize || "N/A",
                    purchaseNo: parseFloat(item.PURCHNO) || 0,
                    purchaseAmount: parseFloat(item.PAMT) || 0,
                };
            });

            setData(processedData);
            // tagNoInputRef.current.focus();
            if (tagNoInputRef.current) {
                tagNoInputRef.current.focus();
            }
            setCustomerData(() => ({
                customerName: custData[0].CustName,
                mobileNumber: custData[0].MOBILENO
            }));


            setVisiblehis(false);
            setSelectedRowKeys([]);
            setSearchText("");
            setFilteredData(datahis);

        } catch (error) {
            console.error("Error fetching Estimation data:", error);
            message.error("Error fetching Estimation data.");
        }
    };

    const columns = [
        {
            title: "S.No", className: 'blue-background-column',
            dataIndex: "sno", key: "sno", render: (_, __, index) => index + 1
        },
        {
            title: "Tag No", dataIndex: "tagNo", key: "tagNo", render: (text) => <strong>{text}</strong>,
        },

        {
            title: "Actions",
            key: "actions",

            align: "center",
            render: (_, record) => {
                console.log("Row data:", record); // Debugging missing fields
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
        {
            title: "Gross.WT", className: 'blue-background-column',
            dataIndex: "grossWeight", align: 'right', key: "grossWeight", render: (text) => <strong>{Number(text)?.toFixed(3)}</strong>
        },
        { title: "Less W.T", dataIndex: "lessWeight", align: 'right', key: "lessWeight", render: (text) => Number(text)?.toFixed(3) },
        {
            title: "Net.WT", className: 'blue-background-column',
            dataIndex: "netWeight", align: 'right', key: "netWeight", render: (text) => <strong>{Number(text)?.toFixed(3)}</strong>
        },
        { title: "Rate", dataIndex: "rate", align: 'right', key: "rate" },
        // { title: "Total Wastage", dataIndex: "totalWastage", align: 'right', key: "totalWastage", render: (text) => Number(text)?.toFixed(3) },
        // { title: "ACT W.T", dataIndex: "actWt", align: 'right', key: "actWt", render: (text) => Number(text)?.toFixed(3) },
        { title: "Metal Value", dataIndex: "metalValue", align: 'right', key: "metalValue" },
        // { title: "Total MC", dataIndex: "totalMC", align: 'right', key: "totalMC", render: (text) => Math.round(text) },
        { title: "Stone Cost", dataIndex: "stoneCost", align: 'right', key: "stoneCost" },
        {
            title: "Amount", className: 'blue-background-column',
            dataIndex: "amount", align: 'right', key: "amount", render: (text) => <strong>{Math.round(text)}</strong>
        },
        // { title: "Direct Wastage", align: 'right', dataIndex: "directWastage", key: "directWastage" },
        // { title: "Wastage", dataIndex: "wastage", align: 'right', key: "wastage" },
        // { title: "MC/Gram", dataIndex: "makingCharges", align: 'right', key: "makingCharges" },
        // { title: "Direct MC", dataIndex: "directMC", align: 'right', key: "directMC" },

    ];
    const [searchText, setSearchText] = useState("");
    // Auto-focus search field when modal opens
    // Auto-focus search field when modal opens (with delay to ensure rendering)
    useEffect(() => {
        if (visibleHis) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100); // Small delay ensures React renders input before focusing
        }
    }, [visibleHis]);

    const handleSearch = (value) => {
        setSearchText(value);

        if (!datahis || datahis.length === 0) return; // Ensure data exists

        const filtered = datahis.filter(item =>
            item.EstimationNo?.toString().toLowerCase().includes(value.toLowerCase()) // Case-insensitive search
        );

        setFilteredData(filtered);

        // Automatically select the matching record if there's an exact match
        const exactMatch = datahis.find(item => item.EstimationNo?.toString() === value);
        setSelectedRowKeys(exactMatch ? [exactMatch.EstimationNo] : []);
    };


    // Define table columns
    const columns3 = [
        {
            title: "S.No",
            dataIndex: "sno",
            width: 50,
            key: "sno",
            className: 'blue-background-column',
            render: (_, __, index) => index + 1,
        },
        {
            title: "",
            dataIndex: "checkbox",
            width: 50,
            key: "checkbox",
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.EstimationNo)}
                    onChange={() => handleCheckboxChange(record.EstimationNo)}
                />
            ),
        },
        {
            title: "Estimation No", dataIndex: "EstimationNo", key: "EstimationNo", className: 'blue-background-column', render: (text) => (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{text}</span>
            ),
        },
        { title: "Cust Name", dataIndex: "CustName", key: "CustName" },
        { title: "Mobile No", dataIndex: "MOBILENO", key: "MOBILENO" },

        { title: "Est Date", dataIndex: "EstDate", key: "EstDate", render: (text) => text ? new Date(text).toLocaleDateString('en-GB').replace(/\//g, '-') : "N/A" },
        { title: "Total Pcs", dataIndex: "TotPces", key: "TotPces", align: "right" },
        { title: "GWt", dataIndex: "GWT", key: "GWT", align: "right", render: (text) => Number(text).toFixed(3) },
        { title: "NWt", dataIndex: "Nwt", key: "Nwt", align: "right", render: (text) => Number(text).toFixed(3) },
        { title: "Net Amt", dataIndex: "NetAmt", key: "NetAmt", align: "right" },
    ];

    const handleCheckboxChange = (estimationNo) => {
        setSelectedRowKeys((prevSelectedRowKeys) => {
            let newKeys;
            if (prevSelectedRowKeys.includes(estimationNo)) {
                newKeys = prevSelectedRowKeys.filter((key) => key !== estimationNo);
            } else {
                newKeys = [estimationNo]; // Allow only one selection
            }
            setSearchText(newKeys.join(", ")); // Update input field
            return newKeys;
        });
    };


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const jewelType = data.length > 0 ? data[0].mainProduct : "";
    const handleSave = async () => {
        setIsSaving(true); // Disable button to prevent duplicate requests

        if (!data || !Array.isArray(data) || data.length === 0) {
            message.error("No estimation data found.");
            setIsSaving(false);
            return;
        }

        // Master Payload
        const payloadMaster = {
            estimationNo: String(estimationNo), // Convert estimationNo to string
            gold: 0,
            platinum: 0,
            silver: 0,
            pure: 0,
            nonKDM: 0,
            cT_18: 0,
            grandTotal: Math.ceil(Number(totals.totalAmount)),
            vatAmt: Math.ceil(Number(gstAmount)),
            grossAmt: Math.ceil(Number(grossAmount)),
            discountPer: discount || 0,
            discountAmt: discount ? (grossAmount * discount) / 100 : 0,
            netAmt: Math.ceil(Number(netAmount)),
            estDate: new Date().toISOString(),
            estTime: new Date().toISOString(),
            totPces: totals.totalPcs,
            gwt: totals.totalGrossWeight?.toFixed(3),
            nwt: totals.totalNetWeight?.toFixed(3),
            watage: totals.totalWastage?.toFixed(3),
            totMc: Math.round(Number(totals.totalMakingCharges)),
            totAmount: Math.round(Number(totals.totalAmount)),
            itemAmount: totals.totalStoneCost,
            custName: customerData?.customerName || "N/A",
            jewelType,
            billNo: 0,
            saleCode: 0,
            e_PREFIX: "string",
            smCode: "string",
            descrption: "string",
            iteM_CTS: 0,
            iteM_DIAMONDS: 0,
            iteM_UNCUTS: 0,
            diamonD_AMOUNT: 0,
            exciseduty: 0,
            exciseamount: 0,
            totadvance: 0,
            totpaid: 0,
            totbalance: 0,
            purchamt: 0,
            city: "string",
            mobileno: customerData?.mobileNumber || "N/A", purchno: 0,
            pamt: 0,
        };

        // Details Payload
        const payloadDataInsert = data.map((item) => ({
            estimationNo: String(estimationNo), // Use the fetched estimation number
            tagNo: Number(item.tagNo) || 0,
            homekey: item.homeKey ?? 0,
            mname: item.mainProduct || "string",
            productName: item.productName || "string",
            pieces: Number(item.pieces) || 0,
            gwt: Number(item.grossWeight) || 0,
            nwt: Number(item.netWeight) || 0,
            categoryName: item.categoryName || "string",
            wastage: String(item.wastage || "0"),
            directWastage: String(item.directWastage || "0"),
            cattotwast: String(item.totalWastage || "0"),
            makingCharges: String(item.makingCharges || "0"),
            directMc: String(item.directMC || "0"),
            cattotMc: String(item.totalMC || "0"),
            brandName: item.brandName || "string",
            brandAmt: Number(item.brandAmt) || 0,
            amount: Number(item.amount) || 0,
            itemamt: Number(item.stoneCost) || 0,
            totamt: Number(item.amount) || 0,
            estDate: new Date().toISOString(),
            estTime: new Date().toISOString(),
            rate: Number(item.rate) || 0,
            tray: !!item.tray,
            tagDate: new Date().toISOString(),
            productCategory: item.productCategory || "string",
            productCode: item.productCode || "string",
            counterName: item.counterName || "string",
            prefix: item.purity || "string",
            suspence: item.suspence || "No",
            smCode: item.smCode || "sravs",
            less_Wper: Number(item.less_Wper) || 0,
            disAmt: Number(item.disAmt) || 0,
            descrption: item.description || item.DESC1 || "Default Description",
            huid: item.huid || "string",
            tagsize: item.tagSize || "string",
            hsncode: item.hsncode || "string",
            pvalue: Number(item.pvalue) || 0,
            purchno: Number(item.purchno) || 0,
            pamt: Number(item.pamt) || 0,
            iteM_CTS: Number(item.iteM_CTS) || 0,
            iteM_DIAMONDS: Number(item.iteM_DIAMONDS) || 0,
            diamonD_AMOUNT: Number(item.diamonD_AMOUNT) || Number(item.Diamond_Amount
            ) || 0,
            iteM_UNCUTS: Number(item.iteM_UNCUTS) || 0,
            labreport: Boolean(item.labreport),
            dealerName: item?.DEALERNAME || "string",
        }));

        // Third API Payload (Estimation Items)
        const payloadItemsInsert = data.flatMap((item) => [
            // Include stoneData
            ...(item.stoneData && item.stoneData.length > 0
                ? item.stoneData.map((stone, index) => ({
                    estimationNo: String(estimationNo),// Use the fetched estimation number
                    tagNo: Number(item.tagNo) || 0,
                    sno: index + 1,
                    itemName: stone.stoneItem || "string",
                    pieces: Number(stone.pcs) || 0,
                    cts: Number(stone.cts) || 0,
                    grms: Number(stone.grams) || 0,
                    rate: Number(stone.rate) || 0,
                    amount: Number(stone.amount) || 0,
                    homeKey: Number(item.homeKey) || 0,
                    cut: stone.cut || "N/A",
                    colour: stone.color || "N/A",
                    clarity: stone.clarity || "N/A",
                    noPcs: Number(stone.noPcs) || 0, // Added noPcs field
                }))
                : []
            ),

            // Include tagItemDetails
            ...(item && item.tagItemDetails
                ? item.tagItemDetails.map((tagItem, index) => ({
                    estimationNo: String(estimationNo), // Use the fetched estimation number
                    tagNo: Number(item.tagNo) || Number(item.TagNo) || 0,
                    sno: (item.stoneData?.length || 0) + index + 1, // Ensure unique sno
                    itemName: tagItem.ITEMNAME || tagItem.ItemName || "string",
                    pieces: Number(tagItem.PIECES || tagItem.pieces) || 0,
                    cts: Number(tagItem.CTS) || Number(tagItem.Cts) || 0,
                    grms: Number(tagItem.GRMS) || Number(tagItem.Grms) || 0,
                    rate: Number(tagItem.RATE) || Number(tagItem.Rate) || 0,
                    amount: Number(tagItem.AMOUNT) || Number(tagItem.Amount) || 0,
                    noPcs: Number(tagItem.NO_PCS) || Number(tagItem.NoPcs) || 0,
                    colour: tagItem.COLOUR || tagItem.Colour || "N/A", // Ensure Colour is provided
                    cut: tagItem.CUT || tagItem.Cut || "N/A", // Ensure Cut is provided
                    clarity: tagItem.CLARITY || tagItem.Clarity || "N/A", // Ensure Clarity is provided
                    homeKey: Number(item.homeKey) || Number(item.HomeKey) || 0,
                }))
                : []
            )

        ]);

        try {
            const headers = {
                "Content-Type": "application/json",
                "tenantName": "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=",
            };
            // 🔹 Step 1: Delete Existing Estimation Data (Ensuring Clean Insert)
            await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_ITEMS&where=ESTIMATIONNO%3D${estimationNo}`,
                { headers }
            );
            await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO%3D${estimationNo}`,
                { headers }
            );
            await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_MAST&where=ESTIMATIONNO%3D${estimationNo}`,
                { headers }
            );
            // 1st API Call - Save Master Data
            const responseMaster = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Master/EstimationMastInsert",
                payloadMaster,
                { headers }
            );

            if (responseMaster.status === 200) {
                console.log("Master Data Saved:", responseMaster.data);
                const headers = {
                    "Content-Type": "application/json",
                    "tenantName": "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=",
                };
                // 2nd API Call - Save Estimation Details
                const responseDetails = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Master/EstimationDataMultiInsert",
                    payloadDataInsert,
                    { headers }
                );

                if (responseDetails.status === 200) {
                    console.log("Estimation Details Saved:", responseDetails.data);

                    // 3rd API Call - Save Estimation Items
                    if (payloadItemsInsert.length > 0) {
                        const responseItems = await axios.post(
                            "http://www.jewelerp.timeserasoftware.in/api/Master/EstimationItemsMultiInsert",
                            payloadItemsInsert,
                            { headers: { "Content-Type": "application/json" } }
                        );

                        if (responseItems.status === 200) {
                            setIsSaving(false);

                            message.success("Estimation, details, and items saved successfully!");
                            // window.location.reload(); // Refresh the window after successful save
                            fetchEstimationNo();
                            setEstimationNo();
                            setCustomerData();
                            setData([]);



                        } else {
                            console.error("Error saving estimation items:", responseItems.data);
                            message.error(`Error: ${responseItems.data.message || "Failed to save estimation items"}`);
                        }
                    } else {
                        message.success("Estimation and details saved successfully! No items to save.");
                        // window.location.reload(); // Refresh the window after successful save
                        fetchEstimationNo();
                        setEstimationNo();
                        setData([]);



                    }
                } else {
                    console.error("Error saving estimation details:", responseDetails.data);
                    message.error(`Error: ${responseDetails.data.message || "Failed to save estimation details"}`);
                }
            } else {
                console.error("Error saving estimation:", responseMaster.data);
                message.error(`Error: ${responseMaster.data.message || "Failed to save estimation"}`);
            }
        } catch (error) {
            console.error("Network error:", error.response?.data || error);
            message.error(error.response?.data?.message || "Network error, please try again.");
        }
        finally {
            setIsSaving(false); // Re-enable button after request completion
        }
    };

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

    useEffect(() => {
        if (tagNo) {
            fetchStoneDetails(tagNo);
        }
    }, [tagNo]);

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
        marginBottom: "5px",
    };
    // Function to fetch VAT based on MNAME from API
    const totalAmount = parseFloat(totals.totalAmount) || 0;
    const gstAmount = ((totalAmount * vat) / 100).toFixed(2); // ✅ Define gstAmount
    const grossAmount = (totalAmount + parseFloat(gstAmount)).toFixed(2); // ✅ Define grossAmount
    const netAmount = (parseFloat(grossAmount) - parseFloat(discount || 0)).toFixed(2); // ✅ Define netAmount
    return (
        <div >
            <Card bordered className="custometagnocard"
                style={{
                    position: "relative",
                    background: "linear-gradient(135deg,rgb(130, 139, 219),rgb(205, 207, 233))",
                    borderRadius: "8px",
                    width: "100%",

                    overflow: "hidden",
                }}>
                {/* Background Circles */}
                {/* Big Circles */}
                <div
                    style={{
                        position: "absolute",
                        top: "50px",
                        left: "40%",
                        width: "50px",
                        height: "50px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "50px",
                        left: "-2px",
                        width: "60px",
                        height: "60px",
                        backgroundColor: "rgba(123, 135, 150, 0.15)",
                        borderRadius: "50%",
                        border: "3px solid rgba(255, 255, 255, 0.2)",
                    }}
                />

                {/* Medium Circles */}
                <div
                    style={{
                        position: "absolute",
                        top: "-4px",
                        left: "40%",
                        width: "80px",
                        height: "80px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        width: "76px",
                        height: "62px",
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        borderRadius: "50%",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                    }}
                />

                {/* Small Circles */}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "20%",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",

                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                    }}
                />
                <Row gutter={[16, 8]} align="middle" style={{ marginBottom: "0.5rem", flexWrap: "wrap" }}>

                    {/* Tag No */}
                    <Col
                        xs={24} sm={12} md={8} lg={8} xl={8}

                        style={{
                            display: "flex",
                            flexDirection: "column", /* Stack items vertically */
                            alignItems: "flex-start",
                            justifyContent: "center",
                            gap: "5px",
                            order: 1,
                        }}
                    >
                        {/* Current Date */}
                        <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0, paddingLeft: "25px" }}>
                            {data.length > 0 && data[0].estimationDate !== "N/A"
                                ? new Date(data[0].estimationDate).toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })
                                : new Date().toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                        </p>



                        {/* Est No and Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <h2 style={{ fontSize: "1rem", margin: 0, whiteSpace: "nowrap", paddingLeft: "25px" }}>
                                Est No:
                            </h2>

                            <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                                {estimationNo}
                            </span>
                            <Button icon={<FolderAddOutlined  />} onClick={showModal} shape="circle" style={{ fontSize: "18px", backgroundColor: "#52BD91" }} />
                            <Button icon={<InfoCircleOutlined onClick={showModal1} />} onClick={showModal1} shape="circle" disabled={data.length === 0}
                                style={{ fontSize: "18px", backgroundColor: "#52BD91" }} />
                        </div>
                        {customerData && (
                            <div style={{ paddingLeft: "25px", fontSize: "14px", fontWeight: "bold" }}>
                                {customerData.customerName},&nbsp;
                                {customerData.mobileNumber}
                            </div>
                        )}


                        <Modal
                            title="Estimation Details"
                            open={visibleHis}
                            onCancel={() => setVisiblehis(false)}
                            footer={null}
                            width={900}
                        >
                            <Row justify="center" align="middle" gutter={16} style={{ marginBottom: 10 }}>
                                <Col>
                                    <Form.Item label="Estimation No" style={{ fontWeight: "bold", marginBottom: 0 }}>

                                        <Input
                                            ref={searchInputRef}

                                            placeholder="Search Estimation No"
                                            value={searchText}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSubmit();
                                                }
                                            }}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            style={{ fontWeight: "bold" }}

                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>

                            <Table
                                dataSource={filteredData.length > 0 || searchText ? filteredData : datahis} // Use filteredData if available
                                columns={columns3}
                                rowKey="EstimationNo"
                                size="small"
                                className="custom-table"

                                loading={loading}
                                pagination={false} // Disable pagination
                                scroll={{ y: 300 }} // Enable vertical scroll
                            />

                        </Modal>
                        <Modal
                            title="Customer Details"
                            open={visibleDetailes}
                            onCancel={() => setVisibleDetailes(false)}
                            footer={null}
                            width={400}
                        >
                            <Form form={form} onFinish={handleSubmit1} layout="vertical" initialValues={{
                                customerName: customerData?.customerName,
                                mobileNumber: customerData?.mobileNumber
                            }}>
                                <Row style={{ marginBottom: 10 }}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Customer Name"
                                            name="customerName"

                                            rules={[{ required: true, message: "Please enter customer name" }]}
                                        >
                                            <Input
                                                placeholder="Customer Name"
                                                ref={custNameRef}
                                                onKeyDown={(e) => handleKeyPressc(e, mobileRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 10 }}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Mobile Number"
                                            name="mobileNumber"
                                            rules={[{ required: true, message: "Please enter mobile number" }]}
                                        >
                                            <Input
                                                placeholder="Mobile Number"
                                                ref={mobileRef}

                                                onKeyDown={(e) => handleKeyPressc(e, null)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Button aligned to the right */}
                                <Row justify="end">
                                    <Col>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>

                    </Col>

                    {/* Estimation No */}
                    <Col
                        xs={24} sm={12} md={10} lg={10} xl={10}
                        style={{
                            display: "flex",  // Flexbox for better alignment
                            alignItems: "center",
                            gap: "10px", // Adds spacing between elements
                            order: 2,
                        }}
                    >
                        <h2 style={{ fontSize: "1rem", margin: 0, whiteSpace: "nowrap" }}>
                            TAG NO
                        </h2>

                        <Input
                            placeholder="Enter Tag No"
                            size="large"
                            style={{
                                height: "40px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                width: "200px",
                                textAlign: "center",
                            }}
                            value={tagNo}
                            onChange={(e) => setTagNo(e.target.value)}
                            onKeyDown={handleKeyPress}
                            ref={tagNoInputRef}
                            disabled={ratesAvailable === true}
                        />

                        <Button type="primary" onClick={fetchData} loading={isLoading}>
                            Fetch
                        </Button>

                        <Button
                            icon={
                                <ReloadOutlined
                                    style={{
                                        color: "orange",
                                        fontSize: "15px",
                                        transition: "transform 1s ease-in-out",
                                        transform: rotating ? "rotate(360deg)" : "rotate(0deg)",
                                    }}
                                />
                            }
                            onClick={handleRefresh}
                        />
                    </Col>

                    <Col xs={24} sm={24} md={6} lg={6} xl={6}
                        style={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                            order: 3,
                            marginBottom: "-6px"

                        }}
                    >
                        <TodaysRates1 setRatesAvailable={setRatesAvailable} tagNoInputRef={tagNoInputRef}/>
                    </Col>
                </Row>
            </Card>
            <div style={{ marginTop: "5px" }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                    loading={isLoading}
                    // scroll={{ x: "max-content" }}
                    className="custom-table"
                />
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: "5px" }}>
                {/* Left Card - Total Summary (Increased width) */}
                <Col xs={24} sm={24} md={14} lg={12} xl={12}>
                    <Card style={cardStyle}>
                        <Row gutter={[16, 16]}>
                            {/* Left Column */}
                            <Col span={11}>
                                {[
                                    { label: "Total Pcs", value: totals.totalPcs },
                                    { label: "Gross Weight", value: totals.totalGrossWeight.toFixed(3) },
                                    { label: "Less Weight", value: totals.totalLessWeight.toFixed(3) },
                                    { label: "Net Weight", value: totals.totalNetWeight.toFixed(3) },
                                ].map((item, index) => (
                                    <Row key={index} style={rowStyle} align="middle">
                                        <Col span={14}>
                                            <Text strong style={{ fontSize: 16 }}>{item.label}</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: 16 }}>:</Text>
                                        </Col>
                                        <Col span={9} style={{ textAlign: "right" }}>
                                            <Text strong style={{ fontSize: 16 }}>{item.value}</Text>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>

                            {/* Divider */}
                            <Col span={1}>
                                <div style={{ borderLeft: "1px solid #d9d9d9", height: "100%" }}></div>
                            </Col>

                            {/* Right Column */}
                            <Col span={11}>
                                {[
                                    { label: "Total Wastage", value: totals.totalWastage?.toFixed(3) },
                                    { label: "Making Charges", value: Math.round(Number(totals.totalMakingCharges)) },
                                    { label: "Total Amount", value: Math.round(Number(totals.totalAmount)) },
                                    { label: "Stone Cost", value: totals.totalStoneCost },
                                ].map((item, index) => (
                                    <Row key={index} style={rowStyle} align="middle">
                                        <Col span={14}>
                                            <Text strong style={{ fontSize: 16 }}>{item.label}</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: 16 }}>:</Text>
                                        </Col>
                                        <Col span={9} style={{ textAlign: "right" }}>
                                            <Text strong style={{ fontSize: 16 }}>{item.value}</Text>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    </Card>


                </Col>

                {/* Middle Empty Section */}
                <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                    <Card style={cardStyle}>
                        <Text type="secondary">Empty Section</Text>
                    </Card>
                </Col>

                {/* Right Card - Amount Details (Aligned to right corner) */}
                <Col xs={24} sm={12} md={6} lg={8} xl={8} style={{ marginLeft: "auto" }}>
                    <Card style={cardStyle}>
                        {[
                            {
                                label: "Total Amount",
                                value: Math.ceil(Number(totals.totalAmount)),
                            },
                            {
                                label: `GST Amount @ ${vat}%`,
                                value: Math.ceil(Number(gstAmount)),
                            },
                            {
                                label: "Gross Amount",
                                value: Math.ceil(Number(grossAmount)),
                            },
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
                            {
                                label: "Net Amount",
                                value: (
                                    <Typography.Text strong style={{ fontSize: 25 }}>
                                        {Math.ceil(Number(netAmount))}
                                    </Typography.Text>
                                ),
                            },
                        ].map((item, index) => (
                            <Row key={index} style={rowStyle} align="middle">
                                <Col span={14}>
                                    <Text strong style={{ fontSize: 16 }}>{item.label}</Text>
                                </Col>
                                <Col span={1} style={{ textAlign: "center" }}>
                                    <Text strong style={{ fontSize: 16 }}>:</Text>
                                </Col>
                                <Col span={9} style={{ textAlign: "right" }}>
                                    {typeof item.value === "number" ? (
                                        <Typography.Text strong style={{ fontSize: 16 }}>
                                            {item.value}
                                        </Typography.Text>
                                    ) : (
                                        item.value
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Card>

                </Col>
            </Row>


            <Row justify="end" style={{ marginTop: "1rem" }}>
                <Button
                    type="primary"
                    style={{ marginRight: "8px" }}
                    disabled={isSaving}
                    loading={isSaving ? { indicator: loadingIcon } : false} onClick={handleSave}
                >
                    Save
                </Button>
                <Button type="default">Print</Button>
            </Row>

            <Modal
                open={isProductModalOpen}
                onCancel={() => setIsProductModalOpen(false)}
                footer={null}
                centered
                width="90%"
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setIsProductModalOpen(false);
                    }
                }}
            >
                {/* Custom Close & Refresh Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px", position: "absolute", top: 0, right: 0, zIndex: 1000 }}>
                    {/* Custom Close Button */}

                    {/* Refresh Button */}
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />} // Icon in front
                        onClick={handleRefresh1}
                        size="medium"
                        style={{ backgroundColor: "#f5222d", color: "white", border: "none", marginRight: "15px", width: "150px" }}
                    >
                        Refresh
                    </Button>

                    <Button
                        type="text"
                        onClick={() => setIsProductModalOpen(false)}
                        size="large"
                        style={{ fontSize: "16px", color: "black" }}
                    />
                </div>

                <Card title="Product Details" bordered={false} style={{ width: "100%" }} className="customeproductcard">
                    <Card
                        style={{
                            background: "lightblue",
                            borderRadius: 10,
                        }}
                        className="customeproductcard"
                    >
                        <Row gutter={[16, 16]}>
                            {/* First Section: Main Product, Purity, Pieces, Product Name */}
                            <Col xs={24} sm={12} md={7} style={{ borderRight: "1px solid #4096ff", paddingRight: "16px" }}>
                                <Form
                                    layout="horizontal"
                                    labelCol={{ xs: { span: 24 }, sm: { flex: "130px" } }}
                                    wrapperCol={{ xs: { span: 24 }, sm: { flex: 1 } }}
                                    style={{ width: "100%" }}
                                >
                                    {/* Main Product */}
                                    <Form.Item label="Main Product:" labelAlign="left">
                                        <Select
                                            ref={mainProductRef}
                                            style={{ width: "100%", marginBottom: "7px" }}
                                            showSearch
                                            placeholder="Select Main Product"
                                            value={selectedMainProduct || undefined}
                                            onChange={(value) => {
                                                setSelectedMainProduct(value);
                                                setSelectedPurity(null);  // Clear Purity
                                                setSelectedProduct(null); // Clear Product Name
                                                setTimeout(() => {
                                                    if (purityRef.current) purityRef.current.focus();
                                                }, 100);
                                            }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={mainProductOptions.map((item) => ({
                                                value: item,
                                                label: item,
                                            }))}
                                        />
                                    </Form.Item>


                                    {/* Purity */}
                                    <Form.Item label="Purity:" labelAlign="left">
                                        <Select
                                            ref={purityRef}
                                            style={{ width: "100%", marginBottom: "7px" }}
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

                                    {/* Product Name */}
                                    <Form.Item label="Product Name:" labelAlign="left">
                                        <Select
                                            ref={productNameRef}
                                            style={{ width: "100%", marginBottom: "7px" }}
                                            showSearch
                                            placeholder="Select a product"
                                            value={selectedProduct || undefined}
                                            onSelect={(value) => {
                                                setSelectedProduct(value);
                                                setTimeout(() => {
                                                    if (pcsRef.current) pcsRef.current.focus();
                                                }, 100);
                                            }}
                                            disabled={!selectedMainProduct}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={products.map((product) => ({
                                                value: product.PRODUCTNAME,
                                                label: product.PRODUCTNAME,
                                            }))}
                                        />
                                    </Form.Item>

                                    {/* PCS */}
                                    <Form.Item label="PCS:" labelAlign="left">
                                        <Input
                                            ref={pcsRef}
                                            type="number"
                                            style={{ width: "100%", marginBottom: "7px" }}
                                            placeholder="Enter PCS"
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
                                    </Form.Item>
                                </Form>
                            </Col>


                            {/* Second Section: Remaining Fields */}
                            <Col xs={24} sm={12} md={8} style={{ borderRight: "1px solid #4096ff", paddingRight: "16px" }}>

                                <Form
                                    layout="horizontal"
                                    labelCol={{ span: 10 }} // Label width
                                    wrapperCol={{ span: 14 }} // Input width
                                    colon={false}
                                    labelAlign="left" // Aligns label to left
                                >
                                    <Row gutter={8}>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* G.wt */}
                                            <Form.Item label="G.wt:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={gwtRef}
                                                    type="number"
                                                    placeholder="Enter GWT"
                                                    value={gwt}
                                                    onChange={(e) => {
                                                        const newGwt = parseFloat(e.target.value);
                                                        setGwt(newGwt);

                                                        // Update Net Weight (assuming weight loss is deducted)
                                                        const newNwt = newGwt - (totalLess || 0);
                                                        setNwt(newNwt);

                                                        // Update Total Wastage based on percentage
                                                        if (wastageData.length > 0) {
                                                            const updatedTotalWastage = ((parseFloat(wastageData[0]?.percentage || 0) * newNwt) / 100)?.toFixed(3);
                                                            setWastageData([{ ...wastageData[0], total: updatedTotalWastage }]);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => breadsLessRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* Breads Less */}
                                            <Form.Item label="Breads Less:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={breadsLessRef}
                                                    type="number"
                                                    placeholder="Enter..."
                                                    value={breadsLess}
                                                    onChange={(e) => setBreadsLess(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => totalLessRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={8}>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* Weight Less */}
                                            <Form.Item label="Wt Less:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={totalLessRef}
                                                    type="number"
                                                    placeholder="Enter..."
                                                    value={finalTotalGrams > 0 ? finalTotalGrams : totalLess}
                                                    onChange={(e) => setTotalLess(e.target.value)}
                                                    readOnly={finalTotalGrams > 0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => nwtRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* N.wt */}
                                            <Form.Item label="N.wt:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={nwtRef}
                                                    type="number"
                                                    value={nwt}
                                                    readOnly
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => huidRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={8}>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* HUID */}
                                            <Form.Item label="HUID:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={huidRef}
                                                    type="text"
                                                    placeholder="Enter HUID"
                                                    value={huid}
                                                    onChange={(e) => setHuid(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => tagSizeRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={8} md={12}>
                                            {/* Tag Size */}
                                            <Form.Item label="Tag Size:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px", textAlign: "right" }}
                                                    ref={tagSizeRef}
                                                    type="text"
                                                    placeholder="Enter Tag Size"
                                                    value={tagSize}
                                                    onChange={(e) => setTagSize(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => descriptionRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            {/* Description */}
                                            <Form.Item label="Description:">
                                                <Input
                                                    style={{ width: "100%", marginBottom: "7px" }}
                                                    ref={descriptionRef}
                                                    placeholder="Enter Description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setTimeout(() => categoryRef.current?.focus(), 100);
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>

                            {/* Third Section: Wastage and Making Charges */}
                            <Col xs={24} sm={12} md={9}>
                                <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} colon={false} labelAlign="left">
                                    {/* Category Dropdown (Full Width) */}
                                    <Form.Item label="Category" style={{ marginBottom: "10px" }}>
                                        <Select
                                            showSearch
                                            ref={categoryRef}
                                            value={selectedCategory}
                                            placeholder="%"
                                            onChange={handleCategoryChange}
                                            style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
                                            optionFilterProp="children"

                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        >
                                            {categories.map((category) => (
                                                <Option key={category.categoryname} value={category.categoryname}>
                                                    {category.categoryname}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Wastage Section (3 Fields Per Row) */}
                                    <Row gutter={10}>
                                        <Col span={8}>
                                            <Form.Item label="Wast(%)" style={{ marginBottom: "10px" }}>
                                                <Input
                                                    ref={percentageRef}
                                                    value={wastageData[0]?.percentage || ""}
                                                    placeholder="%"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setWastageData([{ ...wastageData[0], percentage: value, total: value ? ((parseFloat(value) * nwt) / 100).toFixed(3) : "" }]);
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, directRef, null)}
                                                    style={{ marginBottom: "10px", textAlign: "right" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Dir.wast" style={{ marginBottom: "10px" }}>
                                                <Input
                                                    ref={directRef}
                                                    value={wastageData[0]?.direct || ""}
                                                    placeholder="Direct"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setWastageData([{ ...wastageData[0], direct: value, total: parseFloat(value).toFixed(3) }]);
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, perGramRef)}
                                                    style={{ marginBottom: "10px", textAlign: "right" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Tot.wast" style={{ marginBottom: "10px" }}>
                                                <Input ref={totalRef} value={wastageData[0]?.total || ""}
                                                    placeholder="Total" readOnly style={{ marginBottom: "10px", textAlign: "right" }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* Making Charges Section (3 Fields Per Row) */}
                                    <Row gutter={10}>
                                        <Col span={8}>
                                            <Form.Item label="Mc/g" style={{ marginBottom: "10px" }}>
                                                <Input
                                                    ref={perGramRef}
                                                    value={wastageData[0]?.perGram || ""}
                                                    placeholder="Per Gram"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setWastageData([{ ...wastageData[0], perGram: value, newField2: (parseFloat(value) * nwt).toFixed(2) }]);
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, direct1Ref)}
                                                    style={{ marginBottom: "10px", textAlign: "right" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Dir.Mc" style={{ marginBottom: "10px" }}>
                                                <Input
                                                    ref={direct1Ref}
                                                    value={wastageData[0]?.newField1 || ""}
                                                    placeholder="Direct"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setWastageData([{ ...wastageData[0], newField1: value, newField2: (parseFloat(wastageData[0]?.perGram || 0) * nwt).toFixed(2) }]);
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, stoneItemRef)}
                                                    style={{ marginBottom: "10px", textAlign: "right" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Tot.Mc" style={{ marginBottom: "10px" }}>
                                                <Input
                                                    ref={total1Ref}
                                                    value={
                                                        parseFloat(wastageData[0]?.newField1) > 0
                                                            ? wastageData[0]?.newField1
                                                            : ((parseFloat(wastageData[0]?.total) + nwt) * parseFloat(wastageData[0]?.perGram)).toFixed(2) || ""
                                                    }
                                                    placeholder="Total"
                                                    readOnly

                                                    style={{ marginBottom: "10px", textAlign: "right" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>


                        </Row>
                    </Card>

                    <Row><span style={{ padding: "6px", fontWeight: "bold" }}>Stone Detailes</span></Row>

                    <Card style={{ backgroundColor: "lightblue", padding: "10px" }} className="customeproductcard">
                        <Row gutter={[8, 8]} align="middle">
                            {/* Stone Item */}
                            <Col xs={24} sm={12} md={6} lg={4}>
                                <Typography.Text strong>Stone Item</Typography.Text>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const highlightedOption = filteredOptions[highlightedIndex];

                                            if (highlightedOption && stoneItemInputValue) {
                                                handleStoneSelect(highlightedOption.ITEMNAME);
                                            } else {
                                                if (formValues.stoneItem.trim() === "") {
                                                    handleOk();
                                                } else {
                                                    handleAddStone(); // Submit Form
                                                    setTimeout(() => {
                                                        stoneItemRef.current?.focus();
                                                    }, 100);
                                                }
                                            }
                                        } else {
                                            handleStoneKeyDown(e);
                                        }
                                    }}
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
                                        <Option key={item.ITEMCODE} value={item.ITEMNAME} className={index === highlightedIndex ? "highlighted-option" : ""}>
                                            {item.ITEMNAME}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            {/* Pcs, Cts, Grams, Rate, Amount, No Pcs */}
                            {[
                                { name: "pcs", label: "Pcs", placeholder: "Pcs", ref: pcssRef },
                                { name: "cts", label: "Cts", placeholder: "Cts", ref: ctsRef },
                                { name: "grams", label: "Grams", placeholder: "Grams", ref: gramsRef },
                                { name: "rate", label: "Rate", placeholder: "Rate", ref: rateRef },
                                { name: "amount", label: "Amount", placeholder: "Amount", readOnly: true, ref: amountRef },
                                { name: "noPcs", label: "No. Pcs", placeholder: "No. Pcs", ref: noPcsRef },
                            ].map(({ name, label, placeholder, readOnly = false, ref }) => (
                                <Col xs={12} sm={6} md={4} lg={2} key={name}>
                                    <Typography.Text strong>{label}</Typography.Text>
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

                            {/* Cut, Color, Clarity - Show after No Pcs when clicked */}
                            {showExtraFields &&
                                [
                                    { name: "cut", label: "Cut", placeholder: "Cut", ref: cutRef },
                                    { name: "color", label: "Color", placeholder: "Color", ref: colorRef },
                                    { name: "clarity", label: "Clarity", placeholder: "Clarity", ref: clarityRef },
                                ].map(({ name, label, placeholder, ref }) => (
                                    <Col xs={12} sm={6} md={4} lg={2} key={name}>
                                        <Typography.Text strong>{label}</Typography.Text>
                                        <Input
                                            name={name}
                                            value={formValues[name]}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleEnterPress(e, name)}
                                            placeholder={placeholder}
                                            ref={ref}
                                        />
                                    </Col>
                                ))}

                            {/* Plus Icon */}
                            <Col xs={6} sm={4} md={3} lg={1}>
                                <Typography.Text strong>&nbsp;</Typography.Text>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setShowExtraFields(!showExtraFields);
                                        setTimeout(() => cutRef.current?.focus(), 100); // Move to Cut after opening fields
                                    }}
                                />
                            </Col>

                            {/* Submit Button */}
                            <Col xs={12} sm={6} md={4} lg={2}>
                                {/* <Typography.Text strong>&nbsp;</Typography.Text> */}
                                <Button type="primary" onClick={() => { handleAddStone(); mainProductRef.current.focus(); }} style={{ width: "150px" }}>
                                    Submit
                                </Button>
                            </Col>
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
                                <Table.Summary.Row style={{ backgroundColor: "#6aa8bd", color: "white", fontWeight: "bold" }}>
                                    <Table.Summary.Cell index={0}><b>Total</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} /> {/* Stone Item */}
                                    <Table.Summary.Cell index={2} align="right"><b>{getTotal("pcs")}</b></Table.Summary.Cell> {/* Pcs */}
                                    <Table.Summary.Cell index={3} align="right"><b>{getTotal("cts").toFixed(3)}</b></Table.Summary.Cell> {/* Cts */}
                                    <Table.Summary.Cell index={4} align="right"><b>{getTotal("grams").toFixed(3)}</b></Table.Summary.Cell> {/* Grams */}
                                    <Table.Summary.Cell index={5} /> {/* Rate */}
                                    <Table.Summary.Cell index={6} align="right"><b>{getTotal("noPcs")}</b></Table.Summary.Cell> {/* No. Pcs */}
                                    <Table.Summary.Cell index={7} /> {/* Color */}
                                    <Table.Summary.Cell index={8} /> {/* Cut */}
                                    <Table.Summary.Cell index={9} /> {/* Clarity */}
                                    <Table.Summary.Cell index={10} align="right"><b>{Math.ceil(getTotal("amount"))}</b></Table.Summary.Cell> {/* Amount */}
                                    <Table.Summary.Cell index={11} /> {/* Action */}
                                </Table.Summary.Row>
                            )}
                        />

                        <Row justify="space-between" align="middle" style={{ marginTop: "5px", marginBottom: "10px" }}>
                            <Col>
                                <Tag color="#55b76d" style={tagStyle}>Total Grms: {finalTotalGrams}</Tag>
                                <Tag color="#55b76d" style={tagStyle}>Total Dia Amount: {totalDiaAmount}</Tag>
                                <Tag color="#55b76d" style={tagStyle}>Total Diamond Cts: {totalDiamondCts}</Tag>
                                <Tag color="#55b76d" style={tagStyle}>Total CTS: {totalCTS}</Tag>
                                <Tag color="#55b76d" style={tagStyle}>Total Uncuts: {totalUncuts}</Tag>
                            </Col>
                            <Col style={{ marginLeft: "auto" }}>

                                <Button type="primary" onClick={handleOk} size="large" style={{ width: "150px" }}>
                                    OK
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Card>

            </Modal>
        </div>

    );
};

export default EstimationTable;
