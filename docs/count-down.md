# count-down

Reference configuration

| Name             | Type                                       | Description                                       |
| ---------------- | ------------------------------------------ | ------------------------------------------------- |
| start            | <code>string</code> \| <code>Object</code> | Start time or date expression                     |
| end              | <code>string</code> \| <code>Object</code> | End time or date expression                       |
| url              | <code>string</code>                        | Url on complete                                   |
| unit             | <code>string</code>                        | Unit to use instead of various components         |
| locale           | <code>string</code>                        | Locale                                            |
| timer            | <code>Boolean</code>                       | Self updating timer (true by default)             |
| pad              | <code>Boolean</code>                       | Pad h/m/s with 0                                  |
| decimalDigits    | <code>Number</code>                        | Number of decimals to show for fractional numbers |
| labels           | <code>Object</code>                        | Units labels                                      |
| interval         | <code>Number</code>                        | Time between timer update (1s by default)         |
| reloadOnComplete | <code>Boolean</code>                       | Reload page at the end of the count down          |
| onInit           | <code>function</code>                      | Callback on init                                  |
| onTick           | <code>function</code>                      | Callback on tick                                  |
| onComplete       | <code>function</code>                      | Callback on complete                              |
