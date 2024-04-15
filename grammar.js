
/* @ts-nocheck  */
module.exports = grammar({
  name: 'gooscript',
  extras: $ => [/\s|\\\r?\n/, $.comment],
  inline: $ => [$._expression, $._statement, $._line_statement_inner, $._line_statement],
  world: $ => $.identifier,
  rules: {
    source_file: $ => seq(optional($.shebang), optional($.module), repeat($._statement), prec(500, optional($._expression))),

    shebang: _ => token(seq('#!', /.*/, '\n')),

    module: $ => seq("module", field('name', $.identifier), ";"),

    use_statement: $ => prec(600, seq(
      "use",
      choice(
        field('module', $.identifier),
        seq('{', commaSep(field('specialized', $.identifier)), '}', 'from', field('module', $.identifier)),
        seq(field('specialized', $.identifier), 'from', field('module', $.identifier)),
      ),
    )),

    use_expression: $ => seq(
      "use",
      "(",
      $._expression,
      ")"
    ),

    _statement: $ => choice(
      $.if_statement,
      $.match_statement,
      $.while_statement,
      $.for_statement,
      $._line_statement,
      $.fn_statement,
      $.block
    ),

    block: $ => prec(50, seq('{', repeat($._statement), optional($._expression), '}')),

    _line_statement_inner: $ => choice(
      $.variable_declare,
      $._expression,
      $.return_statement,
      $.use_statement,
    ),
    _line_statement: $ => seq($._line_statement_inner, ';'),

    _expression: $ => choice(
      $.use_expression,
      $.identifier,
      $.number,
      $.string,
      $.bool,
      $.function_call,
      $.fn_statement,
      $.dictionary,
      $.array,
      $.paren_expression,
      $.binary_expression,
      $.unary_expression,
      $.property_expression,
      $.if_statement,
      $.match_statement
    ),

    match_case: $ => seq(
      $._expression,
      '=>',
      choice($.block, seq($._expression, ',')),
    ),
    match_statement: $ => prec.left(500, seq(
      'match',
      $._expression,
      '{',
      repeat(choice($.match_case)),
      optional(seq('default', '=>', choice($.block, seq($._expression)))),
      '}'
    )),

    paren_expression: $ => seq('(', $._expression, ')'),

    property_expression: $ => prec(200, seq(
      $._expression,
      ".",
      choice(
        field("property", $.identifier),
        field("method", $.function_call),
      )
    )),

    binary_expression: ($) =>
      choice(
        prec.left(
          1,
          seq(
            $._expression,
            choice("%=", "^=", "&=", "*=", "-=", "+=", "|=", "/=", "=",),
            $._expression
          )
        ),
        prec.left(2, seq($._expression, "or", $._expression)),
        prec.left(3, seq($._expression, "and", $._expression)),
        prec.left(4, seq($._expression, "|", $._expression)),
        prec.left(5, seq($._expression, "^", $._expression)),
        prec.left(6, seq($._expression, "&", $._expression)),
        prec.left(7, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(
          8,
          seq($._expression, choice("<", "<=", ">", ">="), $._expression)
        ),
        prec.left(9, seq($._expression, choice(">>", "<<"), $._expression)),
        prec.left(10, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(11, seq($._expression, choice("/", "*", "%", "mod"), $._expression)),
      ),

    unary_expression: $ => prec.left(100, seq(choice("not", "-"), $._expression)),

    key: $ => choice(
      $.string,
      $.identifier,
    ),

    array: $ => seq('[', commaSep($._expression), ']'),

    dictionary: $ => seq(
      '{',
      // seq(rule, repeat(seq(separator, rule)))
      commaSepTrailing(
        seq(
          field('key', $.key),
          '=',
          field('value', $._expression))
      ),
      '}'
    ),

    return_statement: $ => prec.left(500, seq("return", optional($._expression))),

    fn_statement: $ => seq(
      "fn",
      optional(field("name", $.identifier)),
      optional(seq(
        '(',
        commaSep(field('param', $._expression)),
        ')'
      )),
      choice(
        seq('=', $._line_statement),
        $.block
      ),
    ),

    function_call: $ => prec(203, (seq(
      field('name', $.identifier),
      '(',
      commaSep($._expression),
      ')'
    ))),

    variable_declare_ident: $ => choice(
      field('name', $.identifier),
      seq('[', commaSep(field('name', $.identifier)), ']')
    ),

    variable_declare: $ => seq(
      choice('let', 'var'),
      $.variable_declare_ident,
      seq(
        '=',
        field('initial', $._expression),
      )
    ),


    for_statement: $ => seq(
      "for",
      $.variable_declare_ident,
      "in",
      $._expression,
      choice(
        seq("do", $._line_statement_inner, field('do', ';')),
        $.block
      )
    ),

    while_statement: $ => seq(
      choice("while", "until"),
      $._expression,
      choice(
        seq("do", $._line_statement_inner, field('do', ';')),
        $.block
      ),
    ),

    if_statement: $ => prec.left(500, seq(
      choice("if", "unless"),
      $._expression,
      choice(
        $.block,
        seq("then", $._line_statement_inner, field('then', ';'))
      ),
      optional(
        seq(
          "else",
          choice(
            $.block,
            $._expression
          ),
        ),
      )
    )),


    type: _ => /[A-Z]+[A-Za-z0-9_]*/,
    identifier: $ => choice(
      field('var', /[a-z]+[A-Za-z0-9_]*/),
      $.type,
      "clone",
      "null"
    ),

    number: _ => token(/[0-9]+\.?[0-9]*/),
    string: $ => (seq('"',
      repeat(choice(
        field('char', $.char),
        field('escaped', seq('{', $._expression, '}'))
      )),
      '"')),
    char: _ => (choice(
      "\\n",
      "\\r",
      "\\\"",
      /([^"^{]|(\{\{))+/
    )),
    bool: _ => choice("true", "false", "ongod", "cap"),

    comment: _ => token(seq('#', /.*/, '\n')),
  }
});

function sep(rule, separator) {
  return optional(sep1(rule, separator));
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

function commaSep1(rule) {
  return sep1(rule, ",");
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSepTrailing(rule) {
  return optional(seq(rule, repeat(seq(',', rule)), optional(',')));
}
