# ng-mokky goals

## General
* should be mostly low level, simple
* types should be correct always
* reduce the boilerplate as possible in test setups
* should work with jasmin and jest, somehow need to provide a way to set spyFunction

## Component Mocking
* inputs should be mirrored in mock
* outputs should be mirrored in mock
* every public method on the prototype chain should be present as an empty spy function
* instance variables should be able to set when declaring a mock

## Pipe Mocking
* is it enough to make a class with an empty transform function?
  * probably yes

## Directive Mocking 
* probably the same as components
* maybe structural directives differ?  

## Service Mocking
* every public method on the prototype chain should be present as an empty spy function
* instance variables should be able to set when declaring a mock

### Test Scenarios
* simple test
* chain of calls
* mocking getters and setters
* async testing
* mocking the HttpClient
* mocking the router
