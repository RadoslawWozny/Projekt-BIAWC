import logo from './logo.svg';
import './App.css';
import NavMenu from './NavMenu';
import { Routes, Route } from "react-router-dom";
import UserCart from "./UserCart";
import Kawy from "./Kawy";
import Nowosci from "./Nowosci";
import Herbaty from "./Herbaty";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";


function App() {


  return (
    <div className="App">
      <NavMenu />



<Routes>
  <Route path ="/" element={<Home/>} />
   <Route path="/koszyk" element={<UserCart />} />
  <Route path="/koszyk/:userId" element={<UserCart />} />
     <Route path="/nowosci" element={<Nowosci />} />
      <Route path="/kawy" element={<Kawy />} />
      <Route path="/herbaty" element={<Herbaty />} />
      <Route path="/login" element={<Login />} />
       <Route path="/rejestracja" element={<Register />} />
</Routes>


    </div>
  );
}

export default App;
