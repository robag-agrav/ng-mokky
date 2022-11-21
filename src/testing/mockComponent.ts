import { Component } from '@angular/core';

interface ComponentMetadata {
  selector: string;
}

function extractComponentMetadata(component: any): ComponentMetadata {
  const metadataKey = 'ɵcmp';
  return {
    selector: component[ metadataKey ].selectors[ 0 ].join(' ')
  };
}

export function MockComponent<T>(component: T): T {
  const componentMetadata = extractComponentMetadata(component);

  const mockedComponent = Component({
    selector: componentMetadata.selector,
    template: '',
    inputs: [],
    outputs: []
  })(class {
  });

  return mockedComponent as unknown as T;
}
