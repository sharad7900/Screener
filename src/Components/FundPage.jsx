import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import "./FundPage.css";
import { ColorModeButton } from "./ui/color-mode";
import {
    Box,
    Card,
    Flex,
    Image,
    SimpleGrid,
    Spinner,
    Text,
    Stack,
} from "@chakra-ui/react";
import Footer from "./Footer";
import { DataGrid } from "@mui/x-data-grid";
import { Chart, useChart } from "@chakra-ui/charts";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useLocation } from "react-router";

const FundPage = () => {
    const [selectedRange, setSelectedRange] = useState("Max");
    const [filteredGraphData, setFilteredGraphData] = useState([]);

    const location = useLocation();
    const { id } = location.state || {};
    const [fundName, setFundName] = useState({});
    const [rows, setRows] = useState([]);

    const getFilteredGraph = (range, graphData = []) => {
        const now = new Date();
        let fromDate = new Date();

        switch (range) {
            case "1D":
                fromDate.setDate(now.getDate() - 1);
                break;
            case "5D":
                fromDate.setDate(now.getDate() - 5);
                break;
            case "1M":
                fromDate.setMonth(now.getMonth() - 1);
                break;
            case "6M":
                fromDate.setMonth(now.getMonth() - 6);
                break;
            case "YTD":
                fromDate = new Date(now.getFullYear(), 0, 1);
                break;
            case "1Y":
                fromDate.setFullYear(now.getFullYear() - 1);
                break;
            case "3Y":
                fromDate.setFullYear(now.getFullYear() - 3);
                break;
            case "5Y":
                fromDate.setFullYear(now.getFullYear() - 5);
                break;
            case "Max":
            default:
                return graphData;
        }

        fromDate.setHours(0, 0, 0, 0);

        const filtered = graphData.filter((item) => {
            const mark = new Date(item.markDate);
            return mark >= fromDate;
        });

        return filtered.length > 0 ? filtered : graphData;
    };

    const columns = [
        { field: "name", headerName: "Asset", flex: 1.5 },
        { field: "assetClass", headerName: "Asset Class", flex: 0.7 },
        { field: "sector", headerName: "Sector", flex: 1 },
        { field: "perc", headerName: "%Hold", flex: 0.5 },
    ];

    const chart = useChart({
        data: filteredGraphData,
        series: [{ name: "sale", color: "teal.solid" }],
    });

    useEffect(() => {
        const openpage = async () => {
            const response = await fetch(`https://screener-back.vercel.app/MFInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: id }),
            });

            const res = await response.json();
            setRows(res["asset"]);
            setFundName(res);
            const fullGraph = res["graph"] || [];
            setFilteredGraphData(getFilteredGraph("Max", fullGraph));
        };

        openpage();
    }, []);

    return (
        <>
            {/* Navbar */}
            <Box
                className="navbar"
                as="nav"
                px={{ base: 4, md: 8 }}
                py={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.100"
                flexWrap="wrap"
            >
                <Image rounded="md" src="sgc.png" alt="SGC" h="50px" />
                <ColorModeButton />
            </Box>

            {fundName["MFName"] ? (
                <div className="responsive">
                <Box px={{ base: 4, md: "10%" }} py={6}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign={"center"}
                        paddingY={"2%"}
                        fontStyle={"italic"}
                    >
                        {fundName["MFName"]}
                    </Typography>

                    {/* Holdings Table */}
                    <Typography
                        variant="h5"
                        gutterBottom
                        textAlign={"left"}
                        py={2}
                        width="100%"
                    >
                        Holdings:
                    </Typography>

                    <Box
                        height="500px"
                        width="100%"
                        mb={20}
                        sx={{ overflowX: "auto" }}
                        
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            getRowId={(row) => row.name}
                            rowHeight={40}
                            sortModel={[
                                {
                                    field: "perc",
                                    sort: "desc",
                                },
                            ]}
                            sx={{
                                border: "1px solid",
                                fontFamily: "revert-layer",
                            }}
                        />
                    </Box>

                    {/* Fund Info */}
                    <Box
                        bg="gray.300"
                        color="gray.800"
                        py={6}
                        px={4}
                        border="2px solid"
                        borderColor="black"
                        borderRadius="5px"
                        mb={20}
                    >
                        <Flex
                            justify="space-around"
                            wrap="wrap"
                            gap={6}
                            textAlign="center"
                        >
                            {[
                                { label: "NAV", value: fundName["nav"] },
                                { label: "Inception Date", value: fundName["inception"] },
                                { label: "%NAV Change", value: fundName["change"] },
                                { label: "CAGR", value: fundName["cagr"] },
                                { label: "Expense Ratio", value: fundName["ter"] },
                            ].map((item, i) => (
                                <Box key={i} minW="100px">
                                    <Text fontWeight="semibold" mb={1}>
                                        {item.label}:
                                    </Text>
                                    <Text fontSize="sm">{item.value}</Text>
                                </Box>
                            ))}
                        </Flex>
                    </Box>

                    {/* Range Selector */}
                    <Flex
                        justify="flex-end"
                        gap={2}
                        flexWrap="wrap"
                        mb={10}
                    >
                        {["5D", "1M", "6M", "YTD", "1Y", "3Y", "5Y", "Max"].map((range) => (
                            <Box
                                key={range}
                                as="button"
                                px={3}
                                py={1}
                                border="1px solid gray"
                                borderRadius="md"
                                bg={selectedRange === range ? "teal.300" : "gray.100"}
                                fontWeight="medium"
                                onClick={() => {
                                    setSelectedRange(range);
                                    setFilteredGraphData(
                                        getFilteredGraph(range, fundName["graph"] || [])
                                    );
                                }}
                            >
                                {range}
                            </Box>
                        ))}
                    </Flex>

                    {/* Chart */}
                    <Box overflowX="auto" mb={20}>
                        <Chart.Root maxH="sm" chart={chart} minW={{ base: "100%", md: "60%" }} mb={8}>
                            <AreaChart data={filteredGraphData}>
                                <CartesianGrid stroke={chart.color("border")} vertical={false} />
                                <XAxis
                                    dataKey={chart.key("markDate")}
                                    tickFormatter={(markDate) =>
                                        new Date(markDate).getFullYear()
                                    }
                                    stroke={chart.color("border")}
                                />
                                <YAxis tickLine={false} tickMargin={10} stroke={chart.color("border")} />
                                <Tooltip
                                    animationDuration={100}
                                    cursor={false}
                                    content={<Chart.Tooltip />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={chart.key("nav")}
                                    stroke="#008080"
                                    fill="#008080"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </Chart.Root>
                    </Box>

                    {/* Exit Load */}
                    <Box
                        bg="gray.300"
                        color="gray.800"
                        py={4}
                        mt={10}
                        px={4}
                        border="2px solid"
                        borderColor="black"
                        borderRadius="5px"
                    >
                        <Flex
                            justify="flex-start"
                            align="flex-start"
                            flexWrap="wrap"
                            gap={4}
                        >
                            <Text fontWeight="semibold" minW="125px">
                                Exit Load:
                            </Text>
                            <Text>{fundName["exitload"]}</Text>
                        </Flex>
                    </Box>
                </Box>
                </div>
            ) : (
                <Box className="spinner" textAlign="center" py={20}>
                    <Spinner size="xl" />
                </Box>
            )}

            {/* Footer */}
            <Box border="2px solid" fontFamily="revert-layer" mt={6}>
                <Footer />
            </Box>
        </>
    );
};

export default FundPage;
