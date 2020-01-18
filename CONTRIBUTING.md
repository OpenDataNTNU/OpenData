# Contributing

## Git style

Pretty much gitflow, with small modifications as we don't need hotfix not release branches for a project of this scope.

### Branches

 * `master` - represents the current release. In the scope of this project, this would be the result of a sprint.
 * `development` - is a staging repository containing completed work on the current branch.
 * `feature/featurename` - is a feature branch. Write `camelCase` feature names please.

### Commit naming 

The first word should be an imperatively conjugated verb. Max 50 characters on first line.

Use line 2-n of the commit to explain why the commit is made, and possible side effects. Refer to github issues if possible. 

See: https://chris.beams.io/posts/git-commit/

### Merging

Always rebase when you are done working. The intention is to avoid a messy repository. Whoever merges your branch should be able to do so without conflicts.

1. `git checkout development`
2. `git pull`
3. `git checkout feature/yourbranch`
4. `git rebase development`

**FOLLOW THE INSTRUCTIONS GIVEN TO YOU BY GIT**. 90% of the time, you forgot to read what git told you to do. There might be conflicts, and you are expected to resolve them. `git rebase --abort` cancels, `git rebase --continue` tells git you are ready to continue(you are done fixing conflicts)

## Quality requirements

Only working commits should exist on `development` and `master`, so troubleshooting is easier. Please squash commits that don't pass CI before merging. Use `git rebase --interactive HEAD~distance` for this, where `distance` is the number of commits the offending commit is from the current newest commit. Changing a commit from `pick` to `squash`(or simply `s`) marks it to be merged with the previous commit. As usual, git gives you instructions. Please read them.

## CI

Tests should be written for new features.