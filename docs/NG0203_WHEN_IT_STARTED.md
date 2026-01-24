# NG0203: When This Error Started

## Short Answer

**The error started when the project moved to Angular 20** (or when it was first run on Angular 20). It is caused by a **combination of**:

1. **Angular 20’s effect scheduler** – Stricter injection-context checks during `R3Injector.hydrate`.
2. **@angular/common’s default `Location` provider** – Uses `createLocation`, which calls `inject(LocationStrategy)` inside a factory that can run in the effect-scheduler context where `inject()` is not allowed.

---

## 1. Your Versions

| What            | Version     |
|-----------------|------------|
| @angular/core   | **^20.3.16** |
| @angular/common | **^20.3.16** |
| @angular/router | **^20.3.16** |

README still says “Angular 19”, so the project was likely **upgraded from 19 to 20**. The NG0203 with `createLocation` / `_LocationStrategy` / `root_effect_scheduler` matches **Angular 20** behavior.

---

## 2. When It Appears

- **On Angular 19** (or 18):  
  Hydration and effect scheduling were different. The `Location` factory often ran in a context where `inject()` worked, so NG0203 did **not** show up for the same app/config.

- **On Angular 20** (e.g. 20.3.16):  
  - The **effect API is stable** and the **root effect scheduler** is used during bootstrap/hydration.  
  - Some provider resolution (including for routing) can run in that scheduler’s microtask/context.  
  - The default `Location` provider uses:

    ```ts
    useFactory: createLocation   // createLocation() => new Location(__inject(LocationStrategy))
    ```

  - When that factory runs in the **effect-scheduler context**, `__inject(LocationStrategy)` is **outside** a valid injection context → **NG0203**.

So in practice: **the error “came” when you started running this app on Angular 20** (e.g. after an upgrade, or if the project was created on 20).

---

## 3. What Triggers It in Your App

You don’t need custom `Location` / `LocationStrategy` providers for it to happen. It is enough that:

1. **`provideRouter(routes, ...)`** is in `app.config.ts` → Router is configured.
2. During **bootstrap**, something causes **`Location`** (or its deps) to be resolved:
   - Router setup / `ROUTER_INITIALIZER`
   - `withInMemoryScrolling` or other router features
   - First use of `Router`, `RouterOutlet`, or `RouterLink` during hydration
3. The injector then runs **`createLocation`** in a **root-effect / scheduler** path → `inject(LocationStrategy)` runs where it’s not allowed → **NG0203**.

So the error can appear with a **plain `provideRouter(routes)`** (or `provideRouter(routes, withInMemoryScrolling(...))`) and no custom `Location`/`LocationStrategy` at all. It’s the **default** `Location` factory in `@angular/common` that is incompatible with the **Angular 20** hydration/effect context.

---

## 4. Call Chain (from your stack)

```
bootstrapApplication(AppComponent, appConfig)
  → internalCreateApplication / bootstrap
  → R3Injector.hydrate
  → root_effect_scheduler (effect / microtask context)
  → some code path requests Location
  → createLocation() runs
  → __inject(LocationStrategy)  ← NG0203: not in a valid injection context
```

`main.ts` itself is fine; the failure is inside Angular’s injector and `@angular/common` during that bootstrap/hydration flow.

---

## 5. Fix That Works on Angular 20

Override the `Location`-related providers so **no `inject()` is used inside their factories**. Use **deps-based factories** (and `useClass` where it’s equivalent) so the injector passes deps in and `inject()` is never called in a bad context:

In `app.config.ts`, **before** `provideRouter(routes, ...)`:

```ts
import {
  BrowserPlatformLocation,
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';

// In providers, BEFORE provideRouter:
{
  provide: PlatformLocation,
  useFactory: (b: BrowserPlatformLocation) => b,
  deps: [BrowserPlatformLocation]
},
{ provide: LocationStrategy, useClass: PathLocationStrategy },
{
  provide: Location,
  useFactory: (locationStrategy: LocationStrategy) => new Location(locationStrategy),
  deps: [LocationStrategy]
},
provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
```

Behavior (path strategy, base href, routing) stays the same; only the way `Location` / `LocationStrategy` / `PlatformLocation` are provided changes, so `inject()` is no longer used in the problematic context.

---

## 6. Timeline Overview

| When                          | What                                                         | NG0203 with Location/createLocation? |
|-------------------------------|--------------------------------------------------------------|--------------------------------------|
| Angular 17–18                 | Effect APIs experimental, different hydration/scheduling     | Rare for this pattern                |
| Angular 19                    | More effect usage; hydration still often “safe” for Location | Sometimes, app-dependent             |
| **Angular 20** (e.g. 20.3.16) | Effect API stable, root effect scheduler in bootstrap/hydrate| **Common** with default Location     |

---

## 7. References

- [Angular NG0203](https://angular.dev/errors/NG0203)
- [Angular 20 release / effect API](https://angular.schule/blog/2025-05-angular20/)
- [Angular 20 – root effect / `_Router` NG0203](https://stackoverflow.com/questions/79770285/angular-20-token-injection-failed)
- Your `@angular/common` 20.3.16: `location.mjs` `createLocation` and `Location` / `LocationStrategy` / `PlatformLocation` defaults.

---

**Summary:**  
The error started when the app began running on **Angular 20**, due to **stricter injection-context checks** and **effect-scheduler usage during `R3Injector.hydrate`**, which conflict with **@angular/common’s default `Location` factory** that uses `inject(LocationStrategy)`. Overriding `PlatformLocation`, `LocationStrategy`, and `Location` with deps-based providers (and `useClass` for `PathLocationStrategy`) avoids that and removes NG0203.
