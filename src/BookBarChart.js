import React, { useMemo } from "react";
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Bar } from "@visx/shape";

import useChartDimensions from "./hooks/useChartDimensions";

const chartDimensions = {
  marginLeft: 50,
  marginRight: 10,
  marginTop: 10,
  marginBottom: 50,
};

export default function BookBarChart(props) {
  const [wrapperDivRef, dimensions] = useChartDimensions(chartDimensions);

  const chartData = props.data
    .map((datum) => {
      return {
        date: new Date(
          parseInt(datum.checkoutyear),
          parseInt(datum.checkoutmonth)
        ),
        checkouts: parseInt(datum.checkouts),
      };
    })
    .sort(function (a, b) {
      return a.date - b.date;
    });

  const barWidth = (dimensions.boundedWidth / chartData.length) * 0.6;

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: extent(chartData.map((datum) => datum.date)),
        range: [barWidth / 2, dimensions.boundedWidth],
      }),
    [chartData, barWidth, dimensions.boundedWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: extent(chartData.map((datum) => datum.checkouts)),
        range: [dimensions.boundedHeight, 0],
        round: true,
      }),
    [chartData, dimensions.boundedHeight]
  );

  return (
    <div className="my-5">
      <h2 className="text-xl text-gray-700">{props.data[0].title}</h2>
      <h4 className="text-gray-500 ">By {props.data[0].creator} </h4>
      <div ref={wrapperDivRef} className="h-80 my-5">
        <svg width={dimensions.width} height={dimensions.height}>
          <Group top={dimensions.marginTop} left={dimensions.marginLeft}>
            <AxisBottom scale={xScale} top={dimensions.boundedHeight} />
            <AxisLeft scale={yScale} />
            {chartData.map((datum, index) => (
              <Bar
                key={`bar-${index}`}
                x={xScale(datum.date) - barWidth / 2}
                y={yScale(datum.checkouts)}
                width={barWidth}
                height={dimensions.boundedHeight - yScale(datum.checkouts)}
                className="chart-bar"
              />
            ))}
          </Group>
        </svg>
      </div>
    </div>
  );
}
