import { Button, Image, Input, InputGroup, List, ListItem } from "@chakra-ui/react";
import "./Welcome.css";
import { TypeAnimation } from "react-type-animation";
import Footer from "./Footer";
import { useNavigate } from "react-router";
import { useState } from "react";
import finalTable from "./Final_Table.json";
import { BiSearch } from "react-icons/bi";
import ListOfSearch from "./ListOfSearch";
const Welcome = () => {


    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFunds, setFilteredFunds] = useState([]);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/Screens");

    }

    const fundNames = Object.values(finalTable).map((fund) => Object.keys(fund)[0]);
    const NameToId = Object.fromEntries(
        Object.entries(finalTable).map(([id, obj]) => [Object.keys(obj)[0], id])
    );
    const handleSearchChange = (e) => {


        const value = e.target.value;

        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredFunds([]);
        } else {
            const matches = fundNames.filter((name) =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredFunds(matches);
        }

    }



    return (<>




        <div className="bgimage">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", marginTop: "2%", left: "22%" }}>
                <pre style={{ fontSize: "2.5vw", fontWeight: "bold", fontFamily: "arial" }}>Find the right pick with </pre>
                <TypeAnimation style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#EB03FF", display: "inline-block" }}
                    sequence={[
                        " Mutual Fund Screener",
                    ]}

                    speed={50}
                />
            </div>

            <div style={{ position: "absolute", textAlign: "center", width: "100%", top: "17%", fontSize: "1.2vw" }}>
                The tool you need to make wise & effective investment decisions
            </div>

            <div style={{ position: "absolute", textAlign: "center", width: "100%", top: "47%" }}>
                <Button fontSize={"20px"} background={"white"} p={"1%"} pt={"1.5%"} pb={"1.5%"} color={"black"} boxShadow={"5px 5px 10px 2px rgba(0, 0, 0, 0.5)"} onClick={handleClick}>Enter in Screener &rarr;</Button>
            </div>



            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "77%", height: "200px", width: "600px", boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.5)", borderRadius: "10px", backgroundColor: "#d4d4d8" }}>
                <p style={{ color: "black", textAlign: "center", paddingTop: "4%", fontSize: "25px" }}>Search the scheme name: </p>



                <div style={{ margin: "5% 15% 0% 15%", display: "flex", alignItems: "center", backgroundColor: "white", padding: "1%", borderRadius: "10px", border: "2px solid gray" }}>
                    <BiSearch color="black" size={"25px"} />
                    <Input fontSize={"15px"} placeholder="Search Mutual Fund Scheme" value={searchTerm} onChange={handleSearchChange} p={2} border={"none"} color={"black"}  w={"100%"}/>
                
                </div>
                {filteredFunds.length>0 ? <div style={{ margin: "2% 15% 0% 15%", backgroundColor: "white", padding: "1%", borderRadius: "10px", border: "2px solid gray", maxHeight:"200px", overflowY:"scroll" }}>
                <ListOfSearch params = {{filteredFunds,NameToId}}/>
               </div>: ""
}
                
              
            </div>
            
        </div>
        <div><Footer /></div>

    </>);


}

export default Welcome;

