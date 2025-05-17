import { XMLParser } from 'fast-xml-parser';

export function parseXML<T = any>(xml: string): T {
  const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  });
  
  return parser.parse(xml) as T;
  }