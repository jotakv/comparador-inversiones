# Alternative Capitalization Investment Lab

## Decision question

What is the most attractive entrepreneurial use of €45,000 when €28,000 comes from the restricted SEPE lump sum, €12,000 from indemnification and €5,000 from savings?

The page does not treat the lump sum as an unrestricted investment account. A valid business and an eligible invoice are separate tests.

## Repository integration

- `alternatives.html` is a static Project Pages-compatible entry point.
- `data/alternative-investments.json` contains the 24-model universe, ten finalists, scenario inputs, budgets, rubrics, SEPE caveats, moonshots and sources.
- `assets/js/alternative-engine.js` contains pure projections, validation, scoring, stress, frontier and benchmark adapters.
- `assets/js/alternatives.js` renders filters, tables, charts and the selected opportunity.
- `data/investments.json` and `data/model-assumptions.json` remain the only sources for existing benchmark financials.

No backend, framework or chart dependency was added. `common.js` still resolves all resources from `import.meta.url`, so root hosting and `/comparador-inversiones/` use the same code.

## Financial model

All new models are pre-tax and run from year 0 to year 5.

- Owner cash = revenue − operating expenses − maintenance CAPEX.
- Economic FCF = owner cash − founder hours × 12 × €30.
- Operating ROI = accumulated owner cash / initial investment.
- Total ROI = (accumulated owner cash + recoverable residual − initial investment) / initial investment.
- Owner IRR adds the residual only to the year-five terminal flow.
- Payback is interpolated from operating cash and never uses an unsold residual.
- Break-even revenue = (fixed OPEX + maintenance CAPEX) / (1 − variable cost rate).

The base case is not a forecast. It is a transparent hypothesis. Conservative and optimistic cases use separate revenue, cost, ramp, growth, maintenance and residual inputs. The adverse case combines revenue −30% and initial CAPEX +20%.

## Scoring

The final score is 0–100:

| Criterion | Weight |
|---|---:|
| Profitability potential | 20% |
| Apparent SEPE compatibility | 15% |
| Cash generation speed | 10% |
| Risk | 10% |
| Scalability | 10% |
| Defensibility | 5% |
| Residual value | 10% |
| Automation | 5% |
| Liquidity | 5% |
| Founder fit | 10% |

Profitability, speed, risk and residual are scored against documented absolute thresholds, so the ranking does not move merely because an alternative enters or leaves the universe. SEPE uses Alta=100, Condicionada=65, Dudosa=30 and No adecuada=0. Scalability, defensibility, liquidity and founder fit use the declared 0–100 rubrics. The formula is deterministic and covered by tests.

- Profitability scores economic IRR from −10% (0 points) to 40% (100 points).
- Cash speed combines time to first revenue from six to one month (40%) and economic payback from 60 to 18 months (60%).
- Risk scores the seven-category average from 9/10 (0 points) to 2/10 (100 points).
- Residual scores recoverable year-five value from 0% to 60% of invested capital.

Capital Efficiency is a separate absolute score: economic FCF/capital 50%, revenue/capital 20% and inverse economic payback 30%.

Its reference ceilings are 0.75× economic FCF/capital, 2.0× revenue/capital and 18 months economic payback; 60 months is the lower payback boundary. Values outside the range are clamped, not extrapolated.

## SEPE method

The assessment prioritizes SEPE and BOE sources and deliberately uses “Elegibilidad a confirmar con SEPE” for individual costs. The model enforces these distinctions:

1. the activity can be genuine self-employment;
2. the asset is genuinely necessary for that activity;
3. the invoice and payment can document the cost;
4. the cost timing and the approved project memory are consistent.

Hardware-heavy or location-dependent models remain conditioned until contracts, permits, insurance and affected use are confirmed. Passive ownership is not upgraded to “business” merely by adding software or a management label.

## Adversarial audit corrections

- Founder labour is priced instead of being treated as free.
- All finalists have a staged validation budget; the model does not force spending €45,000 on day one.
- Capital at Risk Before Validation is shown separately.
- Residual value is recoverable property, not operating revenue.
- Market trends support opportunity context, not demand proof or revenue precision.
- Existing benchmark values are calculated from repository data, not copied into the new dataset.
- Duplicate campers, vans, self-storage and generic real estate models were excluded from the finalist universe.

## Remaining limitations

- Revenue and utilization need customer interviews, pre-sales or signed pilots.
- Most equipment budgets need dated supplier quotations and tax treatment.
- Founder-hour estimates may be understated during launch.
- Taxes, financing, sale costs and personal remuneration are outside the displayed owner cash.
- Apparent SEPE fit is not an administrative ruling.
