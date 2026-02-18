import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const StreamlinePieChartSolidIcon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M6.375.028A7 7 0 1 0 11.64 12.24L6.57 7.454A.63.63 0 0 1 6.376 7zm6.124 11.304A7 7 0 0 0 7.625.027v6.704z" clip-rule="evenodd"/></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default StreamlinePieChartSolidIcon;
