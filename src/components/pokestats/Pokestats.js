import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Pokestats = ({ stats, maxStat }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 200;
    const height = 20;

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", height)
      .transition()
      .attr("width", (width / maxStat) * stats)
      .attr("fill", "rgba(251,204,10, 0.6)");

    svg
      .append("text")
      .attr("class", "statsNumber")
      .attr("x", (width / maxStat) * stats + 5)
      .attr("y", (height / 4) * 3)
      .transition()
      .delay(200)
      .text(stats)
      .attr("fill", "#0F2917");
  }, [maxStat, stats]);

  return (
    <div>
      <svg
        ref={svgRef}
        width="200"
        height="20"
        style={{ overflow: "visible" }}
      />
    </div>
  );
};

export default Pokestats;
