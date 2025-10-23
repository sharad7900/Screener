import { useNavigate } from "react-router";
import "./ListOfSearch.css";

const ListOfSearch = ({params})=>{

    const navigate = useNavigate();

    const handelClick = (values)=>{
        navigate("/MFinfo",{ state: { id: values.ISIN } });
    }

    return(<>
    
    {params.filteredFunds.map((values,idx)=>(
        <div key={values.ISIN} className="results" onClick={()=>handelClick(values)}><p>{values.Scheme}</p></div>
    ))}
    </>)
}

export default ListOfSearch;