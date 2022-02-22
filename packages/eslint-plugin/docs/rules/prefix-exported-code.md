# prefix-exported-code

Prefix exported code forces to prefix each class/interface/function/constant with the specified prefix. It is case-insensitive.


## Configuration

```json
{
    "plugins": [
        "@katoid"
    ],
    "rules": [
        "@katoid/prefix-exported-code": ["error", {"prefix": "ktd"}]
    ]
}
```
