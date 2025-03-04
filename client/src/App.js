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
import Navbar from "./Navbar.js"

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/log-in" element={<LogIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/gift-shop" element={<GiftShop/>}/>
          <Route path="/reviews" element={<Reviews/>}/>
          <Route path="/write-review" element={<WriteReview/>}/>
          <Route path="/edit-review" element={<EditReview/>}/>
          <Route path="/tickets" element={<Tickets/>}/>
          <Route path="/events" element={<Events/>}/>
          <Route path="/exhibits" element={<Exhibits/>}/>
          <Route path="/collections" element={<Collections/>}/>
          <Route path="/account-details" element={<AccountDetails/>}/>
          <Route path="/report-problem" element={<ReportProblem/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
