import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const StreamlineDelete1Icon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m13.5.5l-13 13m0-13l13 13"/></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default StreamlineDelete1Icon;
