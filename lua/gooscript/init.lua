local M = {}

M.setup = function()
	local parser_config = require("nvim-treesitter.parsers").get_parser_configs()

	vim.cmd([[ autocmd BufNewFile,BufRead *.goo set filetype=gooscript ]])
	vim.treesitter.language.register("gooscript", "goo")

	parser_config["gooscript"] = {
		install_info = {
			url = "~/code/gooscript/tree-sitter",
			files = { "src/parser.c" },
			branch = "main",
			generate_requires_npm = true,
			requries_generate_from_grammar = true,
		},
		filetype = "goo",
	}

	local client = vim.lsp.start_client({
		name = "gooslsp",
		cmd = { "/home/bishan_/code/gooscript/build/Debug/bin/gooscript-lsp" },
	})

	if not client then
		vim.notify("client be ded lol")
		return
	end

	vim.api.nvim_create_autocmd("FileType", {
		pattern = "gooscript",
		callback = function()
			vim.lsp.buf_attach_client(0, client)
		end,
	})
end

require("nvim-web-devicons").set_icon({
	goo = {
		icon = "",
		color = "#91ffb8",
		cterm_color = "65",
		name = "Gooscript",
	},
})

require("nvim-web-devicons").set_icon_by_filetype({ gooscript = "goo" })

return M
