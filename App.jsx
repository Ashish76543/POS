
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Handle from "./Handle"
import Verify from "./Verify"
import Menu from "./Menu"
import ItemInsert from "./ItemInsert"
import Customer from "./Customer"
import Rights from "./Rights"
function App()
{
   return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Verify></Verify>}></Route>
      <Route path="/Handle" element={<Handle></Handle>}></Route>
      <Route path="/Menu" element={<Menu></Menu>}></Route>
      <Route path="/ItemInsert" element={<ItemInsert></ItemInsert>}></Route>
      <Route path="/Customer" element={<Customer></Customer>}></Route>
      <Route path="/Rights" element={<Rights></Rights>}></Route>
    </Routes>
    </BrowserRouter>
   )
}

export default App
