# Mockup review

## Review scope

This review checks references 01–14 against the current MVP specification. Mockups remain visual references; they do not approve agronomic claims, sensor data, products, dosages, activity behavior, or navigation.

## Summary

The strongest implementation references are plant selection, plant setup layout, the revised Today hierarchy, New Journal Entry, and Journal chronology.

Plant Detail visual hierarchy is approved only through current-data implementation rules: care-first composition, stage journey, rounded cards, and one plant-scoped Quick Care FAB. Care-entry references still require product correction for fabricated measurements or unsupported agricultural recommendations.

## Screen-by-screen review

| Ref | Screen | Product fit | Knowledge dependency | Required correction |
| --- | --- | --- | --- | --- |
| 01 | Welcome | Partial | None | Replace “Tự động lưu lại hành trình” with copy that does not imply unsaved activity becomes history. Reduce guidance-first positioning. |
| 02 | Today | Partial | Care recommendation, weather context | Replace placeholder images, generic “Thực hiện”, fabricated weather metrics, unsupported care examples, and incomplete navigation. Priorities are compact by default: show a short “Vì sao”, expand reviewed explanation/guidance only on request, and open Care Entry without saving. Do not show “Đã xem xét” on Today. |
| 03 | Add Plant: species | Partial | Plant Species | MVP supports grape first. Do not imply tomato, strawberry, or pepper knowledge is available until their species packages exist. |
| 04 | Add Plant: details | Partial | Plant Species, Growth Stage | Stage choices must come from the selected species package. The mockup list is incomplete and does not match the canonical grape journey. |
| 05 | Add Plant: success | Outdated | Stage Playbook, Care Recommendation | Remove confetti and the blocking success screen. “Kiểm tra độ ẩm đất” may be a suggestion, not an automatically completed task. |
| 06 | Plant Detail | Partial | Stage Playbook, Care Recommendation | Keep care-first hierarchy, persisted-photo hero with compact no-photo fallback, ordered stage journey as the single current-stage identifier, large care cards, a compact mixed recent-journal feed, and one plant-scoped Quick Care FAB. Remove checkboxes, completion history, duplicated stage labels or tasks, fabricated photo/health/days-in-stage/progress, soil moisture, and light hours. FAB opens Care Entry and never saves directly. |
| 07 | Stage Playbook | Layout only | Stage Playbook, guides, threats | Remove fixed “2 ngày/lần”, “60–70%”, NPK 30-10-10, universal height, and unsourced pest/disease claims. Use reviewed, conditional content. |
| 08 | Watering | Layout only | Watering recommendation, weather rule | Remove fabricated soil moisture, “Lý tưởng”, fixed 200 ml, and certainty based on rain alone. Ask the user to assess soil and preserve optional manual amount. |
| 09 | Fertilizing recommendation | Not approved | Fertilizer Profile, weather rule | Do not recommend MKP or NPK formulas from the mockup. Remove unrelated images and product selection until evidence, plant context, and expert review exist. |
| 10 | Fertilizing details | Layout only | Fertilizer Profile | Keep optional structured fields. Remove “Humic + Lân”, combination advice, dosage implication, and automatic stage prescription. |
| 11 | Spraying | Layout only | Threat, Care Recommendation, weather rule | Do not prescribe preventive spraying, neem, EM, or “thuốc đặc trị”. Keep optional product, purpose, method, dosage, notes, and weather context. |
| 12 | New Journal Entry | Strong | Growth Stage | Use canonical stage labels; “Phát triển lá” should map to a reviewed stage such as “Nuôi thân” rather than create a synonym. Stage change remains optional and user-confirmed. |
| 13 | Journal | Partial | Knowledge labels only | Remove the FAB and unsupported product examples. Preserve chronology and filters for image updates and three core care types. |
| 14 | Me | Layout only | None | Replace serif typography, fake user identity, and unimplemented cloud-sync status. Show only shipped settings and data tools. |

## Knowledge contract for the first vertical slice

The first Knowledge Base package supports one grape scenario:

- species: “Nho”;
- current stage: “Nuôi thân”;
- goal: establish a healthy main trunk and vegetative structure toward the chosen support;
- stage tips and avoid guidance in Plant Detail;
- one conditional “Kiểm tra đất trước khi tưới” Today prompt;
- one non-trackable main-shoot training guide;
- optional journal photo and user-confirmed stage change.

The package does not approve fertilizer formulas, pesticide products, spray schedules, fixed watering amounts, fabricated sensors, or automatic stage detection.

## Implementation gate

A screen may display agronomic content only when the referenced document is `approved`, its locale is `vi-VN`, all IDs resolve, and its version is included in the compiled mobile bundle.

The initial grape pilot remains `review` until a qualified Vietnamese grape-growing reviewer approves the translation, regional assumptions, and safety-sensitive wording.
