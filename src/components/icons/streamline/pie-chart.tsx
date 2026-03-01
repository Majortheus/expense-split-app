import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const StreamlinePieChartIcon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13"/><path d="M7 .5V7l4.6 4.6"/></g></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default StreamlinePieChartIcon;
