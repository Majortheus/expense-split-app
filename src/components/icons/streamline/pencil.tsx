import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const StreamlinePencilIcon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 12.24L.5 13.5L1.76 9L10 .8a1 1 0 0 1 1.43 0l1.77 1.78a1 1 0 0 1 0 1.42z"/></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default StreamlinePencilIcon;
