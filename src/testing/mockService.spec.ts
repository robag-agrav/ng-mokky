import { Mocked, MockedServices, mockService, mockServiceSandbox, provide, reset } from './mockService';

describe('mockService module', () => {
  class A {
    public propertyA_1 = 'A';
    public propertyA_2 = 123;
    public propertyA_3 = { a: { b: { c: { d: 'its a d' } } } };

    public functionA_1() {
      throw new Error('You should not have reached this');
      return 'pappada puppi';
    }

    public functionA_2() {
      throw new Error('You should not have reached this');
      return Math.PI;
    }

    public functionA_3() {
      throw new Error('You should not have reached this');
    }
  }

  class B extends A {
    public propertyB_1 = 'B';
    public propertyB_2 = 12334563456;
    public propertyB_3 = { a: { b: { c: { d: 'its not a d' } } } };

    constructor() {
      super();
    }

    public functionB_1() {
      throw new Error('You should not have reached this');
      return 'heooo!';
    }

    public functionB_2() {
      throw new Error('You should not have reached this');
      return Math.LOG10E;
    }

    public functionB_3() {
      throw new Error('You should not have reached this');
    }
  }

  class C extends B {
    public propertyC_1 = 'V';
    public propertyC_2 = 1231243;
    public propertyC_3 = { a: { b: { c: { d: 'it still not a d' } } } };

    constructor() {
      super();
    }

    public functionC_1() {
      throw new Error('You should not have reached this');
      return 'meh';
    }

    public functionC_2() {
      throw new Error('You should not have reached this');
      return Math.E;
    }

    public functionC_3() {
      throw new Error('You should not have reached this');
    }
  }

  describe('mockService function', () => {
    describe('mocking a simple class', () => {
      let mockA: Mocked<A>;

      beforeEach(() => {
        mockA = mockService(A, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } }
        });
      });

      it('should create a mock with the class\' public functions', () => {
        expect(mockA.functionA_1).toBeDefined();
        expect(mockA.functionA_2).toBeDefined();
        expect(mockA.functionA_3).toBeDefined();
      });

      it('should add spy functions to the mocked class', () => {
        // @ts-ignore
        expect(mockA.functionA_1()).toBeUndefined();
        // @ts-ignore
        expect(mockA.functionA_2()).toBeUndefined();
        // @ts-ignore
        expect(mockA.functionA_3()).toBeUndefined();

        mockA.functionA_1.mockReturnValue('alma');
        mockA.functionA_2.mockReturnValue(42);

        // @ts-ignore
        expect(mockA.functionA_1()).toEqual('alma');
        // @ts-ignore
        expect(mockA.functionA_2()).toEqual(42);
        // @ts-ignore
        expect(mockA.functionA_3()).toBeUndefined();
      });

      it('should be able to mock instance variables, by adding an overrides object', () => {
        expect(mockA.propertyA_1).toEqual('mock value 1');
        expect(mockA.propertyA_2).toEqual(42);
        expect(mockA.propertyA_3.a.b.c.d).toEqual('a very nested property');
      });
    });

    describe('mocking a class with one level of extend', () => {
      let mockB: Mocked<B>;

      beforeEach(() => {
        mockB = mockService(B, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } },
          propertyB_1: 'mock value 2',
          propertyB_2: 43,
          propertyB_3: { a: { b: { c: { d: 'a very nested property also' } } } }
        });
      });

      it('should create a mock with the class\' public functions', () => {
        expect(mockB.functionB_1).toBeDefined();
        expect(mockB.functionB_2).toBeDefined();
        expect(mockB.functionB_3).toBeDefined();

        expect(mockB.functionA_1).toBeDefined();
        expect(mockB.functionA_2).toBeDefined();
        expect(mockB.functionA_3).toBeDefined();
      });

      it('should add spy functions to the mocked class', () => {
        // @ts-ignore
        expect(mockB.functionB_1()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionB_2()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionB_3()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionA_1()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionA_2()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionA_3()).toBeUndefined();

        mockB.functionB_1.mockReturnValue('alma');
        mockB.functionB_2.mockReturnValue(42);
        mockB.functionA_1.mockReturnValue('alma');
        mockB.functionA_2.mockReturnValue(42);

        // @ts-ignore
        expect(mockB.functionB_1()).toEqual('alma');
        // @ts-ignore
        expect(mockB.functionB_2()).toEqual(42);
        // @ts-ignore
        expect(mockB.functionB_3()).toBeUndefined();
        // @ts-ignore
        expect(mockB.functionA_1()).toEqual('alma');
        // @ts-ignore
        expect(mockB.functionA_2()).toEqual(42);
        // @ts-ignore
        expect(mockB.functionA_3()).toBeUndefined();
      });

      it('should be able to mock instance variables, by adding an overrides object', () => {
        expect(mockB.propertyA_1).toEqual('mock value 1');
        expect(mockB.propertyA_2).toEqual(42);
        expect(mockB.propertyA_3.a.b.c.d).toEqual('a very nested property');
        expect(mockB.propertyB_1).toEqual('mock value 2');
        expect(mockB.propertyB_2).toEqual(43);
        expect(mockB.propertyB_3.a.b.c.d).toEqual('a very nested property also');
      });
    });

    describe('mocking a class with two level of extend', () => {
      let mockC: Mocked<C>;

      beforeEach(() => {
        mockC = mockService(C, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } },
          propertyB_1: 'mock value 2',
          propertyB_2: 43,
          propertyB_3: { a: { b: { c: { d: 'a very nested property also' } } } },
          propertyC_1: 'mock value 3',
          propertyC_2: 44,
          propertyC_3: { a: { b: { c: { d: 'a very nested property too' } } } }
        });
      });

      it('should create a mock with the class\' public functions', () => {
        expect(mockC.functionC_1).toBeDefined();
        expect(mockC.functionC_2).toBeDefined();
        expect(mockC.functionC_3).toBeDefined();

        expect(mockC.functionB_1).toBeDefined();
        expect(mockC.functionB_2).toBeDefined();
        expect(mockC.functionB_3).toBeDefined();

        expect(mockC.functionA_1).toBeDefined();
        expect(mockC.functionA_2).toBeDefined();
        expect(mockC.functionA_3).toBeDefined();
      });

      it('should add spy functions to the mocked class', () => {
        // @ts-ignore
        expect(mockC.functionC_1()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionC_2()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionC_3()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionB_1()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionB_2()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionB_3()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionA_1()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionA_2()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionA_3()).toBeUndefined();

        mockC.functionC_1.mockReturnValue('alma');
        mockC.functionC_2.mockReturnValue(42);
        mockC.functionB_1.mockReturnValue('alma');
        mockC.functionB_2.mockReturnValue(42);
        mockC.functionA_1.mockReturnValue('alma');
        mockC.functionA_2.mockReturnValue(42);

        // @ts-ignore
        expect(mockC.functionC_1()).toEqual('alma');
        // @ts-ignore
        expect(mockC.functionC_2()).toEqual(42);
        // @ts-ignore
        expect(mockC.functionC_3()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionB_1()).toEqual('alma');
        // @ts-ignore
        expect(mockC.functionB_2()).toEqual(42);
        // @ts-ignore
        expect(mockC.functionB_3()).toBeUndefined();
        // @ts-ignore
        expect(mockC.functionA_1()).toEqual('alma');
        // @ts-ignore
        expect(mockC.functionA_2()).toEqual(42);
        // @ts-ignore
        expect(mockC.functionA_3()).toBeUndefined();
      });

      it('should be able to mock instance variables, by adding an overrides object', () => {
        expect(mockC.propertyA_1).toEqual('mock value 1');
        expect(mockC.propertyA_2).toEqual(42);
        expect(mockC.propertyA_3.a.b.c.d).toEqual('a very nested property');
        expect(mockC.propertyB_1).toEqual('mock value 2');
        expect(mockC.propertyB_2).toEqual(43);
        expect(mockC.propertyB_3.a.b.c.d).toEqual('a very nested property also');
        expect(mockC.propertyC_1).toEqual('mock value 3');
        expect(mockC.propertyC_2).toEqual(44);
        expect(mockC.propertyC_3.a.b.c.d).toEqual('a very nested property too');
      });
    });
  });

  describe('reset function', () => {
    let mockC: Mocked<C>;

    beforeEach(() => {
      mockC = mockService(C, {
        propertyA_1: 'mock value 1',
        propertyA_2: 42,
        propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } },
        propertyB_1: 'mock value 2',
        propertyB_2: 43,
        propertyB_3: { a: { b: { c: { d: 'a very nested property also' } } } },
        propertyC_1: 'mock value 3',
        propertyC_2: 44,
        propertyC_3: { a: { b: { c: { d: 'a very nested property too' } } } }
      });
    });

    it('should reset a spied function on a mocked object', () => {
      // @ts-ignore
      mockC.functionA_1();
      // @ts-ignore
      mockC.functionA_2();
      // @ts-ignore
      mockC.functionA_3();
      // @ts-ignore
      mockC.functionB_1();
      // @ts-ignore
      mockC.functionB_2();
      // @ts-ignore
      mockC.functionB_3();
      // @ts-ignore
      mockC.functionC_1();
      // @ts-ignore
      mockC.functionC_2();
      // @ts-ignore
      mockC.functionC_3();

      expect(mockC.functionA_1).toHaveBeenCalled();
      expect(mockC.functionA_2).toHaveBeenCalled();
      expect(mockC.functionA_3).toHaveBeenCalled();
      expect(mockC.functionB_1).toHaveBeenCalled();
      expect(mockC.functionB_2).toHaveBeenCalled();
      expect(mockC.functionB_3).toHaveBeenCalled();
      expect(mockC.functionC_1).toHaveBeenCalled();
      expect(mockC.functionC_2).toHaveBeenCalled();
      expect(mockC.functionC_3).toHaveBeenCalled();

      reset(mockC.functionA_1);
      reset(mockC.functionA_2);
      reset(mockC.functionA_3);
      reset(mockC.functionB_1);
      reset(mockC.functionB_2);
      reset(mockC.functionB_3);
      reset(mockC.functionC_1);
      reset(mockC.functionC_2);
      reset(mockC.functionC_3);

      expect(mockC.functionA_1).not.toHaveBeenCalled();
      expect(mockC.functionA_2).not.toHaveBeenCalled();
      expect(mockC.functionA_3).not.toHaveBeenCalled();
      expect(mockC.functionB_1).not.toHaveBeenCalled();
      expect(mockC.functionB_2).not.toHaveBeenCalled();
      expect(mockC.functionB_3).not.toHaveBeenCalled();
      expect(mockC.functionC_1).not.toHaveBeenCalled();
      expect(mockC.functionC_2).not.toHaveBeenCalled();
      expect(mockC.functionC_3).not.toHaveBeenCalled();
    });

    it('should reset all spied function on a mocked object', () => {
      // @ts-ignore
      mockC.functionA_1();
      // @ts-ignore
      mockC.functionA_2();
      // @ts-ignore
      mockC.functionA_3();
      // @ts-ignore
      mockC.functionB_1();
      // @ts-ignore
      mockC.functionB_2();
      // @ts-ignore
      mockC.functionB_3();
      // @ts-ignore
      mockC.functionC_1();
      // @ts-ignore
      mockC.functionC_2();
      // @ts-ignore
      mockC.functionC_3();

      expect(mockC.functionA_1).toHaveBeenCalled();
      expect(mockC.functionA_2).toHaveBeenCalled();
      expect(mockC.functionA_3).toHaveBeenCalled();
      expect(mockC.functionB_1).toHaveBeenCalled();
      expect(mockC.functionB_2).toHaveBeenCalled();
      expect(mockC.functionB_3).toHaveBeenCalled();
      expect(mockC.functionC_1).toHaveBeenCalled();
      expect(mockC.functionC_2).toHaveBeenCalled();
      expect(mockC.functionC_3).toHaveBeenCalled();

      reset(mockC);

      expect(mockC.functionA_1).not.toHaveBeenCalled();
      expect(mockC.functionA_2).not.toHaveBeenCalled();
      expect(mockC.functionA_3).not.toHaveBeenCalled();
      expect(mockC.functionB_1).not.toHaveBeenCalled();
      expect(mockC.functionB_2).not.toHaveBeenCalled();
      expect(mockC.functionB_3).not.toHaveBeenCalled();
      expect(mockC.functionC_1).not.toHaveBeenCalled();
      expect(mockC.functionC_2).not.toHaveBeenCalled();
      expect(mockC.functionC_3).not.toHaveBeenCalled();
    });

    it('should reset all primitive overridden values of a mock object', () => {
      mockC.propertyA_1 = 'something else';
      mockC.propertyA_2 = 1243;
      mockC.propertyB_1 = 'something else';
      mockC.propertyB_2 = 1243;
      mockC.propertyC_1 = 'something else';
      mockC.propertyC_2 = 1243;

      reset(mockC);

      expect(mockC.propertyA_1).toBe('mock value 1');
      expect(mockC.propertyA_2).toBe(42);
      expect(mockC.propertyB_1).toBe('mock value 2');
      expect(mockC.propertyB_2).toBe(43);
      expect(mockC.propertyC_1).toBe('mock value 3');
      expect(mockC.propertyC_2).toBe(44);
    });

    it('should NOT reset non-primitive overridden values of a mock object', () => {
      mockC.propertyA_3 = { a: { b: { c: { d: 'a very nested property and pancakes' } } } };
      mockC.propertyB_3 = { a: { b: { c: { d: 'a very nested property also and pancakes' } } } };
      mockC.propertyC_3 = { a: { b: { c: { d: 'a very nested property too and pancakes' } } } };

      reset(mockC);

      expect(mockC.propertyA_3.a.b.c.d).toBe('a very nested property and pancakes');
      expect(mockC.propertyB_3.a.b.c.d).toBe('a very nested property also and pancakes');
      expect(mockC.propertyC_3.a.b.c.d).toBe('a very nested property too and pancakes');
    });

    xit('should handle Subject overridden values', () => {
      expect(false).toBeTruthy();
    });
  });

  describe('provide function', () => {
    it('should return a provider for the given service', () => {
      const mockA = mockService(A);
      const provider = provide(mockA);
      expect(provider.provide).toBe(A);
      expect(provider.useValue).toBe(mockA);
    });
  });

  describe('services function', () => {
    let services: MockedServices;

    beforeEach(() => {
      services = mockServiceSandbox(
        mockService(A, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } }
        }),
        mockService(B, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } },
          propertyB_1: 'mock value 2',
          propertyB_2: 43,
          propertyB_3: { a: { b: { c: { d: 'a very nested property also' } } } }
        }),
        mockService(C, {
          propertyA_1: 'mock value 1',
          propertyA_2: 42,
          propertyA_3: { a: { b: { c: { d: 'a very nested property' } } } },
          propertyB_1: 'mock value 2',
          propertyB_2: 43,
          propertyB_3: { a: { b: { c: { d: 'a very nested property also' } } } },
          propertyC_1: 'mock value 3',
          propertyC_2: 44,
          propertyC_3: { a: { b: { c: { d: 'a very nested property too' } } } }
        })
      );
    });

    afterEach(() => {
      services.reset();
    });

    describe('can collect all mocked services into one object', () => {
      describe('get function should return the mocked service', () => {
        describe('mocking a simple class', () => {
          it('should create a mock with the class\' public functions', () => {
            expect(services.get(A).functionA_1).toBeDefined();
            expect(services.get(A).functionA_2).toBeDefined();
            expect(services.get(A).functionA_3).toBeDefined();
          });

          it('should add spy functions to the mocked class', () => {
            // @ts-ignore
            expect(services.get(A).functionA_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(A).functionA_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(A).functionA_3()).toBeUndefined();

            services.get(A).functionA_1.mockReturnValue('alma');
            services.get(A).functionA_2.mockReturnValue(42);

            // @ts-ignore
            expect(services.get(A).functionA_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(A).functionA_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(A).functionA_3()).toBeUndefined();
          });

          it('should be able to mock instance variables, by adding an overrides object', () => {
            expect(services.get(A).propertyA_1).toEqual('mock value 1');
            expect(services.get(A).propertyA_2).toEqual(42);
            expect(services.get(A).propertyA_3.a.b.c.d).toEqual('a very nested property');
          });
        });

        describe('mocking a class with one level of extend', () => {
          it('should create a mock with the class\' public functions', () => {
            expect(services.get(B).functionB_1).toBeDefined();
            expect(services.get(B).functionB_2).toBeDefined();
            expect(services.get(B).functionB_3).toBeDefined();

            expect(services.get(B).functionA_1).toBeDefined();
            expect(services.get(B).functionA_2).toBeDefined();
            expect(services.get(B).functionA_3).toBeDefined();
          });

          it('should add spy functions to the mocked class', () => {
            // @ts-ignore
            expect(services.get(B).functionB_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionB_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionB_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionA_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionA_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionA_3()).toBeUndefined();

            services.get(B).functionB_1.mockReturnValue('alma');
            services.get(B).functionB_2.mockReturnValue(42);
            services.get(B).functionA_1.mockReturnValue('alma');
            services.get(B).functionA_2.mockReturnValue(42);

            // @ts-ignore
            expect(services.get(B).functionB_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(B).functionB_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(B).functionB_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(B).functionA_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(B).functionA_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(B).functionA_3()).toBeUndefined();
          });

          it('should be able to mock instance variables, by adding an overrides object', () => {
            expect(services.get(B).propertyA_1).toEqual('mock value 1');
            expect(services.get(B).propertyA_2).toEqual(42);
            expect(services.get(B).propertyA_3.a.b.c.d).toEqual('a very nested property');
            expect(services.get(B).propertyB_1).toEqual('mock value 2');
            expect(services.get(B).propertyB_2).toEqual(43);
            expect(services.get(B).propertyB_3.a.b.c.d).toEqual('a very nested property also');
          });
        });

        describe('mocking a class with two level of extend', () => {
          it('should create a mock with the class\' public functions', () => {
            expect(services.get(C).functionC_1).toBeDefined();
            expect(services.get(C).functionC_2).toBeDefined();
            expect(services.get(C).functionC_3).toBeDefined();

            expect(services.get(C).functionB_1).toBeDefined();
            expect(services.get(C).functionB_2).toBeDefined();
            expect(services.get(C).functionB_3).toBeDefined();

            expect(services.get(C).functionA_1).toBeDefined();
            expect(services.get(C).functionA_2).toBeDefined();
            expect(services.get(C).functionA_3).toBeDefined();
          });

          it('should add spy functions to the mocked class', () => {
            // @ts-ignore
            expect(services.get(C).functionC_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionC_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionC_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionB_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionB_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionB_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionA_1()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionA_2()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionA_3()).toBeUndefined();

            services.get(C).functionC_1.mockReturnValue('alma');
            services.get(C).functionC_2.mockReturnValue(42);
            services.get(C).functionB_1.mockReturnValue('alma');
            services.get(C).functionB_2.mockReturnValue(42);
            services.get(C).functionA_1.mockReturnValue('alma');
            services.get(C).functionA_2.mockReturnValue(42);

            // @ts-ignore
            expect(services.get(C).functionC_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(C).functionC_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(C).functionC_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionB_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(C).functionB_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(C).functionB_3()).toBeUndefined();
            // @ts-ignore
            expect(services.get(C).functionA_1()).toEqual('alma');
            // @ts-ignore
            expect(services.get(C).functionA_2()).toEqual(42);
            // @ts-ignore
            expect(services.get(C).functionA_3()).toBeUndefined();
          });

          it('should be able to mock instance variables, by adding an overrides object', () => {
            expect(services.get(C).propertyA_1).toEqual('mock value 1');
            expect(services.get(C).propertyA_2).toEqual(42);
            expect(services.get(C).propertyA_3.a.b.c.d).toEqual('a very nested property');
            expect(services.get(C).propertyB_1).toEqual('mock value 2');
            expect(services.get(C).propertyB_2).toEqual(43);
            expect(services.get(C).propertyB_3.a.b.c.d).toEqual('a very nested property also');
            expect(services.get(C).propertyC_1).toEqual('mock value 3');
            expect(services.get(C).propertyC_2).toEqual(44);
            expect(services.get(C).propertyC_3.a.b.c.d).toEqual('a very nested property too');
          });
        });
      });

      describe('reset function', () => {
        describe('should reset all mocked services', () => {
          it('should reset a spied function on a mocked object', () => {
            // @ts-ignore
            services.get(C).functionA_1();
            // @ts-ignore
            services.get(C).functionA_2();
            // @ts-ignore
            services.get(C).functionA_3();
            // @ts-ignore
            services.get(C).functionB_1();
            // @ts-ignore
            services.get(C).functionB_2();
            // @ts-ignore
            services.get(C).functionB_3();
            // @ts-ignore
            services.get(C).functionC_1();
            // @ts-ignore
            services.get(C).functionC_2();
            // @ts-ignore
            services.get(C).functionC_3();

            expect(services.get(C).functionA_1).toHaveBeenCalled();
            expect(services.get(C).functionA_2).toHaveBeenCalled();
            expect(services.get(C).functionA_3).toHaveBeenCalled();
            expect(services.get(C).functionB_1).toHaveBeenCalled();
            expect(services.get(C).functionB_2).toHaveBeenCalled();
            expect(services.get(C).functionB_3).toHaveBeenCalled();
            expect(services.get(C).functionC_1).toHaveBeenCalled();
            expect(services.get(C).functionC_2).toHaveBeenCalled();
            expect(services.get(C).functionC_3).toHaveBeenCalled();

            services.reset();

            expect(services.get(C).functionA_1).not.toHaveBeenCalled();
            expect(services.get(C).functionA_2).not.toHaveBeenCalled();
            expect(services.get(C).functionA_3).not.toHaveBeenCalled();
            expect(services.get(C).functionB_1).not.toHaveBeenCalled();
            expect(services.get(C).functionB_2).not.toHaveBeenCalled();
            expect(services.get(C).functionB_3).not.toHaveBeenCalled();
            expect(services.get(C).functionC_1).not.toHaveBeenCalled();
            expect(services.get(C).functionC_2).not.toHaveBeenCalled();
            expect(services.get(C).functionC_3).not.toHaveBeenCalled();
          });

          it('should reset all spied function on a mocked object', () => {
            // @ts-ignore
            services.get(A).functionA_1();
            // @ts-ignore
            services.get(A).functionA_2();
            // @ts-ignore
            services.get(A).functionA_3();
            // @ts-ignore
            services.get(B).functionB_1();
            // @ts-ignore
            services.get(B).functionB_2();
            // @ts-ignore
            services.get(B).functionB_3();
            // @ts-ignore
            services.get(C).functionC_1();
            // @ts-ignore
            services.get(C).functionC_2();
            // @ts-ignore
            services.get(C).functionC_3();

            expect(services.get(A).functionA_1).toHaveBeenCalled();
            expect(services.get(A).functionA_2).toHaveBeenCalled();
            expect(services.get(A).functionA_3).toHaveBeenCalled();
            expect(services.get(B).functionB_1).toHaveBeenCalled();
            expect(services.get(B).functionB_2).toHaveBeenCalled();
            expect(services.get(B).functionB_3).toHaveBeenCalled();
            expect(services.get(C).functionC_1).toHaveBeenCalled();
            expect(services.get(C).functionC_2).toHaveBeenCalled();
            expect(services.get(C).functionC_3).toHaveBeenCalled();

            services.reset();

            expect(services.get(A).functionA_1).not.toHaveBeenCalled();
            expect(services.get(A).functionA_2).not.toHaveBeenCalled();
            expect(services.get(A).functionA_3).not.toHaveBeenCalled();
            expect(services.get(B).functionB_1).not.toHaveBeenCalled();
            expect(services.get(B).functionB_2).not.toHaveBeenCalled();
            expect(services.get(B).functionB_3).not.toHaveBeenCalled();
            expect(services.get(C).functionC_1).not.toHaveBeenCalled();
            expect(services.get(C).functionC_2).not.toHaveBeenCalled();
            expect(services.get(C).functionC_3).not.toHaveBeenCalled();
          });

          it('should reset all primitive overridden values of a mock object', () => {
            services.get(A).propertyA_1 = 'something else';
            services.get(A).propertyA_2 = 1243;
            services.get(B).propertyB_1 = 'something else';
            services.get(B).propertyB_2 = 1243;
            services.get(C).propertyC_1 = 'something else';
            services.get(C).propertyC_2 = 1243;

            services.reset();

            expect(services.get(A).propertyA_1).toBe('mock value 1');
            expect(services.get(A).propertyA_2).toBe(42);
            expect(services.get(B).propertyB_1).toBe('mock value 2');
            expect(services.get(B).propertyB_2).toBe(43);
            expect(services.get(C).propertyC_1).toBe('mock value 3');
            expect(services.get(C).propertyC_2).toBe(44);
          });

          it('should NOT reset non-primitive overridden values of a mock object', () => {
            services.get(A).propertyA_3 = { a: { b: { c: { d: 'a very nested property and pancakes' } } } };
            services.get(B).propertyB_3 = { a: { b: { c: { d: 'a very nested property also and pancakes' } } } };
            services.get(C).propertyC_3 = { a: { b: { c: { d: 'a very nested property too and pancakes' } } } };

            services.reset();

            expect(services.get(A).propertyA_3.a.b.c.d).toBe('a very nested property and pancakes');
            expect(services.get(B).propertyB_3.a.b.c.d).toBe('a very nested property also and pancakes');
            expect(services.get(C).propertyC_3.a.b.c.d).toBe('a very nested property too and pancakes');
          });
        });
      });

      describe('providers function', () => {
        it('should return a provider array for the given services', () => {
          const providers = services.providers();
          expect(providers[0].provide).toBe(A);
          expect(providers[0].useValue).toBe(services.get(A));
          expect(providers[1].provide).toBe(B);
          expect(providers[1].useValue).toBe(services.get(B));
          expect(providers[2].provide).toBe(C);
          expect(providers[2].useValue).toBe(services.get(C));
        });
      });
    });
  });
});
