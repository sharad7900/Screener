import { useNavigate } from "react-router";
import "./ListOfSearch.css";

const ListOfSearch = ({params})=>{

    const navigate = useNavigate();

    const handelClick = (values)=>{
        console.log(params.NameToId[values]);
        navigate("/MFinfo",{ state: { id: params.NameToId[values] } });
    }

    return(<>
    
    {params.filteredFunds.map((values,idx)=>(
        <div key={idx} className="results" onClick={()=>handelClick(values)}><p>{values}</p></div>
    ))}
    </>)
}

export default ListOfSearch;