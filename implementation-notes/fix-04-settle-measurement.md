# F1 — measured settle points

`fitWithPlateau()` scales every complete child timeline into the first 70% of
its declared act span, then appends a real 30% hold. Consequently, an act whose
last meaningful tween is also its final authored tween resolves at `0.70` of
its span regardless of the child's authoring seconds. The previous `0.84`
values were stable, but they were copied review positions rather than measured
resolution points.

| act | authored resolution | child duration | settle in act span |
|---|---:|---:|---:|
| bare | 2.40 | 2.40 | 0.70 |
| page | 2.20 | 2.20 | 0.70 |
| glosses | 4.10 | 4.10 | 0.70 |
| print | final line-number reveal | same | 0.70 |
| editorial | 2.55 | 2.55 | 0.70 |
| application | 2.55 | 2.55 | 0.70 |
| fragments | 2.64 | 2.64 | 0.70 |
| conversation | 1.80 visible / 2.10 state preparation | 2.10 | 0.60 |
| tube | 2.75 meaningful / 3.05 including local hold | 3.05 | 0.64 |

Conversation's later invisible operation positioning is preparation for the
next act, not visible choreography, so its stable conversational composition is
measured at 60%. The tube already contains a local hold from 2.80–3.05; its last
meaningful camera tween ends at 2.75, producing `0.70 × 2.75 / 3.05 = 0.631`,
rounded up to 0.64 so snap lands after the tween. Both are followed by the
master's 30% hold tail.
