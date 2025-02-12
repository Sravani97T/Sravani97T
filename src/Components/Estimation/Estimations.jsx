import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Table,
  Row,
  Col,
  Card,
  message,
  InputNumber,
} from "antd";
import { CREATE_jwel } from "../../Config/Config";
import TableHeaderStyles from "../Pages/TableHeaderStyles";
import { currencyFormat, currencyToNumber } from "../Utiles/Utiles";


const Estimations = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(false);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";
  const refs = useRef({});
  const [stoneData, setStoneData] = useState([]);
  const [tagNo, setTagNo] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [currentRates, setCurrentRates] = useState({
    "22K": 8000.00,
    "18K": 8000.00,
    "24K": 0.00,
    SILVER: 95.00,
    "NON KDM": 0.00,
    PLATINUM: 0.00,
  });
  const [totals, setTotals] = useState({
    totalPieces: 0,
    totalGrossWeight: 0,
    totalNetWeight: 0,
    totalWastage: 0,
    totalMc: 0,
    totalAmount: 0,
  });
  const handleKeyDown = (e, fieldName) => {
    const fieldNames = Object.keys(refs.current);
    const currentIndex = fieldNames.indexOf(fieldName);
    const nextFieldName = fieldNames[currentIndex + 1];

    const handleSave = () => {
      console.log("Saving...");
    };

    const handleCancel = () => {
      console.log("Cancelling...");
    };

    if (e.key === "Enter") {
      e.preventDefault();

      if (nextFieldName && refs.current[nextFieldName]) {
        refs.current[nextFieldName].focus();
      } else if (currentIndex === fieldNames.length - 1) {
        if (editingKey) {
          handleSave();
        } else {
          form.submit();
        }
      }
    }

    if (e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (editingKey) {
        handleSave();
      } else {
        form.submit();
      }
    }

    if (e.altKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      handleCancel();
    }
  };


  const getProductDetailsByTagNo = async (tagNo) => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=tag_generation&where=tagno%3D${tagNo}`);
      console.log(response.data,'response.data');
      const formattedData = response.data.map((item) => {
        const less = item.GWT - item.NWT;
        const metalValue = item.NWT * currentRates[item.PREFIX];
        
        //totalWastage calculation
        const hasDirectWastage = parseInt(item.DIRECTWASTAGE) !== 0;
        const totalWastage = hasDirectWastage 
          ? item.DIRECTWASTAGE 
          : (item.NWT * item.WASTAGE / 100);
        
        
        // making charges calculation
        const hasDirectMc = parseInt(item.DIRECTMC) !== 0;
        const totMc = hasDirectMc
          ? item.DIRECTMC
          : ((item.NWT + totalWastage) * item.MAKINGCHARGES);

        //valueAdded calculation
        const valueAdded = totalWastage*currentRates[item.PREFIX] + totMc;

        //totalAmount calculation
        //METAL VALUE+STONE_COST+MC+((TOTWAST)*RATE)
        const totalAmount = metalValue + item.ITEM_TOTAMT  + item.ITEM_TOTAMT + totMc;

        return {
          ...item,
          WASTAGE:item.WASTAGE + '%' ,
          LESS: less,
          MAKINGCHARGES:currencyFormat(item.MAKINGCHARGES),
          metalValue:currencyFormat(metalValue),
          totalWastage,
          totMc: currencyFormat(totMc),
          valueAdded:currencyFormat(valueAdded),
          totalAmount:currencyFormat(totalAmount)
        };
      });
      // combine the data with the existing productsData
      const combinedData = [...productsData, ...formattedData];
      //updating index 
      const updatedData = combinedData.map((item, index) => ({
        ...item,
        key: index + 1,
        sno: index + 1,
      }));
      setProductsData(updatedData);
      setTotals({
        totalPieces: updatedData.reduce((acc, item) => acc + parseInt(item.PIECES), 0),
        totalGrossWeight: parseFloat(updatedData.reduce((acc, item) => acc + parseFloat(item.GWT), 0).toFixed(3)),
        totalNetWeight: parseFloat(updatedData.reduce((acc, item) => acc + parseFloat(item.NWT), 0).toFixed(3)),
        totalWastage: parseFloat(updatedData.reduce((acc, item) => acc + parseFloat(item.totalWastage), 0).toFixed(3)),
        totalMc: currencyToNumber(updatedData.reduce((acc, item) => acc + currencyToNumber(item.totMc), 0)),
        totalAmount: updatedData.reduce((acc, item) => acc + currencyToNumber(item.totalAmount), 0),
      });
      setTagNo('');
    } catch (error) {
      console.error("Error fetching data: ", error);
      message.error("Failed to load category data!");
    }
  };
  const productColumns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      className: 'blue-background-column',
      width: 50,
      ellipsis: true,
    },
    {
      title: "Main Product",
      dataIndex: "MNAME", 
      width: 120,
      ellipsis: true,
    },
    {
      title: "Product Name",
      dataIndex: "PRODUCTNAME",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Tag No",
      dataIndex: "TAGNO",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Purity",
      dataIndex: "PURE_RATE",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Pieces",
      dataIndex: "PIECES",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Gross W.T",
      dataIndex: "GWT",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Less W.T",
      dataIndex: "LESS",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Net W.T",
      dataIndex: "NWT",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Rate",
      dataIndex: "RATE",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Metal Value",
      dataIndex: "metalValue",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Stone Cost",
      dataIndex: "ITEM_TOTAMT",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "CATEGORYNAME",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Wastage(%)",
      dataIndex: "WASTAGE",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Dir.Wast",
      dataIndex: "DIRECTWASTAGE",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Tot.Wast",
      dataIndex: "totalWastage",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Mc/G",
      dataIndex: "MAKINGCHARGES",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Dir.Mc",
      dataIndex: "DIRECTMC",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Tot.Mc",
      dataIndex: "totMc",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Value Added",
      dataIndex: "valueAdded",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Prefix",
      dataIndex: "PREFIX",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Brand",
      dataIndex: "BRAND",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Brand Amt",
      dataIndex: "BRANDAMT",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Dia Cts",
      dataIndex: "ITEM_DIAMONDS",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Dia Amount",
      dataIndex: "DIAMOND_AMOUNT",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Counter Name",
      dataIndex: "COUNTERNAME",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Dealer Name",
      dataIndex: "DEALERNAME",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Desc",
      dataIndex: "DESC1",
      width: 120,
      ellipsis: true,
    },
    {
      title: "HUID",
      dataIndex: "HUID",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Tag Size",
      dataIndex: "TAGSIZE",
      width: 100,
      ellipsis: true,
    },
    {
      title: "HSN Code",
      dataIndex: "HSNCODE",
      width: 100,
      ellipsis: true,
    }
  ];

  const stoneColumns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Pieces",
      dataIndex: "pieces",
      width: 80,
      ellipsis: true,
    },
    {
      title: "CTS",
      dataIndex: "cts",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Grams",
      dataIndex: "grams",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      ellipsis: true,
    },
    {
      title: "No.Pieces",
      dataIndex: "noPieces",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Colour",
      dataIndex: "colour",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Cut",
      dataIndex: "cut",
      width: 100,
      ellipsis: true,
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f9" }}>
      <Card>
          <Form form={form} layout="vertical">
            {/* Header Section */}
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={4}>
                <Form.Item label="Estimation No.">
                  <Input placeholder="11" />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Row gutter={16} style={{ backgroundColor: "#f0f7f4", padding: "15px", borderRadius: "8px" }}>
                  <Col span={4}>
                    <Form.Item label="22K">
                      <InputNumber style={{ width: "100%" }} defaultValue={8000.00} onChange={(value) => setCurrentRates({ ...currentRates, "22K": value })} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="18K">
                      <InputNumber style={{ width: "100%" }} defaultValue={8000.00} onChange={(value) => setCurrentRates({ ...currentRates, "18K": value })} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="24K">
                      <InputNumber style={{ width: "100%" }} defaultValue={0.00} onChange={(value) => setCurrentRates({ ...currentRates, "24K": value })} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="SILVER">
                      <InputNumber style={{ width: "100%" }} defaultValue={95.00} onChange={(value) => setCurrentRates({ ...currentRates, SILVER: value })} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="NON KDM">
                      <InputNumber style={{ width: "100%" }} defaultValue={0.00} onChange={(value) => setCurrentRates({ ...currentRates, "NON KDM": value })} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="PLATINUM">
                      <InputNumber style={{ width: "100%" }} defaultValue={0.00} onChange={(value) => setCurrentRates({ ...currentRates, PLATINUM: value })} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Customer Details Section */}
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item label="TAG NO">
                  <Input 
                    placeholder="11" 
                    onChange={(e) => setTagNo(e.target.value)} 
                    onPressEnter={() => getProductDetailsByTagNo(tagNo)}
                    onBlur={() => getProductDetailsByTagNo(tagNo)}
                    value={tagNo}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Customer Name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="City">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Mobile No">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Product Details and Estimation Total Section */}
            <Row gutter={16}>
              <Col span={17}>
                {/* Product Details Table */}
                <div style={{ marginBottom: "20px", }}>
                  <h3>PRODUCT DETAILS</h3>
                  <TableHeaderStyles>
                    <Table
                      displayName="productsData"
                      columns={productColumns}
                      dataSource={productsData}
                      size="small"
                      pagination={false}
                      scroll={{ x: true }}
                     // sticky={{ offsetHeader: 0 }}
                      style={{ height: "300px", overflowY: "auto" }}
                    />
                  </TableHeaderStyles>

                  {/* Totals Section */}
                  <div style={{ marginTop: '10px', backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '4px' }}>
                    <Row gutter={16} align="middle">
                      <Col span={2}>
                        <strong>Total:</strong>
                      </Col>
                      <Col span={2}>
                        <div style={{marginBottom: '4px'}}>
                          <small>T. Pieces</small>
                        </div>
                        <Input
                          value={totals.totalPieces}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={3}>
                        <div style={{marginBottom: '4px'}}>
                          <small>Gross Weight</small>
                        </div>
                        <Input
                          value={totals.totalGrossWeight}
                          disabled
                         style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={3}>
                        <div style={{marginBottom: '4px'}}>
                          <small>Net Weight</small>
                        </div>
                        <Input
                          value={totals.totalNetWeight}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={3}>
                        <div style={{marginBottom: '4px'}}>
                          <small>T. Wastage</small>
                        </div>
                        <Input
                          value={totals.totalWastage}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={4}>
                        <div style={{marginBottom: '4px'}}>
                          <small>MC</small>
                        </div>
                        <Input
                          value={currencyFormat(totals.totalMc)}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={4}>
                        <div style={{marginBottom: '4px'}}>
                          <small>T. Amount</small>
                        </div>
                        <Input
                          value={currencyFormat(totals.totalAmount)}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                      <Col span={3}>
                        <div style={{marginBottom: '4px'}}>
                          <small>Item Amount</small>
                        </div>
                        <Input
                          value={currencyFormat(0.0)}
                          disabled
                          style={{ width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Stone Details Table */}
                <div style={{ marginBottom: "20px", height: "300px", overflow: "hidden" }}>
                  <h3>STONE DETAILS</h3>
                  <TableHeaderStyles>
                    <Table
                      columns={stoneColumns}
                      dataSource={stoneData}
                      size="small"
                      pagination={false}
                      scroll={{ x: true }}
                      sticky={{ offsetHeader: 0 }}
                      style={{ height: "100%" }}
                    />
                  </TableHeaderStyles>
                </div>
              </Col>

              <Col span={7}>
                {/* Estimation Total Section */}
                <Card title="ESTIMATION TOTAL">
                  <Form.Item label="Total Amount">
                    <InputNumber style={{ width: "100%", textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}} value={currencyFormat(totals.totalAmount)} disabled />
                  </Form.Item>
                  <Form.Item label="GST Amount">
                    <InputNumber style={{ width: "100%" ,textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}} value={currencyFormat(totals.totalAmount * 0.18)} disabled />
                  </Form.Item>
                  <Form.Item label="Gross Amount">
                    <InputNumber style={{ width: "100%" ,textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}} value={currencyFormat(totals.totalAmount + totals.totalAmount * 0.18)} disabled />
                  </Form.Item>
                  <Form.Item label="Discount (%)">
                    <InputNumber style={{ width: "100%",textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}} value={0.00} />
                  </Form.Item>
                  <Form.Item label="Net Amount">
                    <InputNumber style={{ width: "100%" ,textAlign: 'right', fontWeight: 'bold', fontSize: '16px' ,color:'#000'}} value={currencyFormat(totals.totalAmount + totals.totalAmount * 0.18)} disabled />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            {/* Bottom Buttons */}
            <Row justify="end" gutter={16}>
              <Col>
                <Button type="primary">Save</Button>
              </Col>
              <Col>
                <Button>Print</Button>
              </Col>
              <Col>
                <Button>Cancel</Button>
              </Col>
            </Row>
          </Form>
      </Card>
    </div>
  );
};

export default Estimations;
