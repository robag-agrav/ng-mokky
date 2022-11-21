import { TestBed } from '@angular/core/testing';
import { mockService, mockServiceSandbox } from '../../testing/mockService';
import { AlmaService } from './alma.service';
import { BarackService } from './barack.service';
import { DioService } from './dio.service';
import { LencseService } from './lencse.service';

import { SUTService } from './sut.service';

describe('SUTService', () => {
  const services = mockServiceSandbox(
    mockService(AlmaService),
    mockService(DioService),
    mockService(BarackService),
    mockService(LencseService),
  );

  let SUT: SUTService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...services.providers(),
      ]
    });
    SUT = TestBed.inject(SUTService);
  });

  afterEach(() => {
    services.reset();
  });

  it('should be created', () => {
    expect(SUT).toBeTruthy();
  });

  it('example test', () => {
    SUT.callServices();

    expect(services.get(AlmaService).blah).toHaveBeenCalled();
    expect(services.get(DioService).blah).toHaveBeenCalled();
    expect(services.get(BarackService).blah).toHaveBeenCalled();
    expect(services.get(LencseService).blah).toHaveBeenCalled();
  });
});
