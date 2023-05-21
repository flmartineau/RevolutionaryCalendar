# Revolutionary Calendar

This is a JavaScript library for converting dates between the Gregorian calendar and the French Republican calendar.

## Installation

To install the library, run the following command:

```bash
npm install revolutionary-calendar
```

## Usage

You can use the library as follows:

```javascript
const cal = require('revolutionary-calendar');

// Convert a date from the French Republican calendar to the Gregorian calendar
let gregorianDate = cal.toGregorian('1 Prairial II');

// Convert a date from the Gregorian calendar to the French Republican calendar
let republicanDate = cal.toRepublican(new Date(1794, 4, 20));
```

### RevolutionaryCalendar.toGregorian(dateString)

Converts a date from the French Republican calendar to the Gregorian calendar.

**Parameters:**

- `dateString`: a date in the French Republican calendar. Accepts formats such as "1 Prairial II", "5 Prairial 2", "14 Messidor An II", "11 Prairial an 2", "10 Floréal An IV", "10 GERM 4".

**Returns:** the date in the Gregorian calendar as a `Date` object.

### RevolutionaryCalendar.toRepublican(date)

Converts a date from the Gregorian calendar to the French Republican calendar.

**Parameters:**

- `date`: a date in the Gregorian calendar as a `Date` object.

**Returns:** the date in the French Republican calendar as a string in the format "1 Prairial An II".


## Running Tests

To run tests, install Jest using `npm install --save-dev jest` and then run `npm run test`.


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](LICENSE)

