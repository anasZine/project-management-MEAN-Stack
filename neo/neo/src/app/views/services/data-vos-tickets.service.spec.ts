import { TestBed } from '@angular/core/testing';

import { DataVosTicketsService } from './data-vos-tickets.service';

describe('DataVosTicketsService', () => {
  let service: DataVosTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataVosTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
