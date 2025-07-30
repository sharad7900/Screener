import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Table from "./Components/Table";

export default function App() {

  return (
    <>
      <BrowserRouter>
    <Routes>
       <Route path='*' element={<Table/>}/>
    </Routes>
    
    </BrowserRouter>
    </>);
}



