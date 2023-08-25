import {Component} from '@angular/core';
import {NcbiService} from "../../services/ncbi/ncbi.service";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {jsPDF} from "jspdf";
import {trigger, transition, style, animate, query, stagger} from '@angular/animations';

function addWrappedText(pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    pdf.text(lines[i], x, y);
    y += lineHeight;
  }
  return y;
}

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition('* <=> *', [
        query(':enter', [
          style({opacity: 0, transform: 'translateY(100%)'}),
          stagger('100ms', [
            animate('500ms ease-in', style({opacity: 1, transform: 'translateY(0%)'}))
          ])
        ], {optional: true}),
        query(':leave', animate('500ms ease-out', style({opacity: 0})), {optional: true})
      ])
    ])
  ]
})
export class SearchPageComponent {
  entrezNumber: string = '';
  searchResults: any;
  error: string | null = null;
  tooltipMessage: string = '';

  constructor(
    private ncbiService: NcbiService,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
  }

  search() {
    this.ncbiService.getSummaryById(this.entrezNumber).subscribe((results) => {
      this.searchResults = results.slice(0, 2);
      this.error = null;

      for (const result of results) {
        if (result.Organism && result.Organism.ScientificName !== 'Homo sapiens') {
          this.searchResults = null;
          this.error = "No Homo Sapien found";
          return;
        }
      }
    });
  }

  isEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/landing-page']);
    });
  }

  downloadPdf(result: any) {
    const pdf = new jsPDF();
    let y = 10;

    const addProperty = (label: string, value: any) => {
      if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object') {
        if (this.isEmptyObject(value)) return;
        value = JSON.stringify(value);
      }
      if (value !== undefined && value !== null && value !== '') {
        y = addWrappedText(pdf, `${label}: ${value}`, 10, y, 180, 7);
      }
    };

    addProperty('Name', result.Name);
    addProperty('Description', result.Description);
    addProperty('Summary', result.Summary)
    addProperty('Status', result.Status);
    addProperty('Chromosome', result.Chromosome);
    addProperty('Genetic Source', result.GeneticSource);
    addProperty('Map Location', result.MapLocation);
    addProperty('Other Designations', result.OtherDesignations);
    addProperty('Gene Weight', result.GeneWeight);
    addProperty('Chromosome Sort', result.ChrSort);
    addProperty('Chromosome Start', result.ChrStart);
    addProperty('Other Aliases', result.OtherAliases);
    addProperty('Nomenclature Symbol', result.NomenclatureSymbol);
    addProperty('Nomenclature Name', result.NomenclatureName);
    addProperty('Nomenclature Status', result.NomenclatureStatus);
    addProperty('DOI', result.DOI);

    pdf.save(result.Name.replace(/[<>:"/\\|?*]+/g, '_') + '.pdf');
  }

  isSearchDisabled(): boolean {
    const numbers = this.entrezNumber.split(' ').map(n => n.trim());
    const hasDuplicates = new Set(numbers).size !== numbers.length;

    if (hasDuplicates) {
      this.tooltipMessage = 'Please enter each number only once.';
      return true;
    }

    this.tooltipMessage = '';
    return false;
  }
}
