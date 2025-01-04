import React, { useState } from 'react';
import { Breadcrumb, Tabs, Card } from 'antd';
import ProductWiseSale from './ProductWiseSale';
import CounterWiseSale from './CounterWiseSale';

const { TabPane } = Tabs;

const SalesReportsMain = () => {
    const [activeKey, setActiveKey] = useState("1");

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <>
            <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#595959' }}>
                <Breadcrumb.Item>Reports</Breadcrumb.Item>
                <Breadcrumb.Item>Sales</Breadcrumb.Item>
            </Breadcrumb>
            <Card style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginTop: '16px' }}>
                <Tabs activeKey={activeKey} onChange={handleTabChange} tabBarStyle={{ fontSize: '12px' }} className="custom-tabs">
                    <TabPane tab="Product Wise Sale" key="1">
                        <ProductWiseSale />
                    </TabPane>
                    <TabPane tab="Counter Wise Sale" key="2">
                        <CounterWiseSale />
                    </TabPane>
                    <TabPane tab="Purity Wise Sale" key="3">
                        {/* Content for the third tab */}
                    </TabPane>
                </Tabs>
            </Card>
        </>
    );
};

export default SalesReportsMain;
