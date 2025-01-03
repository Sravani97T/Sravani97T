import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "../src/Components/DashboardLayout";
import Dashboard from "../src/Components/Pages/Dashboard";
import Settings from "../src/Components/Pages/Settings";
import Profile from "../src/Components/Pages/Profile";
import MainProduct from "./Components/Masters/MainProduct";
import ProductCategory from "./Components/Masters/ProductCategory";
import ProductMaster from "./Components/Masters/ProductMaster";
import CounterMaster from "./Components/Masters/CounterMaster";
import CategoryMaster from "./Components/Masters/CategoryMaster";
import PrefixMaster from "./Components/Masters/PrefixMaster";
import StoneItemMaster from "./Components/Masters/StoneItemMaster";
import BrandMaster from "./Components/Masters/BrandMaster";
import Manufacturer from "./Components/Masters/Manufacturer";
import JewelryTypeMaster from "./Components/Masters/JewelryTypeMaster";
import BankMaster from "./Components/Masters/BankMaster";
import MailBook from "./Components/Masters/MailBook";
import EmployeeMaster from "./Components/Masters/EmployeeMaster";
import AccountGroup from "./Components/Masters/AccountGroup";
import DaimondRate from "./Components/Masters/DaimondRateFix";
import JournalEntryMaster from "./Components/Masters/JournalEntryMaster";
import StateMaster from "./Components/Masters/StateMaster";
import OnlineMode from "./Components/Masters/OnlineMode";
import DailyRates from "./Components/Estimation/DailyRates";
import LotCreation from "./Components/Inventory/LotCreation/LotCreation";
import TagGeneration from "./Components/Inventory/LotCreation/TagGeneration/TagGeneration";
import DailyRatesReports from "./Components/Reports/DailyRatesReports";
import BankStatementReport from "./Components/Reports/BankStatementReport";
import ProductTable from "./Components/Reports/MastersReports";
import BillMasterReport from "./Components/Reports/BillMasterReport";
const App = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Masters */}
          <Route path="/main-product" element={<MainProduct />} />
          <Route path="/product-category" element={<ProductCategory />} />
          <Route path="/product-master" element={<ProductMaster />} />
          <Route path="/counter-master" element={<CounterMaster />} />
          <Route path="/category-master" element={<CategoryMaster />} />
          <Route path="/prefix-master" element={<PrefixMaster />} />
          <Route path="/stone-item-master" element={<StoneItemMaster />} />
          <Route path="/brand-master" element={<BrandMaster />} />
          <Route path="/manufacturer-master" element={<Manufacturer />} />
          <Route path="/jewelry-type-master" element={<JewelryTypeMaster />} />
          <Route path="/bank-master" element={<BankMaster />} />
          <Route path="/mail-book" element={<MailBook />} />
          <Route path="/employee-master" element={<EmployeeMaster />} />
          <Route path="/account-group" element={<AccountGroup />} />
          <Route path="/journal-entry-master" element={<JournalEntryMaster />} />
          <Route path="/state-master" element={<StateMaster />} />
          <Route path="/diamond-rate-fix" element={<DaimondRate />} />
          <Route path="/online-mode" element={<OnlineMode />} />
          {/* estimation */}
          <Route path="/daily-rates" element={<DailyRates />} />
          {/* inventory */}
          <Route path="/lot-creation" element={<LotCreation />} />
          <Route path="/tag-generation" element={<TagGeneration/>} />
          <Route path="/masters-report" element={<ProductTable/>} />
          <Route path="/dailyrates-report" element={<DailyRatesReports/>} />
          <Route path="/bankstatement-report" element={<BankStatementReport/>} />
          <Route path="/billmaster-report" element={<BillMasterReport/>} />

          

          
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;
