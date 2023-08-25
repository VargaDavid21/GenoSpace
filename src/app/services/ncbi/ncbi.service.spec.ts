import { TestBed } from '@angular/core/testing';

import { NcbiService } from './ncbi.service';

describe('NcbiService', () => {
  let service: NcbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NcbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
