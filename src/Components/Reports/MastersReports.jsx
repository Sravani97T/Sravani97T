import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Breadcrumb, Row, Col, DatePicker, Popover, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined,FilterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProductTable = () => {
    const [filters, setFilters] = useState({
        mainProduct: '',
        product: '',
        productName: '',
        counterName: '',
        categoryName: '',
        manufacturer: '',
        dealerName: '',
        prefix: '',
        brand: '',
        tagWeightType: '',
        tagWeightFrom: null,
        tagWeightTo: null,
        tagDate: []
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const handlePrint = () => {
        const printContent = document.getElementById('printableTable');
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Print</title>');
            printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } .ant-pagination { display: none; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } else {
            console.error('Printable content not found');
        }
    };
    const handlePDFWithPreview = () => {
        const doc = new jsPDF('landscape');
        doc.autoTable({
            head: [['S.No', 'Tag No', 'Product Name', 'PCS', 'Purity', 'Gross Wt', 'Less', 'Net Wt', 'Dia Cts', 'Dia Amt', 'ST Cost', 'Counter Name', 'Brand Name', 'Brand Amt', 'Dealer Name', 'HUID', 'HSN Code', 'Tag Size', 'Date']],
            body: filteredData.map((item, index) => [
                index + 1,
                item.TAGNO,
                item.PRODUCTNAME,
                item.PIECES,
                item.PREFIX,
                item.GWT,
                item.COST_LESS,
                item.NWT,
                item.diacts,
                item.Diamond_Amount,
                item.ITEM_TOTAMT,
                item.COUNTERNAME,
                item.BRANDNAME,
                item.BRANDAMT,
                item.DEALERNAME,
                item.HUID,
                item.HSNCODE,
                item.TAGSIZE,
                moment(item.TAGDATE).format('DD/MM/YYYY')
            ]),
            foot: [['Total', '', '', sums.PCS, '', sums.GWT.toFixed(2), '', sums.NWT.toFixed(2), sums.diacts.toFixed(2), sums.Diamond_Amount.toFixed(2), '', '', '', '', '', '', '', '']],
            styles: { cellPadding: 2, fontSize: 6, lineColor: [200, 200, 200], lineWidth: 0.1 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 6, fontStyle: 'normal' },
            footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [200, 200, 200], fontStyle: 'normal' },
            margin: { top: 5, bottom: 5 },
            columnStyles: {
                0: { cellWidth: 11 },
                1: { cellWidth: 11}, 2: { cellWidth: 30 },      3: { cellWidth: 8 }, 4: { cellWidth: 12 }, 5: { cellWidth: 13 }, 6: { cellWidth: 12 },  
                   7: { cellWidth: 13 }, 8: { cellWidth: 12 },9: { cellWidth: 13 },
                10: { cellWidth: 13 },11: { cellWidth: 14 },
                12: { cellWidth: 24 },13: { cellWidth: 15 },
                14: { cellWidth: 25 },
                15: { cellWidth: 13 },  16: { cellWidth: 13 },  17: { cellWidth: 12 },  18: { cellWidth: 15 }
            }
        });
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const previewWindow = window.open(pdfUrl, '_blank');
        previewWindow.document.write('<html><head><title>PDF Preview</title></head><body>');
        previewWindow.document.write('<iframe src="' + pdfUrl + '" width="100%" height="100%" style="border:none;"></iframe>');
        previewWindow.document.write('<button id="savePdf" style="position:fixed;top:10px;right:10px;">Save PDF</button>');
        previewWindow.document.write('</body></html>');
        previewWindow.document.close();
        previewWindow.onload = () => {
            previewWindow.document.getElementById('savePdf').onclick = () => {
                saveAs(pdfBlob, 'D:/PDF_PATH/table.pdf');
            };
        };
    };
    const handleExcel = async () => {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Product Data');

        // Define header row
        worksheet.columns = [
            { header: 'S.No', key: 'sno', width: 5 },
            { header: 'Tag No', key: 'TAGNO', width: 15 },
            { header: 'Product Name', key: 'PRODUCTNAME', width: 30 },
            { header: 'Pieces', key: 'PIECES', width: 10 },
            { header: 'Purity', key: 'PREFIX', width: 10 },
            { header: 'Gross Wt', key: 'GWT', width: 10 },
            { header: 'Less', key: 'COST_LESS', width: 10 },
            { header: 'Net Wt', key: 'NWT', width: 10 },
            { header: 'Dia Cts', key: 'diacts', width: 10 },
            { header: 'Dia Amt', key: 'Diamond_Amount', width: 15 },
            { header: 'ST Cost', key: 'ITEM_TOTAMT', width: 15 },
            { header: 'Counter Name', key: 'COUNTERNAME', width: 20 },
            { header: 'Brand Name', key: 'BRANDNAME', width: 20 },
            { header: 'Brand Amt', key: 'BRANDAMT', width: 15 },
            { header: 'Dealer Name', key: 'DEALERNAME', width: 20 },
            { header: 'HUID', key: 'HUID', width: 15 },
            { header: 'HSN Code', key: 'HSNCODE', width: 15 },
            { header: 'Tag Size', key: 'TAGSIZE', width: 10 },
            { header: 'Date', key: 'TAGDATE', width: 15 }
        ];

        // Add data rows
        filteredData.forEach((item, index) => {
            worksheet.addRow({
                sno: index + 1,
                TAGNO: item.TAGNO,
                PRODUCTNAME: item.PRODUCTNAME,
                PIECES: item.PIECES,
                PREFIX: item.PREFIX,
                GWT: item.GWT,
                COST_LESS: item.COST_LESS,
                NWT: item.NWT,
                diacts: item.diacts,
                Diamond_Amount: item.Diamond_Amount,
                ITEM_TOTAMT: item.ITEM_TOTAMT,
                COUNTERNAME: item.COUNTERNAME,
                BRANDNAME: item.BRANDNAME,
                BRANDAMT: item.BRANDAMT,
                DEALERNAME: item.DEALERNAME,
                HUID: item.HUID,
                HSNCODE: item.HSNCODE,
                TAGSIZE: item.TAGSIZE,
                TAGDATE: moment(item.TAGDATE).format('DD/MM/YYYY')
            });
        });

        // Add footer row for totals
        worksheet.addRow({});
        worksheet.addRow({
            sno: 'Total',
            PIECES: sums.PCS,
            GWT: sums.GWT.toFixed(2),
            NWT: sums.NWT.toFixed(2),
            diacts: sums.diacts.toFixed(2),
            Diamond_Amount: sums.Diamond_Amount.toFixed(2)
        });

        // Apply styles
        worksheet.getRow(1).font = { bold: true };
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'ProductData.xlsx');
    };
    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/Erp/GetTagGenerationDetailsList')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    useEffect(() => {
        let filtered = data;
        if (filters.mainProduct) {
            filtered = filtered.filter(item => item.MNAME === filters.mainProduct);
        }
        if (filters.product) {
            filtered = filtered.filter(item => item.PRODUCTCATEGORY === filters.product);
        }
        if (filters.productName) {
            filtered = filtered.filter(item => item.PRODUCTNAME === filters.productName);
        }
        if (filters.counterName) {
            filtered = filtered.filter(item => item.COUNTERNAME === filters.counterName);
        }
        if (filters.categoryName) {
            filtered = filtered.filter(item => item.CATEGORYNAME === filters.categoryName);
        }
        if (filters.manufacturer) {
            filtered = filtered.filter(item => item.Manufacturer === filters.manufacturer);
        }
        if (filters.dealerName) {
            filtered = filtered.filter(item => item.DEALERNAME === filters.dealerName);
        }
        if (filters.prefix) {
            filtered = filtered.filter(item => item.PREFIX === filters.prefix);
        }
        if (filters.brand) {
            filtered = filtered.filter(item => item.BRANDNAME === filters.brand);
        }
        if (filters.tagWeightType && filters.tagWeightFrom !== null && filters.tagWeightTo !== null) {
            filtered = filtered.filter(item => {
                const weight = item[filters.tagWeightType];
                return weight >= filters.tagWeightFrom && weight <= filters.tagWeightTo;
            });
        }
        if (filters.tagDate.length === 2) {
            filtered = filtered.filter(item => {
                const tagDate = moment(item.TAGDATE);
                const fromDate = moment(filters.tagDate[0]);
                const toDate = moment(filters.tagDate[1]);
                return tagDate.isBetween(fromDate, toDate, 'days', '[]');
            });
        }
        setFilteredData(filtered);
    }, [filters, data]);

    const handleTempFilterChange = (key, value) => {
        setTempFilters({
            ...tempFilters,
            [key]: value
        });
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        setPopoverVisible(false);
    };

    const clearFilters = () => {
        const clearedFilters = {
            mainProduct: '',
            product: '',
            productName: '',
            counterName: '',
            categoryName: '',
            manufacturer: '',
            dealerName: '',
            prefix: '',
            brand: '',
            tagWeightType: '',
            tagWeightFrom: null,
            tagWeightTo: null,
            tagDate: []
        };
        setTempFilters(clearedFilters);
        setFilters(clearedFilters);
    };

    const calculateSums = (data) => {
        return data.reduce((sums, item) => {
            sums.GWT += item.GWT || 0;
            sums.NWT += item.NWT || 0;
            sums.PCS += item.PIECES || 0;
            sums.diacts += item.diacts || 0;
            sums.Diamond_Amount += item.Diamond_Amount || 0;
            return sums;
        }, { GWT: 0, NWT: 0, PCS: 0, diacts: 0, Diamond_Amount: 0 });
    };

    const sums = calculateSums(filteredData);
    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', render: (text, record, index) => index + 1 },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME', minWidth: 200 }, // Increased minWidth
        { title: 'Pieces', dataIndex: 'PIECES', align: "center", key: 'PIECES' },
        { title: 'Purity', dataIndex: 'PREFIX', align: "center", key: 'PREFIX' },
        { title: 'Gross Wt', dataIndex: 'GWT', align: "right", key: 'GWT' },
        { title: 'Less', dataIndex: 'COST_LESS', align: "right", key: 'COST_LESS' },
        { title: 'Net Wt', dataIndex: 'NWT', align: "right", key: 'NWT' },
        { title: 'Dia Cts', dataIndex: 'diacts', align: "right", key: 'diacts' },
        { title: 'Dia Amt', dataIndex: 'Diamond_Amount', align: "right", key: 'Diamond_Amount' },
        { title: 'ST Cost', dataIndex: 'ITEM_TOTAMT', align: "right", key: 'ITEM_TOTAMTT' },
        { title: 'Counter Name', dataIndex: 'COUNTERNAME', key: 'COUNTERNAME' },
        { title: 'Brand Name', dataIndex: 'BRANDNAME', key: 'BRANDNAME' },
        { title: 'Brand Amt', dataIndex: 'BRANDAMT', align: "right", key: 'BRANDAMT' },
        { title: 'Dealer Name', dataIndex: 'DEALERNAME', key: 'DEALERNAME' },
        { title: 'HUID', dataIndex: 'HUID', key: 'HUID' },
        { title: 'HSN Code', dataIndex: 'HSNCODE', key: 'HSNCODE' },
        { title: 'Counter Name', dataIndex: 'COUNTERNAME', key: 'COUNTERNAME' },
        { title: 'Tag Size', dataIndex: 'TAGSIZE', align: "center", key: 'TAGSIZE' },
        { title: 'Date', dataIndex: 'TAGDATE', key: 'TAGDATE', align: "center", render: (text) => moment(text).format('DD/MM/YYYY') },
    ];
    
    const uniqueMainProducts = [...new Set(data.map(item => item.MNAME))];
    const uniqueProductCategories = tempFilters.mainProduct
        ? [...new Set(data.filter(item => item.MNAME === tempFilters.mainProduct).map(item => item.PRODUCTCATEGORY))]
        : [];
    const uniqueProductNames = tempFilters.mainProduct && tempFilters.product
        ? [...new Set(data.filter(item => item.MNAME === tempFilters.mainProduct && item.PRODUCTCATEGORY === tempFilters.product).map(item => item.PRODUCTNAME))]
        : [];
    const uniqueCounterNames = [...new Set(data.map(item => item.COUNTERNAME))];
    const uniqueCategoryNames = [...new Set(data.map(item => item.CATEGORYNAME))];
    const uniqueManufacturers = [...new Set(data.map(item => item.Manufacturer))];
    const uniqueDealerNames = [...new Set(data.map(item => item.DEALERNAME))];
    const uniquePrefixes = [...new Set(data.map(item => item.PREFIX))];
    const uniqueBrands = [...new Set(data.map(item => item.BRANDNAME))];

    const isFilterApplied = filters.mainProduct || filters.product || filters.productName || filters.counterName || filters.categoryName || filters.manufacturer || filters.dealerName || filters.prefix || filters.brand || (filters.tagWeightType && filters.tagWeightFrom !== null && filters.tagWeightTo !== null) || (filters.tagDate.length === 2);

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Main Product"
                    style={{ width: '100%' }}
                    value={tempFilters.mainProduct}
                    onChange={(value) => handleTempFilterChange('mainProduct', value)}
                >
                    {uniqueMainProducts.map(product => (
                        <Option key={product} value={product}>{product}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Product Category"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.product}
                    onChange={(value) => handleTempFilterChange('product', value)}
                    disabled={!tempFilters.mainProduct}
                >
                    {uniqueProductCategories.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Product Name"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.productName}
                    onChange={(value) => handleTempFilterChange('productName', value)}
                    disabled={!tempFilters.mainProduct || !tempFilters.product}
                >
                    {uniqueProductNames.map(name => (
                        <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Counter Name"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.counterName}
                    onChange={(value) => handleTempFilterChange('counterName', value)}
                >
                    {uniqueCounterNames.map(counter => (
                        <Option key={counter} value={counter}>{counter}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Category Name"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.categoryName}
                    onChange={(value) => handleTempFilterChange('categoryName', value)}
                >
                    {uniqueCategoryNames.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Manufacturer"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.manufacturer}
                    onChange={(value) => handleTempFilterChange('manufacturer', value)}
                >
                    {uniqueManufacturers.map(manufacturer => (
                        <Option key={manufacturer} value={manufacturer}>{manufacturer}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Dealer Name"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.dealerName}
                    onChange={(value) => handleTempFilterChange('dealerName', value)}
                >
                    {uniqueDealerNames.map(dealer => (
                        <Option key={dealer} value={dealer}>{dealer}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Prefix"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.prefix}
                    onChange={(value) => handleTempFilterChange('prefix', value)}
                >
                    {uniquePrefixes.map(prefix => (
                        <Option key={prefix} value={prefix}>{prefix}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Brand"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.brand}
                    onChange={(value) => handleTempFilterChange('brand', value)}
                >
                    {uniqueBrands.map(brand => (
                        <Option key={brand} value={brand}>{brand}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Tag Weight Type"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.tagWeightType}
                    onChange={(value) => handleTempFilterChange('tagWeightType', value)}
                    disabled={!tempFilters.mainProduct}
                >
                    <Option value="GWT">GWT</Option>
                    <Option value="NWT">NWT</Option>
                    <Option value="diacts">DIA-CTS</Option>
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="From"
                    value={tempFilters.tagWeightFrom}
                    onChange={(e) => handleTempFilterChange('tagWeightFrom', e.target.value)}
                    disabled={!tempFilters.mainProduct || !tempFilters.tagWeightType}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="To"
                    value={tempFilters.tagWeightTo}
                    onChange={(e) => handleTempFilterChange('tagWeightTo', e.target.value)}
                    disabled={!tempFilters.mainProduct || !tempFilters.tagWeightType}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <RangePicker
                    placeholder={["Tag Date From", "Tag Date To"]}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.tagDate.length === 2 ? [moment(tempFilters.tagDate[0]), moment(tempFilters.tagDate[1])] : []}
                    onChange={(dates) => {
                        const formattedDates = dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : [];
                        handleTempFilterChange('tagDate', formattedDates);
                    }}
                />
            </Col>
            <Col xs={24} sm={24} md={24}>
                <Button type="primary" onClick={applyFilters}>Apply</Button>
                <Button style={{ marginLeft: '8px' }} onClick={clearFilters}>Clear</Button>
            </Col>
        </Row>
    );

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>Print</Button>
        <Button icon={<FilePdfOutlined />} onClick={handlePDFWithPreview} style={{ marginRight: 8 }}>PDF</Button>
        <Button icon={<FileExcelOutlined />} onClick={handleExcel} style={{ marginRight: 8 }}>Excel</Button>
        <Popover
            content={filterContent}
            title="Filters"
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
            overlayStyle={{ width: '500px' }}
        >
            <Button icon={<FilterOutlined />} type="primary">Filter</Button>
        </Popover>
    </Col>
            </Row>
            <div style={{ marginTop: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
           
            <div
    id="printableTable"
    className="table-responsive scroll-horizontal"
    style={{
        maxHeight: "calc(99vh - 193.33px)",
        overflowY: "auto",
        overflowX: "auto",
        marginTop: "20px",
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        borderRadius: '8px'
    }}
>
    <Table
        size="small"
        columns={columns}
        dataSource={isFilterApplied ? filteredData : []}
        rowKey="TAGNO"
        pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            position: ["topRight"],
            style: { margin: "5px" }
        }}
        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        summary={() => isFilterApplied && (
            <Table.Summary fixed >
                <Table.Summary.Row style={{backgroundColor:"#D5D8DC"}}>
                    <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="center">{sums.PCS}</Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="right">{sums.GWT.toFixed(2)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7} align="right">{sums.NWT.toFixed(2)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={8} align="right">{sums.diacts.toFixed(2)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={9} align="right">{sums.Diamond_Amount.toFixed(2)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={10} colSpan={9}></Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        )}
    />
</div>
                <style jsx>{`
                    .table-row-light {
                        background-color: #f0f0f0;
                    }
                    .table-row-dark {
                        background-color: #ffffff;
                    }
                `}</style>
            </div>
        </>
    );
};

export default ProductTable;
