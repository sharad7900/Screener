import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import "./FundPage.css";
import { ColorModeButton } from "./ui/color-mode";
import { Box, Card, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import Footer from "./Footer";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { useLocation } from "react-router";



const FundPage = () => {

    const location = useLocation();
        const {id} = location.state || {};
    const [fundName, setFundName] = useState({});
    const [rows, setRows] = useState([]);
    
    const columns = [
        { field: "Company", headerName: "Asset", flex: 1.9 },
        { field: "ROCE", headerName: "ROCE", flex: 0.5 },
        { field: "ROE", headerName: "ROE", flex: 0.5 },
        { field: "P/E", headerName: "P/E", flex: 0.5 },
        { field: "Sales Var 5Yrs", headerName: "Sales Var", flex: 0.5 },
        { field: "Profit Var 5Yrs", headerName: "Profit", flex: 0.5 },
        { field: "OPM", headerName: "OPM", flex: 0.5 },
        { field: "CROIC", headerName: "CROIC", flex: 0.5 },
        { field: "Prom. Hold.", headerName: "Prom. Hold.", flex: 0.6 },
    ];
    const chart = useChart({
    data: [
      ...rows
    ],
    series: [{ name: "sale", color: "teal.solid" }],
  })

    useEffect(() => {
        
        const openpage = async () => {

            const response = await fetch(`https://screener-back.vercel.app/MFInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code: id })
            });

            const res = await response.json();
            const row = [];
            const Stocks_Data = await fetch("/Stocks_Data.json");
            const sd = await Stocks_Data.json();
            for (let i in res['selected_stock']) {
                row.push(sd[res['selected_stock'][i]]);
            }
            setRows(row);
            setFundName(res);
            
          
        }

       
        openpage();

    }, []);

    return (<>
        <div className="navbar">
            <ul>
                <li><Image rounded="md" src="sgc.png" alt="SGC" style={{ height: "50px" }} /></li>
                <li><ColorModeButton /></li>
            </ul>
        </div>
        <Typography variant="h4" gutterBottom textAlign={"center"} paddingY={"2%"} fontStyle={"italic"}>
            {fundName['MFName']}
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "5%" }}>
            
             <Typography variant="h5" gutterBottom textAlign={"left"} paddingY={"1%"} width={"60%"}>
            Equity Ratios:
        </Typography>
        <div style={{height:'500px', width:"60%", marginBottom: "3%"}}> 
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                getRowId={(row) => row.Company}
                rowHeight={40}
                // loading={loading}
                slots={{
                    //   loadingOverlay: CustomLoadingOverlay,
                }}
                style={{ border: "2px", borderStyle: "solid", fontFamily: "revert-layer"}}
            />
       </div>
            <Box bg="gray.300" color="gray.800" py={8} width={"60%"} border={"2px"} borderStyle={"solid"} borderColor={"black"} borderRadius={"5px"}>
                <Stack spacing={2}>
                    <Flex justify="space-between" wrap="wrap" align="flex-start">

                        <Box maxW="10%" mx={10}>
                            <Text fontWeight="semibold" mb={1}>NAV:</Text>
                            <Text fontSize="sm" textAlign={"center"}>
                                {fundName['nav']}
                            </Text>
                        </Box>

                        <Box maxW="10%" mx={10}>
                            <Text fontWeight="semibold" mb={1}>Inception Date:</Text>
                            <Text fontSize="sm" textAlign={"center"}>
                                {fundName['inception']}
                            </Text>
                        </Box>

                        <Box maxW="10%" mx={10}>
                            <Text fontWeight="semibold" mb={1}>%NAV Change:</Text>
                            <Text fontSize="sm" textAlign={"center"}>{fundName['change']}</Text>
                        </Box>
                        <Box maxW="10%" mx={10}>
                            <Text fontWeight="semibold" mb={1}>CAGR:</Text>
                            <Text fontSize="sm" textAlign={"center"}>{fundName['cagr']}</Text>
                        </Box>
                        <Box maxW="12%" mx={10}>
                            <Text fontWeight="semibold" mb={1}>Expense Ratio:</Text>
                            <Text fontSize="sm" textAlign={"center"}>{fundName['ter']}</Text>
                        </Box>
                    </Flex>


                </Stack>
            </Box>
            <Chart.Root maxH="sm" chart={chart} width={"60%"} mt={"10%"} mb={"8%"}>
                <LineChart data={fundName['graph']}>
                    <CartesianGrid stroke={chart.color("border")} vertical={false} />
                    <XAxis
                        axisLine={true}
                        dataKey={chart.key("markDate")}
                        tickFormatter={(markDate) => new Date(markDate).getFullYear()}
                        stroke={chart.color("border")}
                    />
                    <YAxis
                        axisLine={true}
                        tickLine={false}
                        tickMargin={10}
                        stroke={chart.color("border")}
                    />
                    <Tooltip
                        animationDuration={100}
                        cursor={false}
                        content={<Chart.Tooltip />}
                    />
                    {chart.series.map((item) => (
                        <Line
                            key={item.markDate}
                            isAnimationActive={true}
                            dataKey={chart.key('nav')}
                            // stroke={chart.color({ name: "sale", color: "teal.solid" })}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart.Root>

            <Box bg="gray.300" color="gray.800" py={8} width={"60%"} border={"2px"} borderStyle={"solid"} borderColor={"black"} borderRadius={"5px"}>
                <Stack>
                    <Flex justify="space-between" align="flex-start" px={10}>

                            <Text fontWeight="semibold" width={"125px"}>Exit Load: </Text>
                            <Text fontWeight={"normal"}>{fundName['exitload']}</Text>
                    </Flex>


                </Stack>
            </Box>
        </div>
        <div style={{ border: "2px", borderStyle: "solid", fontFamily: "revert-layer" }}>
            <Footer />
        </div>
    </>);
}


export default FundPage;