# Recommended ways to unsubscribe
One way is to assign the subscription to a class property and manually unsubscribe in ``ngOnDestroy``.
```
private subscription: Subscription;

ngOnInit() {
    this.subscription = timer(0, 1000)
      .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
      });
}

ngOnDestroy() {
    // Avoid side effects and memory leak by unsubscribing:
    this.subscription.unsubscribe();
}
```

However, it's not feasible for large applications with many subscriptions,
as its cumbersome to write and introduces a lot of obfuscating code.

Another way of handling it, would be to collect all subscriptions and unsubscribe them at once:
```
private readonly subscription = new Subscription();

everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.subscription.add(this.everySecond.subscribe(() => {
      // some logic here
    }));
    this.subscription.add(this.everyThirdSecond.subscribe(() => {
      // some logic here
    }));
}

ngOnDestroy() {
    this.subscription.unsubscribe();
}
``` 
However, same drawbacks here: Cumbersome and obfuscating.

## Unsubscribe with ``takeUntil``
A cleaner way of unsubscribing is using ``takeUntil``.

Official docs for ``takeUntil``: ``takeUntil(notifier: Observable<any>)`` — Emits the values emitted by the source Observable until a notifier Observable emits a value.

Example code:
```
private readonly ngDestroy = new Subject();

everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.everySecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });
    
    this.everyThirdSecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });
}

ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
}
```
When the component gets destroyed, the observable ``ngDestroy`` gets completed, causing the subscriptions to complete.
Thus memory leaks and unwanted side effects are avoided.

Drawbacks: As with the other methods, it's still quite verbose and error-prone.

NOTE: takeUntil operator should always come last (https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)

## Using ``untilDestroyed``
There is an npm package called ``@ngneat/until-destroy`` (https://github.com/ngneat/until-destroy).

You can install it (for Angular versions using Ivy) with
```
npm install --save @ngneat/until-destroy
```

Or for previous Angular versions with:
```
npm install --save ngx-take-until-destroy
```

It simplifies the unsubscription handling a lot. It internally creates a ``Subject`` and uses ``takeUntil``, hooked into ``ngOnDestroy``.
The above code simplifies to:
```
everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.everySecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });
    
    this.everyThirdSecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });
}

ngOnDestroy() {
    // needed for untilDestroyed
}
```
Only drawback: We have to implement ``ngOnDestroy`` everywhere we want to use ``untilDestroyed``.
However it should be easy to write a linting rule to enforce this.
