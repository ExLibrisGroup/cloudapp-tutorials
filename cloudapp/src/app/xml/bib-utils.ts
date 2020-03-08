import { CloudAppRestService, HttpMethod } from "@exlibris/exl-cloudapp-angular-lib";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Bib {
  link: string,
  mms_id: string;
  title: string;
  author: string;
  record_format: string;
  anies: any;
}

export class BibUtils {
  private _restService: CloudAppRestService;

  constructor(restService: CloudAppRestService) {
    this._restService = restService;
  }

  /** Retrieve a single BIB record */
  getBib (mmsId: string): Observable<Bib> {
    return this._restService.call(`/bibs/${mmsId}`);
  }   

  /** Update a BIB record with the specified MARCXML */
  updateBib( bib: Bib ): Observable<Bib> {
    return this._restService.call( {
      url: `/bibs/${bib.mms_id}`,
      headers: { 
        "Content-Type": "application/xml",
        Accept: "application/json" },
      requestBody: `<bib>${bib.anies}</bib>`,
      method: HttpMethod.PUT
    });
  }    

  /** Adds a 500 note field to a MARC21 Bibliographic Record */
  addNoteToBib(bib: Bib) {
    const doc = new DOMParser().parseFromString(bib.anies, "application/xml");
    const datafield = dom("datafield", { 
      parent: doc.documentElement, 
      attributes: [ ["tag", "500"], ["ind1", " "], ["ind2", " "] ]
    });
    dom("subfield", { 
      parent: datafield, 
      text: `Record processed at ${(new Date()).toLocaleString()}`, 
      attributes: [ ["code", "a"] ]
    });
    bib.anies = new XMLSerializer().serializeToString(doc.documentElement);
    return bib;
  }   
}

/** Adds Element to dom and returns it */
const dom = (name: string, options: {parent?: Element | Node, text?: 
  string, className?: string, id?: string, attributes?: string[][]} = {}
  ): Element => {

  let ns = options.parent ? options.parent.namespaceURI : '';
  let element = document.createElementNS(ns, name);

  if (options.parent) options.parent.appendChild(element);
  if (options.text) element.innerHTML = options.text;
  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.attributes) options.attributes.forEach(([att, val]) => element.setAttribute(att, val));

  return element;  
}