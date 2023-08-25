import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NcbiService {
  private baseURL: string = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  private apiKey: string = 'af4fcb2ea3ac6fc7624784bdb6a87ec0db09';

  constructor(private http: HttpClient) {
  }

  getSummaryById(id: string): Observable<any> {
    const url = `${this.baseURL}/esummary.fcgi?db=gene&id=${id}&api_key=${this.apiKey}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        return this.parseXml(xmlDoc);
      })
    );
  }

  private parseXml(xml: Document) {
    const results = [];
    const docSums = xml.getElementsByTagName('DocumentSummary');

    for (let i = 0; i < docSums.length; i++) {
      const docSum = docSums[i];
      const result: any = this.parseNode(docSum);
      results.push(result);
    }
    return results;
  }

  private parseNode(node: Node): any {
    const result: any = {};
    const children = node.childNodes;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.nodeType === 3 && child.textContent && child.textContent.trim() !== '') {
        return child.textContent.trim();
      }

      if (child.nodeType === 1) {
        const key = child.nodeName;
        const value = this.parseNode(child);

        if (result[key]) {
          if (Array.isArray(result[key])) {
            result[key].push(value);
          } else {
            result[key] = [result[key], value];
          }
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }
}
