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
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";


function App() {

const categories = [
  {
    id: "kawy",
    label: "Kawy",
    path: "/kawy",
    children: [
      { id: "kawa1", label: "kawa1", path: "/kawy/kawa1" },
      { id: "kawa2", label: "kawa2", path: "/kawy/kawa2" },
      { id: "kawa3", label: "kawa3", path: "/kawy/kawa3" }
    ]
  },
  {
    id: "herbaty",
    label: "Herbaty",
    path: "/herbaty",
    children: [
      { id: "herbata1", label: "herbata1", path: "/herbaty/herbata1" },
      { id: "herbata2", label: "herbata2", path: "/herbaty/herbata2" }
    ]
  }
];





  return (
    <div className="App">
      <NavMenu />



<Routes>
<Route path="/:category/:productId" element={<ProductPage />} />
<Route path="/:category/:categoryId" element={<CategoryPage />} />

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
