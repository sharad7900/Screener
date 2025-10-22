import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Table from "./Components/Table";
import FundPage from "./Components/FundPage";
import Welcome from "./Components/Welcome";
import BasicHeatmap from "./Components/Heatmap";

export default function App() {

  return (
    <>
      <BrowserRouter>
    <Routes>
       <Route path='*' element={<Welcome/>}/>
       <Route path='/' element={<Welcome/>}/>
       <Route path='/MFinfo' element={<FundPage/>}/>
       <Route path='/Screens' element={<Table/>}/>
       <Route path='/Heat' element={<BasicHeatmap/>}/>
    </Routes>
    
    </BrowserRouter>
    </>);
}



