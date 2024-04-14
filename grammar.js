/* @ts-nocheck  */
module.exports = grammar({
  name: 'gooscript',
  extras: $ => [/\s|\\\r?\n/, $.comment],
  inline: $ => [$._expression, $._statement],
  world: $ => $.identifier,
  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => seq(choice(
      $.if_statement,
      $.while_statement,
      $._line_statement,
      $.fn_statement
    )),

    _line_statement: $ => seq(choice(
      $.variable_declare,
      $._expression,
    ), ';'),

    _expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.bool,
      $.function_call,
      $fn_statement
    ),


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
        seq(
          '{',
          repeat($._statement),
          '}'
        )
      ),
    ),

    function_call: $ => prec(203, (seq(
      field('name', $.identifier),
      '(',
      commaSep($._expression),
      ')'
    ))),

    variable_declare: $ => seq(
      choice('let', 'var'),
      field('name', $.identifier),
      optional(seq(
        '=',
        field('initial', $._expression),
      ))
    ),

    while_statement: $ => seq(
      choice("while", "until"),
      $._expression,
      choice(
        seq('do', $._line_statement),
        seq('{', repeat($._statement), '}'),
      ),
    ),

    if_statement: $ => seq(
      choice("if", "unless"),
      $._expression,
      choice(
        seq('{', repeat($._statement), '}'),
        seq('then', $._line_statement),
      ),
      optional(
        choice(
          seq('else', $.if_statement),
          seq('else', $._expression, '{', repeat($._statement), '}'),
        )
      )
    ),

    identifier: _ => /[a-zA-z_]+[A-Za-z0-9_]*/,
    number: _ => /[0-9]+\.?[0-9]*/,
    string: _ => token(seq('"', optional(/[^"]+/), '"')),
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
