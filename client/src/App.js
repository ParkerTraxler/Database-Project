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
import EditAccount from './pages/EditAccount.jsx'
import MakeDonation from './pages/MakeDonation.jsx';
import ManagerDashboard from './managerPages/ManagerDashboard.jsx';
import EmployeeDashboard from './employeePages/EmployeeDashboard.jsx'; 
import EditManagerAccount from './managerPages/EditManagerAccount.jsx';
import ManageEmployees from './managerPages/ManageEmployees.jsx';
import ManageEvents from './managerPages/ManageEvents.jsx';
import ManageExhibits from './managerPages/ManageExhibits.jsx';
import ManagerAccountDetails from './managerPages/ManagerAccountDetails.jsx';
import EditAccountEmployee from './employeePages/EditAccountEmployee'
import ViewAccountEmployee from './employeePages/AccountDetailsEmployee'

import ManageCollections from './employeePages/ManageCollections.jsx';
import ManagerAddCollection from './employeePages/ManagerAddCollection.jsx'
import ManagerEditCollection from './employeePages/ManagerEditCollection.jsx';
import AddEmployee from './managerPages/AddEmployee.jsx';
import EditEmployee from './managerPages/EditEmployee.jsx';
import CreateExhibit from './managerPages/CreateExhibit.jsx';
import CreateSpecialExhibit from './managerPages/CreateSpecialExhibit.jsx';
import EditExhibit from './managerPages/EditExhibit.jsx';
import EditSpecialExhibit from './managerPages/EditSpecialExhibits.jsx';
import ViewDonations from './managerPages/ViewDonations.jsx';
import ManageCollectionArt from './employeePages/ManageCollectionArt.jsx';
import CreateArtwork from './employeePages/CreateArtwork.jsx';
import EditArtwork from './employeePages/EditArtwork.jsx';
import CollectionArt from './pages/CollectionArt.jsx';
import EmployeeExhibitReport from './managerPages/EmployeeExhibitReport.jsx';
import ManageTickets from './managerPages/ManageTickets.jsx';
import EditTicket from './managerPages/EditTicket.jsx';
import ManageGiftShop from './employeePages/ManageGiftShop.jsx';
import EditItem from './employeePages/EditItem.jsx';
import CreateItem from './employeePages/CreateItem.jsx';

import LogTransactions from './employeePages/LogTransactions.jsx';
import GiftShopSalesReport from './managerPages/GiftShopSalesReport.jsx';
import CustomersReport from './managerPages/CustomersReport.jsx';
import EditHistoryReport from './managerPages/EditHistoryReport.jsx';
import ExhibitCollections from './pages/ExhibitCollections.jsx';
import MiscellaneousArt from './pages/MiscellaneousArt.jsx';
import MiscellaneousCollections from './pages/MiscellaneousCollections.jsx';
import CreateEvent from './managerPages/CreateEvent.jsx';
import EditEvent from './managerPages/EditEvent.jsx';
import Navbar from "./Navbar.js"
import Footer from "./Footer.jsx"
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import ProtectedManagerRoutes from './utils/ProtectedManagerRoutes.jsx';
import ProtectedEmployeeRoutes from './utils/ProtectedEmployeeRoutes.jsx';
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
          
          <Route path="/collection-art/:Title" element={<CollectionArt/>}/>
          <Route path="/exhibit-collections/:ExhibitID" element={<ExhibitCollections/>}/>
          <Route path="/miscellaneous-artwork" element={<MiscellaneousArt/>}/>
          <Route path="/miscellaneous-collections" element={<MiscellaneousCollections/>}/>
          
          

          <Route element={<ProtectedRoutes/>}>
            <Route path="/write-review" element={<WriteReview/>}/>
            <Route path="/edit-review" element={<EditReview/>}/>
            <Route path="/account-details" element={<AccountDetails/>}/>
            <Route path="/account-details/edit" element={<EditAccount/>}/>
            <Route path="/make-donation" element={<MakeDonation/>}/>
          </Route>

          <Route element={<ProtectedEmployeeRoutes/>}>
			      <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/> 
            <Route path="/edit-employee-account" element={<EditAccountEmployee/>}/>
            <Route path="/employee-account-details" element={<ViewAccountEmployee/>}/>
          
            <Route path="/manage-collections" element={<ManageCollections/>}/>
            <Route path="/add-collection" element={<ManagerAddCollection/>}/>
            <Route path="/edit-collection/:Title" element={<ManagerEditCollection/>}/>
            <Route path="/manage-collection-art/:Title" element={<ManageCollectionArt/>}/>
            <Route path="/add-artwork/:Title" element={<CreateArtwork/>}/>
            <Route path="/edit-artwork/:ArtID" element={<EditArtwork/>}/>
            <Route path="/manage-gift-shop" element={<ManageGiftShop/>}/>
            <Route path="/edit-item/:GiftShopName/:ItemID" element={<EditItem/>}/>
            <Route path="/add-item" element={<CreateItem/>}/>
            <Route path="/log-transactions" element={<LogTransactions/>}/>
          </Route>

          <Route element={<ProtectedManagerRoutes/>}>
            <Route path="/manager-dashboard" element={<ManagerDashboard/>}/>
            <Route path="/manage-events" element={<ManageEvents/>}/>
            <Route path="/manage-exhibits" element={<ManageExhibits/>}/>
            <Route path="/manage-employees" element={<ManageEmployees/>}/>
            <Route path="/manager-account-details" element={<ManagerAccountDetails/>}/>
            <Route path="/edit-manager-account" element={<EditManagerAccount/>}/>
            <Route path="/add-employee" element={<AddEmployee/>}/>
            <Route path="/edit-employee/:Email" element={<EditEmployee/>}/>
            <Route path="/add-exhibit" element={<CreateExhibit/>}/>
            <Route path="/add-special-exhibit" element={<CreateSpecialExhibit/>}/>
            <Route path="/edit-exhibit/:ExhibitID" element={<EditExhibit/>}/>
            <Route path="/edit-special-exhibit/:ExhibitID" element={<EditSpecialExhibit/>}/>
            <Route path="/view-donations" element={<ViewDonations/>}/>
            <Route path="/employee-exhibit-report" element={<EmployeeExhibitReport/>}/>
            <Route path="/manage-tickets" element={<ManageTickets/>}/>
            <Route path="/edit-ticket/:ItemID" element={<EditTicket/>}/>
            
            <Route path="/gift-shop-sales-report" element={<GiftShopSalesReport/>}/>
            <Route path="/customers-report" element={<CustomersReport/>}/>
            <Route path="/edit-history-report" element={<EditHistoryReport/>}/>
            <Route path="/add-event" element={<CreateEvent/>}/>
            <Route path="/edit-event/:EventID" element={<EditEvent/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;
