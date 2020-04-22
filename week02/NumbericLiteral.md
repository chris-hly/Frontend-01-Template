
### Number 直接量匹配 ###

`NumericLiteral` :: `DecimalLiteral` `BinaryIntegerLiteral ` `OctalIntegerLiteral` `HexIntegerLiteral` 
``` 
/(?:^[+-]?[\d]+([\.][\d]+)?([Ee][+-]?[\d]+)?$|^0[xX][0-9a-fA-F]+$|:^0[o|O][0-7]+$|^0[b|B][01]+$)/
```

`DecimalLiteral` :: `DecimalIntegerLiteral` . `DecimalDigitsopt` `ExponentPartopt` . `DecimalDigits` `ExponentPartopt` `DecimalIntegerLiteral` `ExponentPartopt` 

``` 
/(?:^[+-]?[\d]+([\.][\d]+)?([Ee][+-]?[\d]+)?)$/ 
```

`DecimalIntegerLiteral :: 0 NonZeroDigit DecimalDigits`
```
/^0[1-9]+\d+/
```

`DecimalDigits :: DecimalDigit DecimalDigits DecimalDigit` 
```
 /^[0-9]+$/
 ```

`DecimalDigit :: one of 0123456789`
```
/^[0-9]$/
```

`NonZeroDigit :: one of 123456789`
```
 /^[1-9]$/
 ```

`ExponentPart :: ExponentIndicator SignedInteger`
```
 /^[+-]?[\d]+[eE]$/
 ```

`ExponentIndicator :: one of eE`
```
/^[eE]+$/
```


`SignedInteger :: DecimalDigits + DecimalDigits - DecimalDigits`
```
 /^[+-]?[\d]+$/
 ```

`BinaryIntegerLiteral :: 0b BinaryDigits 0B BinaryDigits`
```
 /^0[b|B][01]+$/
 ```

`BinaryDigits :: BinaryDigit BinaryDigits BinaryDigit`
```
 /^[01]+$/
 ```

`BinaryDigit :: one of 0 1`
```
 /^[01]$/
 ```

`OctalIntegerLiteral :: 0o OctalDigits 0O OctalDigits`
```
 /^0[o|O][0-7]+$/
 ```

`OctalDigits :: OctalDigit OctalDigits OctalDigit`
```
 /^[0-7]+$/
 ```

`OctalDigit :: one of 0 1 2 3 4 5 6 7`
```
 /^[0-7]$/
```
`HexIntegerLiteral :: 0x HexDigits 0X HexDigits`
```
  /^0[xX][0-9a-fA-F]+$/
```

`HexDigits :: HexDigit HexDigits HexDigit`
```
/^[0-9a-fA-F]+$/
```

`HexDigit :: one of 0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F`
```
/^[0-9a-fA-F]$/
  ```