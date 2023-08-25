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
    const url = `${this.baseURL}/esummary.fcgi?db=pubmed&id=${id}&api_key=${this.apiKey}`;
    return this.http.get(url, {responseType: 'text'}).pipe(
      map((xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        return this.parseXml(xmlDoc);
      })
    );
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
        const nameAttr = (child as Element).getAttribute('Name');

        if (nameAttr) {
          result[nameAttr] = value;
        } else if (result[key]) {
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

  private parseXml(xml: Document) {
    const results = [];
    const docSums = xml.getElementsByTagName('DocSum');

    for (let i = 0; i < docSums.length; i++) {
      const docSum = docSums[i];
      const result: any = this.parseNode(docSum); // Get general structure

      // Overwrite or augment with specific parsing
      result.id = this.getTextContent(docSum, 'Id');
      result.pubDate = this.getTextContent(docSum, 'Item', 'PubDate');
      result.ePubDate = this.getTextContent(docSum, 'Item', 'EPubDate');
      result.source = this.getTextContent(docSum, 'Item', 'Source');
      result.lastAuthor = this.getTextContent(docSum, 'Item', 'LastAuthor');
      result.title = this.getTextContent(docSum, 'Item', 'Title');
      result.volume = this.getTextContent(docSum, 'Item', 'Volume');
      result.issue = this.getTextContent(docSum, 'Item', 'Issue');
      result.pages = this.getTextContent(docSum, 'Item', 'Pages');
      result.nlmUniqueID = this.getTextContent(docSum, 'Item', 'NlmUniqueID');
      result.ISSN = this.getTextContent(docSum, 'Item', 'ISSN');
      result.ESSN = this.getTextContent(docSum, 'Item', 'ESSN');
      result.recordStatus = this.getTextContent(docSum, 'Item', 'RecordStatus');
      result.pubStatus = this.getTextContent(docSum, 'Item', 'PubStatus');
      result.DOI = this.getTextContent(docSum, 'Item', 'DOI');
      result.hasAbstract = parseInt(this.getTextContent(docSum, 'Item', 'HasAbstract'), 10);
      result.pmcRefCount = parseInt(this.getTextContent(docSum, 'Item', 'PmcRefCount'), 10);
      result.fullJournalName = this.getTextContent(docSum, 'Item', 'FullJournalName');
      result.eLocationID = this.getTextContent(docSum, 'Item', 'ELocationID');
      result.SO = this.getTextContent(docSum, 'Item', 'SO');
      result.authorList = this.getListContent(docSum, 'AuthorList', 'Author');
      result.langList = this.getListContent(docSum, 'LangList', 'Lang');
      result.pubTypeList = this.getListContent(docSum, 'PubTypeList', 'PubType');
      result.articleIds = this.getListContent(docSum, 'ArticleIds', 'Item');
      result.history = this.getListContent(docSum, 'History', 'Item', true);
      result.references = this.getListContent(docSum, 'References', 'Item', true);
      // ... (other specific parsing)

      results.push(result);
    }

    console.log('Search results:', results);
    return results;
  }


  private getTextContent(parent: Element, tagName: string, attributeName?: string): string {
    const elements = parent.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (attributeName) {
        if (element.getAttribute('Name') === attributeName) {
          return element.textContent || '';
        }
      } else {
        return element.textContent || '';
      }
    }
    return '';
  }

  private getListContent(parent: Element, listName: string, itemName: string, asObject: boolean = false) {
    const list = [];
    const listElements = parent.getElementsByTagName(listName);
    for (let i = 0; i < listElements.length; i++) {
      const items = listElements[i].getElementsByTagName(itemName);
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (asObject) {
          const name = item.getAttribute('Name');
          const content = item.textContent || '';
          list.push({[name!]: content});
        } else {
          list.push(item.textContent || '');
        }
      }
    }
    return list;
  }
}
