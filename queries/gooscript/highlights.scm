(shebang) @keyword.directive

(comment) @comment

(number) @number

(string char: (char) @string)
(string escaped: (identifier)@string.escaped)

["module" "use" "from"] @keyword.import
(module name: (identifier) @module)

(use_statement module: (identifier) @module )
(use_statement specialized: (identifier) @constant)

(identifier) @variable
(type) @type

(bool) @boolean

(fn_statement
	name: (identifier) @function)

(fn_statement
	param: (identifier) @variable.parameter)

(function_call
  name: (identifier) @function.call)

(property_expression
	property: (identifier) @field
)

(property_expression
	method: (function_call) @method.call
)

(dictionary
  key: (key) @variable.member)

[
 "let"
 "var"
] @keyword

[
 "fn"
] @keyword.function

[
 "if"
 "unless"
 "else"
 "then"
 "match"
 "default"
] @keyword.conditional

[
 "while"
 "for"
 "do"
 "in"
 "until"
] @repeat

[
	"true"
	"false"
  "ongod"
  "cap"
] @bool

[
 "return"
] @keyword.return


[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket

[
 "="
] @operator

[
 "\""
] @string

[
 "\\n"
 "\\r"
] @string.escape

[
 ";"
 ","
] @punctuation.delimeter


[
	"%="
	"^="
	"&="
	"*="
	"-="
	"+="
	"|="
	"/="
	"="
	"|"
	"^"
	"&"
	"=="
	"!="
  "<"
  "<="
  ">"
  ">="
  ">>"
  "<<"
  "+"
  "-"
  "/"
  "*"
  "%"
  "=>"
] @operator

[
  "mod"
  "not"
	"or"
	"and"
] @keyword.operator


