package tree_sitter_gooscript_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-gooscript"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gooscript.Language())
	if language == nil {
		t.Errorf("Error loading Gooscript grammar")
	}
}
