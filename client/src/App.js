import './App.css';
import FrontPage  from './pages/FrontPage'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import GiftShop from './pages/GiftShop'
import Reviews from './pages/Reviews'
import WriteReview from './pages/WriteReview'
import EditReview from './pages/EditReview'
import Tickets from './pages/Tickets'
import Events from './pages/Events'
import Exhibits from './pages/Exhibits'
import Collections from './pages/Collections'
import AccountDetails from './pages/AccountDetails'
import ReportProblem from './pages/ReportProblem'
import EditAccount from './pages/EditAccount.jsx'
import ManagerDashboard from './managerPages/ManagerDashboard.jsx';
import EditManagerAccount from './managerPages/EditManagerAccount.jsx';
import ManageCollections from './managerPages/ManageCollections.jsx';
import ManageEmployees from './managerPages/ManageEmployees.jsx';
import ManageEvents from './managerPages/ManageEvents.jsx';
import ManageExhibits from './managerPages/ManageExhibits.jsx';
import ManagerAccountDetails from './managerPages/ManagerAccountDetails.jsx';
import Navbar from "./Navbar.js"
import Footer from "./Footer.jsx"
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import ProtectedManagerRoutes from './utils/ProtectedManagerRoutes.jsx';
import { AuthProvider } from './utils/AuthContext.js';


import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  
  return (
    <div className="App">
      <AuthProvider>
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/log-in" element={<LogIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/gift-shop" element={<GiftShop/>}/>
          <Route path="/reviews" element={<Reviews/>}/>
          
          <Route path="/tickets" element={<Tickets/>}/>
          <Route path="/events" element={<Events/>}/>
          <Route path="/exhibits" element={<Exhibits/>}/>
          <Route path="/collections" element={<Collections/>}/>
          
          <Route path="/report-problem" element={<ReportProblem/>}/>
          
          

          <Route element={<ProtectedRoutes/>}>
            <Route path="/write-review" element={<WriteReview/>}/>
            <Route path="/edit-review" element={<EditReview/>}/>
            <Route path="/account-details" element={<AccountDetails/>}/>
            <Route path="/account-details/edit" element={<EditAccount/>}/>
          </Route>

          <Route element={<ProtectedManagerRoutes/>}>
            <Route path="/manager-dashboard" element={<ManagerDashboard/>}/>
            <Route path="/manage-collections" element={<ManageCollections/>}/>
            <Route path="/manage-events" element={<ManageEvents/>}/>
            <Route path="/manage-exhibits" element={<ManageExhibits/>}/>
            <Route path="/manage-employees" element={<ManageEmployees/>}/>
            <Route path="/manager-account-details" element={<ManagerAccountDetails/>}/>
            <Route path="/edit-manager-account" element={<EditManagerAccount/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;
