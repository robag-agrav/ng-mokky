//@ts-nocheck

import { ProviderToken } from '@angular/core';

export type Mocked<T> = {
  [Property in keyof T]:
  T[Property] extends (...args: any[]) => any
  ? jest.SpiedFunction<T[Property]>
  : T[Property];
};

export interface MockedServices {
  get<T>(token: ProviderToken<T>): Mocked<T>;
  providers(): {provide: ProviderToken<any>, useValue: any}[];
  reset(): void;
}

const MokkyKeys = {
  reset: Symbol('reset'),
  initialOverrideValues: Symbol('initialOverrideValues'),
  provide: Symbol('provide')
};

export function mockService<T>(service: ProviderToken<T>, overrides?: Partial<T>): Mocked<T> {
  let mockedService = {
    [ MokkyKeys.initialOverrideValues ]: {}
  };

  for (let propertyName of iterateOnProtoChain(service.prototype)) {
    addMockFunctionToObject(service, mockedService, propertyName);
  }

  if (overrides) {
    for (let [ propertyName, value ] of Object.entries(overrides)) {
      overridePropertyOnObject(mockedService, propertyName, value);
    }
  }

  mockedService[ MokkyKeys.reset ] = () => resetProperties(mockedService);

  mockedService[ MokkyKeys.provide ] = () => ({ provide: service, useValue: mockedService });

  return mockedService as Mocked<T>;
}

export function reset(mock) {
  if (mock[ MokkyKeys.reset ]) {
    mock[ MokkyKeys.reset ]();
  }
}

export function provide(mock) {
  if (mock[ MokkyKeys.provide ]) {
    return mock[ MokkyKeys.provide ]();
  }
}

export function mockServiceSandbox(...services: Mocked<T>[]): MockedServices {
  const mockedServices = new Map<ProviderToken<any>, Mocked<any>>();

  for (let service of services) {
    const {provide: key, useValue: value} = provide(service);
    mockedServices.set(key, value);
  }

  function get(token: ProviderToken<T>): Mocked<T> {
    return mockedServices.get(token);
  }

  function providers() {
    const result = [];
    for (let service of mockedServices.values()) {
      result.push(provide(service));
    }
    return result;
  }

  function resetAll() {
    for (let service of mockedServices.values()) {
      reset(service);
    }
  }

  return {
    get,
    providers,
    reset: resetAll
  };
}

function addMockFunctionToObject(service, mockObject, propertyName) {
  if (typeof (service.prototype[ propertyName ]) === 'function') {
    mockObject[ propertyName ] = jest.fn();
    mockObject[ propertyName ][ MokkyKeys.reset ] = () => {
      mockObject[ propertyName ].mockReset();
    };
  }
}

function overridePropertyOnObject(mockObject, propertyName, value) {
  mockObject[ propertyName ] = value;

  if (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'string' ||
    typeof value === 'symbol'
  ) {
    mockObject[ MokkyKeys.initialOverrideValues ][ propertyName ] = value;
  }
}

function resetProperties(mockedService) {
  for (let value of Object.values(mockedService)) {
    reset(value);
  }

  for (let [ propertyName, value ] of Object.entries(mockedService[ MokkyKeys.initialOverrideValues ])) {
    mockedService[ propertyName ] = value;
  }
}

function* iterateOnProtoChain<T>(obj) {
  for (let propertyName of Object.getOwnPropertyNames(obj)) {
    if (propertyName !== 'constructor') {
      yield propertyName;
    }
  }

  const prototype = Object.getPrototypeOf(obj);

  if (prototype && prototype !== Object) {
    yield* iterateOnProtoChain(prototype);
  }
}
