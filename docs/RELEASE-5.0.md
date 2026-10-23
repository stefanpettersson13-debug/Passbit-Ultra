# PassBit Titanium 5.0 — release notes

## New tools (14)
- **Hydraulik (ULTRA):** Hydraulic cylinder force/speed/stroke time; pump flow/shaft power; tube geometry/velocity and indicative hoop stress; ideal-gas accumulator capacity.
- **Pneumatik (ULTRA):** Cylinder force and approximate free-air consumption.
- **Diagnostik (ULTRA):** Rotational order and gear mesh frequency.
- **Verkstadsteknik (FREE):** Three-phase electric motor power; gear pair speed/torque; belt drive speed and approximate belt length.
- **Verkstadsteknik (PRO):** Basic rolling-bearing L10 life; approximate bolt preload.
- **Mätteknik (FREE):** Thermal length expansion.
- **Mätteknik (PRO):** Root-sum-square uncertainty combination.
- **Slipteknik (PRO):** Wheel peripheral speed and manufacturer-marked maximum speed comparison.

## User experience
- Global search across all tools on home screen.
- Recently used tools stored locally on device.
- Consistent two-column calculator layouts, immediate recalculation, copyable calculation reports, and clear limitations.
- New tools organized in existing five home categories and category filters.
- No subscription/payment entitlement system has been added; FREE/PRO/ULTRA remain preview labels.

## Engineering limits
All tools are **estimates, guides or deterministic calculations**, not certified design, machine-safety verification, component approval, or manufacturer's verified selection.
- Hydraulic tubing hoop stress is a thin-wall approximation and is **not** a pressure rating.
- Accumulator gas-law calculation uses **absolute** pressures, and gas energy must be professionally isolated before service.
- Bearing L10 is statistical and excludes contamination, lubrication and modified life factors.
- Torque-preload is only an indicative K-factor model, not a recommended assembly torque.
- Pneumatic free-air demand is idealized; valve, hose and dead volume effects are excluded.
- Wheel speed limit is a **hard maximum**. Check physical wheel marking and machine guarding.

## Deployment and compatibility
- Preserved classic HTML/JS load order and all existing blades.
- Added dedicated `engineering-suite.js`, `engineering-suite.css`, `tool-search.js` and `tool-search.css`.
- Existing modular CSS/JS URLs cache-busted to version 5.0.0.
- No offline service worker or persistent data migration added.

## QA and outstanding tests
Static verification: JavaScript syntax, section registration, navigation membership, asset references and version consistency.
Still requires live iOS Safari tests, cross-browser functional tests, accessibility checks, regression checks for legacy calculators, and independent review of safety-critical formulas.
