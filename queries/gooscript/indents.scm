
[
 "{"
 "}"
 "["
 "]"
 "("
 ")"
] @indent.branch

[
 (fn_statement)
 (if_statement)
 (match_statement)
 (while_statement)
 (for_statement)
 (dictionary)
] @indent.begin


(block "}" @indent.end)
(dictionary "}" @indent.end)
(match_statement "}" @indent.end)

(if_statement "then" @indent.end)
(while_statement "do" @indent.end)
(for_statement "do" @indent.end)

[
 (comment)
] @indent.ignore
