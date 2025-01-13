// import React from "react";
// import { Row, Col } from "antd";
// function HomeGrid({ data = [] }) {
//   return (
//     <Row>
//       {data?.map((item, index) => (
//         <Col span={6} key={index}>
//           <div
//             style={{
//               backgroundColor: "#EEE",
//               padding: 15,
//               margin: 5,
//               borderRadius: 10,
//               minHeight: 100,
//             }}
//           >
//             <div style={{ fontSize: 26, fontWeight: "bold" }}>{item.title}</div>
//             <div>{item.total}</div>
//             {item.summary &&
//               Object.keys(item.summary).map((key, index) => (
//                 <div key={index}>
//                   <div>
//                     {key}: {item.summary[key] || 0}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </Col>
//       ))}
//     </Row>
//   );
// }

// export default HomeGrid;
import React from "react";
import { Row, Col } from "antd";

function HomeGrid({ data = [] }) {
  if (!Array.isArray(data)) {
    console.error("HomeGrid expects data to be an array", data);
    return <div>Error: Invalid data format</div>;
  }

  return (
    <Row>
      {data.map((item, index) => {
        if (!item || typeof item !== "object") {
          console.warn("Skipping invalid item at index", index, item);
          return null;
        }

        return (
          <Col span={6} key={index}>
            <div
              style={{
                backgroundColor: "#EEE",
                padding: 15,
                margin: 5,
                borderRadius: 10,
                minHeight: 100,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: "bold" }}>{item.title || "N/A"}</div>
              <div>{item.total !== undefined ? item.total : "N/A"}</div>
              {item.summary &&
                typeof item.summary === "object" &&
                Object.keys(item.summary).map((key, idx) => (
                  <div key={idx}>
                    {key}: {item.summary[key] || 0}
                  </div>
                ))}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default HomeGrid;
