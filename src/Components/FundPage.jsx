import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";



const FundPage = ()=>{


    const [fundName,setFundName] = useState("");
   
    useEffect(()=>{

        const openpage = async()=>{

            const res = await fetch("/Final_Table.json");
            const data = await res.json();
            for(let j in data[params]){
                    setFundName(j);
                    break;
            }

        }

        
       openpage();

    },[]);
   
   return(<>

      <Typography variant="h5" gutterBottom>
            {fundName}
          </Typography>
    
    </>);
}


export default FundPage;