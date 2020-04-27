### String 直接两量匹配 ###
`Hex4Digits ::HexDigit HexDigit HexDigit HexDigit`
```
/^[0-9a-fA-F]+$/
```
`CodePoint ::HexDigits but only if MV of HexDigits ≤ 0x10FFFF`
```
/[\u{0}-\u{10FFFF}]/u
```