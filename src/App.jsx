import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Table from "./Components/Table";
import FundPage from "./Components/FundPage";

export default function App() {

  return (
    <>
      <BrowserRouter>
    <Routes>
       <Route path='*' element={<Table/>}/>
       <Route path='/' element={<Table/>}/>
       <Route path='/MFinfo' element={<FundPage/>}/>
    </Routes>
    
    </BrowserRouter>
    </>);
}



