.PHONY: lint
lint:  ## run lint with poetry
	poetry run isort src
	poetry run black src
	poetry run pflake8 src
	poetry run mypy src