# When should I unsubscribe from RxJS observables in Angular components?

## TL;DR
It depends on what you do in your subscription, whether you should unsubscribe or not.
A best practice that has been used by myself in many projects was
- In general: Don't unsubscribe when using ``HttpClient``. It is only necessary when you have logic affecting 
global application state in the subscription because it eventually completes.
- Everywhere else: Pipe the observable and use ``takeUntilDestroyed``. Although it is not necessary in some cases,
it prevents forgetting it somewhere.

See [Unsubscription methods](UNSUBSCRIPTION_METHODS.md) for the possibilities for unsubscription and details
how to correctly unsubscribe.

See [Examples](EXAMPLES.md) for info on how to run the example Angular app, where you can verify the findings yourself
and where the different unsubscription methods can be tried.

## Intro
There's a lot of confusion in the community about the question if and when you have to unsubscribe manually
from RxJS observables in Angular components.

Although there are some quite nice StackOverflow posts about this question, there is no clear guide 
that contains all relevant information explained by examples.

### Angular components and observables
Our guide focuses on issues with components using observables. 

A typical component lifecycle in an Angular CRUD application contains the following steps (simplified version):
1. User navigates to component ``A``
2. Component ``A`` gets initialized (constructor and ``ngOnInit`` are invoked)
3. Some logic is called to load data (e.g. using ``HttpClient``).  
   _Subscriptions to observables are made._
4. User navigates to another component ``B``
5. Component ``A`` gets destroyed (``ngOnDestroy`` is invoked)
6. ...

This repository provides a guide explaining when you have to unsubscribe manually from subscriptions
 (when component ``A`` gets destroyed).

## A guide for common situations
Whether you have to unsubscribe or not depends on the callback logic you are using in the observables' subscription.

### Side effects
If the callback logic from the subscription executes code with side effects (affecting global application state) 
you should always consider to manually unsubscribe when the component gets destroyed. 
Otherwise, the current and correct application state can be falsely overwritten by callback execution from an 
already destroyed component.

### Observables that don't complete
If the subscription callback from an observables that does not eventually complete uses member variables from the component, 
the destroyed component cannot be garbage collected, thus resulting in a memory leak. 
Therefore, you should always unsubscribe in that case.

Even if not using a components variable in the callback, observables that don't eventually complete (for example an observable emitting a value each second) should be cancelled always, 
since the callback logic from the destroyed component still runs (infinitely) in the background otherwise.

### Angular HttpClient
The Angular ``HttpClient`` creates an observable that eventually completes. Therefore it is prone to unwanted side effects 
but not to memory leaks.

### Angular ActivatedRoute
For observables from the ``ActivatedRoute`` you do not have to unsubscribe manually.

From the official Angular docs:
> The ActivatedRoute and its observables are insulated from the Router itself.
> The Router destroys a routed component when it is no longer needed and the injected ActivatedRoute dies with it.

### Angular Router events
For Angular Router events (``NavigationStart``, ``NavigationEnd``, ...) , i.e. 
```
constructor(private router: Router) {
  this.router.events.subscribe((event) => {
    // some logic
  });
}
```
you may have to manually unsubscribe.

### Overview
When you should unsubscribe when the component gets destroyed.

|                                        | Side effects | Memory leaks | Should unsubscribe |
|----------------------------------------|--------------|--------------|--------------------|
| _Observables that don't complete_      | Possible (1) | Possible (2) | Yes                |
| _Observables that eventually complete_ | Possible (1) | No (3)       | Depends (1)        |
| _Angular HttpClient_                   | Possible (1) | No (3)       | Depends (1)        |
| _Angular ActivatedRoute_               | No           | No           | No (4)             |
| _Angular Router events_                | Possible (1) | Possible (2) | Yes                |

(1): If you execute methods with side effects in the subscription callback.  
(2): If you use member variables from the component in the subscription callback.  
(3): Assuming the observable completes.  
(4): You don't have to, but are free to unsubscribe anyway.

## Other resources
### Angular/RxJs When should I unsubscribe from Subscription:
https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription

### Is it necessary to unsubscribe from observables created by Http methods?
https://stackoverflow.com/questions/35042929/is-it-necessary-to-unsubscribe-from-observables-created-by-http-methods
