local M = {}


M.setup = function ()
  local parser_config = require "nvim-treesitter.parsers".get_parser_configs()

  vim.cmd [[ autocmd BufNewFile,BufRead *.goo set filetype=gooscript ]]
  vim.treesitter.language.register("gooscript", "goo")

  parser_config.gooscript = {
    install_info = {
      url = "bishan-batel/tree-sitter-gooscript",
      files = { "src/parser.c" },
      branch = "main",
      generate_requires_npm = true,
      requries_generate_from_grammar = true,
    },
    filetype = "goo"
  }
end

return M
