import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashBoard from './pages/dashboard';
import NewQuote from './pages/newQuote';
import Cw from './pages/casementWindow';
import Sw from './pages/slidingWindow';
import Cd from './pages/casementDoor';
import Sd from './pages/slidingDoor';
import Vent from './pages/ventilators';
import Test from './pages/test';
import Upvc from './pages/upvc';
import Quote from './pages/quote';
import Quotedet from './pages/quotesdet';
import Quotee from './pages/quotees';
import Download from './pages/download';
import Schedule from './pages/cuttingSchedule';
import Tests from './pages/testss';
import Default from './pages/defaultProfile';
import Custom from './pages/customCost';
import AddUser from './pages/addUser';
import Account from './pages/account';
import Editcasementwindows from './pages/editcasementWindow';
import Editslidingwindows from './pages/editslidingWindow';
import Editcasementdoor from './pages/editcasementDoor';
import Editslidingdoor from './pages/editslidingDoor';
import Editventilator from './pages/editventilator';
import Invoice from './pages/invoice';
import Employee from './pages/addemployee';
import Client from './pages/client';
import Clientdetails from './pages/clientsdetails';
import Employees from './pages/employees';
import Users from './pages/user';
import User from './pages/userdetail';
import Monthlyreport from './pages/monthlyreport';
import Clientreport from './pages/clientreport';
import Itemreport from './pages/itemreport';
import Quotationreport from './pages/quotationreport';
import Hardwarereport from './pages/hardwarerepot';
import Fixed from './pages/fixed';
import EditFixed from './pages/editFixed';
import TopHung from './pages/topHung';
import EditTopHung from './pages/editTopHung';
import UploadJson from './pages/uploadProfile';
import ViewClientreport from './pages/viewclientreport';
import NewCuttingSchedule from './pages/cuttingSchedule/cuttingSchedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/logout" element={<Navigate to="/" replace />} />
        <Route path="/create-quotation" element={<NewQuote />} />
        <Route path="/casement-window" element={<Cw />} />
        <Route path="/sliding-window" element={<Sw />} />
        <Route path="/casement-door" element={<Cd />} />
        <Route path="/sliding-door" element={<Sd />} />
        <Route path="/ventilators" element={<Vent />} />
        <Route path="/test" element={<Test />} />
        <Route path="/select" element={<Upvc />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/quotesdet" element={<Quotedet />} />
        <Route path="/quotees" element={<Quotee />} />
        <Route path="/download" element={<Download />} />
        <Route path="/cutting-schedule" element={<Schedule />} />
        <Route path="/testss" element={<Tests />} />
        <Route path="/default" element={<Default />} />
        <Route path="/settings" element={<Custom />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/account" element={<Account />} />
        <Route path="/editcasementWindow" element={<Editcasementwindows />} />
        <Route path="/editslidingWindow" element={<Editslidingwindows />} />
        <Route path="/editcasementDoor" element={<Editcasementdoor />} />
        <Route path="/editslidingDoor" element={<Editslidingdoor />} />
        <Route path="/editventilator" element={<Editventilator />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/addemployee" element={<Employee />} />
        <Route path="/client" element={<Client />} />
        <Route path="/clientsdetails" element={<Clientdetails />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/user" element={<Users />} />
        <Route path="/userdetail" element={<User />} />
        <Route path="/monthlyreport" element={<Monthlyreport />} />
        <Route path="/clientreport" element={<Clientreport />} />
        <Route path="/itemreport" element={<Itemreport />} />
        <Route path="/quotationreport" element={<Quotationreport />} />
        <Route path="/hardwarereport" element={<Hardwarereport />} />
        <Route path="/fixed-windows" element={<Fixed />} />
        <Route path="/edit-fixed" element={<EditFixed />} />
        <Route path="/top-hung" element={<TopHung />} />
        <Route path="/edit-top-hung" element={<EditTopHung />} />
        <Route path="/uploadprofile" element={<UploadJson />} />
        <Route path="/viewclient-report" element={<ViewClientreport />} />
        <Route path="/new-cutting-schedule" element={<NewCuttingSchedule />} />
        {/* Fallback all other routes to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 