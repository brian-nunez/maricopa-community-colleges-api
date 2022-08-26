# maricopa-community-colleges-api

## Class Search

Query Params

`keywords` - Search Query

`subject_code` - Subject code, options can be found here `/api/classes/subjects`

`institutions[]` - Accepts multiple, options can be found here `/api/classes/schools`

`all_classes` - Availability, true is `All Classes`, false is `Open Classes Only`. default: `false`

Example:
```
https://maricopa.bjnunez.com/api/classes?keywords=CIS
```

## Schools

URL:
```
https://maricopa.bjnunez.com/api/classes/schools
```

School Options Example
```
https://maricopa.bjnunez.com/api/classes?institutions[]=GCC02&institutions[]=MCC04
```

## Subjects

URL:
```
https://maricopa.bjnunez.com/api/classes/subjects
```

Subject Options Example
```
https://maricopa.bjnunez.com/api/classes?subject_code=SPH
```
