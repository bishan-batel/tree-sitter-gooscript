(comment) @comment

(number) @number
(string) @string

(bool) @boolean

(fn_statement
	name: (identifier) @function
)

(fn_statement
	param: (identifier) @parameter
)

(function_call
  name: (identifier) @function.call
)

[
 "let"
 "var"
 "do"
 "then"
] @keyword

[
 "fn"
] @keyword.function

[
 "if"
 "unless"
 "else"
] @conditional

[
 "while"
 "until"
] @repeat



[
	"true"
	"false"
  "ongod"
  "cap"
] @bool


[
 "("
 ")"
 "{"
 "}"
] @punctuation.bracket

[
 "="
] @operator

[
 ";"
 ","
] @punctuation.delimeter
