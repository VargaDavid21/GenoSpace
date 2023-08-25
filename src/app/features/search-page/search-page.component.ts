import {Component} from '@angular/core';
import {NcbiService} from "../../services/ncbi/ncbi.service";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {jsPDF} from "jspdf";

function addWrappedText(pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    pdf.text(lines[i], x, y);
    y += lineHeight; // increment y by lineHeight for every line
  }
  return y; // return the updated y value
}

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
  entrezNumber: string = '';
  searchResults: any;

  constructor(
    private ncbiService: NcbiService,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
  }

  search() {
    this.ncbiService.getSummaryById(this.entrezNumber).subscribe((results) => {
      this.searchResults = results;
      console.log('Search results:', results);
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/landing-page']); // Navigate to the landing page
    });
  }

  downloadPdf(result: any) {
    const pdf = new jsPDF();
    let y = 10;

    const addProperty = (label: string, value: any) => {
      if (Array.isArray(value)) {
        value = value.join(', ');
      }
      if (value !== undefined && value !== null && value !== '' && (typeof value !== 'object' || value.length > 0)) {
        y = addWrappedText(pdf, `${label}: ${value}`, 10, y, 180, 7);
      }
    };

    addProperty('ID', result.id);
    addProperty('Publication Date', result.pubDate);
    addProperty('ePub Date', result.ePubDate);
    addProperty('Source', result.source);
    addProperty('Last Author', result.lastAuthor);
    addProperty('Title', result.title);
    addProperty('Volume', result.volume);
    addProperty('Issue', result.issue);
    addProperty('Pages', result.pages);
    addProperty('Nlm Unique ID', result.nlmUniqueID);
    addProperty('ISSN', result.ISSN);
    addProperty('ESSN', result.ESSN);
    addProperty('Record Status', result.recordStatus);
    addProperty('Publication Status', result.pubStatus);
    addProperty('DOI', result.DOI);
    addProperty('Has Abstract', result.hasAbstract);
    addProperty('PMC Ref Count', result.pmcRefCount);
    addProperty('Full Journal Name', result.fullJournalName);
    addProperty('eLocation ID', result.eLocationID);
    addProperty('SO', result.SO);
    addProperty('Author List', result.authorList.join(', '));
    addProperty('Language List', result.langList.join(', '));
    addProperty('Publication Type List', result.pubTypeList.join(', '));
    addProperty('Article IDs', result.articleIds.join(', '));

    pdf.save(result.title.replace(/[<>:"/\\|?*]+/g, '_') + '.pdf');
  }
}
