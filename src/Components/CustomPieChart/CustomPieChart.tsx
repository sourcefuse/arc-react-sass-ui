import React from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Tooltip as MuiTooltip, Typography } from "@mui/material";
import { pieChartStyles } from "./styles";
import Stack from "@mui/material/Stack";

export interface IPieData {
  name: string;
  value: number;
  color: string;
}
interface ICustomPieChart {
  data: IPieData[];
  width?: number;
  height?: number;
}
interface CustomLegendProps {
  payload?: any[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => (
  <Stack sx={pieChartStyles.legendsContainer}>
    {payload?.map((entry) => (
      <MuiTooltip
        key={`legend-item-${entry.value}`}
        title={entry.value}
        placement="bottom"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, -14] },
            },
          ],
        }}
      >
        <div style={pieChartStyles.legendValueContainer}>
          <span style={pieChartStyles.legendColor(entry?.color ?? "")}></span>
          <span style={pieChartStyles.legendText}>{entry.value}</span>
        </div>
      </MuiTooltip>
    ))}
  </Stack>
);

const CustomPieChart: React.FC<ICustomPieChart> = ({
  data,
  width = 300,
  height = 200,
}) => {
  if (data.length === 0) {
    return (
      <Typography height={height} style={pieChartStyles.noDataContainer}>
        No Data Available
      </Typography>
    );
  }
  return (
    <PieChart width={width} height={height}>
      <Pie data={data} innerRadius={50} outerRadius={60} dataKey="value">
        {data.map((entry) => (
          <Cell key={entry.name} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        iconType="circle"
        iconSize={10}
        layout="horizontal"
        align="center"
        content={CustomLegend}
      />
    </PieChart>
  );
};

export default CustomPieChart;
