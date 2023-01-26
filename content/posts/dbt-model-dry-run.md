---
author: "Almaz Murzabekov"
title: "[dbt] How to validate the compiled version of dbt models for SQL correctness"
date: "2023-01-03"
description: ""
tags: ["dbt", "howto", "sql", "dry-run"]
ShowToc: false
ShowBreadCrumbs: true
---

dbt is the `T` in `ELT (Extract Load Transform)`. It doesn’t extract or load data, but it’s extremely good at transforming data that’s already loaded into your warehouse. If you've been working with dbt for a while, you probably noticed that dbt doesn't check the resulting version of models for sql correctness. That's a problem!

The lack of check functionality is based on the diverse range of databases, which dbt wants to support. If some of the popular database doesn't have the functionality to check the sql for correctness without executing it, it becomes a problem for the dbt-db adapter. And it's one of the reason why dbt doesn't provide the validation functionaly out-of-the box.

We as a data-engineers should somehow handle the situation when the model becomes invalid in terms of compiled sql. Let's say someone in your team refactored the model, renamed the column name. Unless these changes will not be applied in production (table column renaming), the compiled version of dbt-model should fail. And it should fail as-fast-as-possible, even more it should fail in merge request phase, before being delivered to production envirounment.  

### So, who we can create our in-house validation process?

First of all, we should make sure that our target database supports `EXPLAIN` command or has some alternative feacture which covers the same functionality. In this article, I'll demostrate the approach on Databricks. 

Second, we should have a version control system, like GitLab, GitHub, etc. The main requirement for these SVNs is to be able provide CI/CD features. And the overall pipeline should look similar to this figure
<img src="/images/posts/dbt-pipeline.png" />


So, let's say we have databricks as an SQL Engine, and dbt-models are stored in the GitLab project. We want to validate the all dbt model changes in Merge Request which were opened by ourselves or teammates. If the validation fails, obviously, the MR's pipeline must fail and block the delivery process until the fail will be fixed. 

#### Gitlab CI pipeline structure

The definition of the GitLab pipeline might look the following, where we're extracting the list of changed dbt models in the Merge Requests and calling `compile.sh` script with the list of changed files. The compile script, as the name hints should generate a compiled version of each given dbt model and all children of these models, excluding the grandchildren models.
``` 
# .gitlab-ci.yml

dry_run:
  image: $GITLAB_CONTAINER_MR_IMAGE
  stage: test
  needs: ["merge_request_docker_image"]
  environment:
    name: production
  script:
    - files=`git diff --name-only --diff-filter=d $CI_MERGE_REQUEST_TARGET_BRANCH_NAME..$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME -- 'models'`
    - echo "Changed files\n ${files[*]}"
    - if ! $files; dbt deps; fi
    - if ! $files; then dbt debug; fi
    - if ! $files; then ./scripts/compile.sh "${files[*]}"; fi
    - if ! $files; then ./scripts/dry_run.sh target/compiled/analytics_dbt/models; fi
  only:
    - merge_requests
```

#### compile.sh script
A straightforward bash script, which compiles the given dbt models and the children of the model.
```sh
# compile.sh

#bin/bash

set -e

echo "Running compile script with parameters";
# shellcheck disable=SC2068
echo $@;

for sql_file in $1; do
  model=$(echo "$sql_file" | rev | cut -d/ -f1 | rev)
  echo "Compiling $model..."
  dbt compile -s "$model"+1 --target production
done
```

#### dry_run.sh script

The script checks if a folder path has been provided as an argument when the script is run. If no folder path is provided, the script will display an error message and exit with an exit code of 1. Then script uses the `find` command to find all SQL files recursively inside the provided folder and store the total number of files in the "total" variable. Then the list of files sorts alphabetically. The `while read -r -d $'\0'` loop is used to iterate through each file.

For each file, the script displays a progress indicator showing the number of files remaining and the total number of files. Then it uses the `dbt run-operation` command to call `is_valid_sql` macros which validates the sql content of the file. The "--args" flag is used to pass a parameter to the dbt command, and the "--target" flag is used to specify the target database to run the command against. Finally, the script uses the "rm" command to delete the current file being processed, this allows the script to change the progress indicator.

```sh
# dry_run.sh

set -e

if [ -z "$1" ]; then
    echo "Please call '$0 <folder>' to run this command!"
    exit 1
fi

path=$1

echo "Running dry_run script in $path folder"

total=$(find "$path" -name '*.sql' | wc -l )
total_no_whitespace="$(echo "${total}" | tr -d '[:space:]')"

# Find all sql files recursively inside the given folder
find "$path" -name '*.sql' -print0 | sort | while read -r -d $'\0' file
do
  # progress indicator
  left=$(find "$path" -name '*.sql' | wc -l)
  left_no_whitespace="$(echo "${left}" | tr -d '[:space:]')"
  remaining=$((total_no_whitespace-left_no_whitespace + 1))
  echo "[$remaining/$total_no_whitespace] Validating $file..."

  # validate sql content of the file
  dbt run-operation is_valid_sql --args "{sql_query: \"$query\"}" --target production

  # Deleting the sql file to be able change the progress indicator
  rm $file
done
```


#### is_valid_sql dbt macros

This is a dbt macro that is used to check if a given SQL query is valid. The macro begins by defining the input parameter "sql_query", which is the SQL query that needs to be checked for validity. The next line uses the "run_query" function to execute the "explain" command on the provided "sql_query" parameter. The result of the explain command should be either a Physical Plan of the execution of the given sql query or the Error message indicating the root cause of the error. If the first row of explain command result started with "== Physical Plan ==" it means sql query is valid, otherwise it's not. If the query is not valid the macro raises an error, indicating that the provided query is not compilable.

```sql
{% macro is_valid_sql(sql_query) %}
    {{ log("Running is_valid_sql macros with params: ") }}
    {{ log("sql_query: " ~ sql_query ) }}

    {% set explain_result = run_query('explain ' + sql_query) %}
    {% set is_valid = "== Physical Plan ==" in explain_result.rows[0].values()[0] | as_bool %}

    {{ log("is_valid: " ~ is_valid ) }}

    {% if not is_valid %}
      -- We want exit from the macros with non 0 code to indicate that the query is not compilable
      {{ exceptions.raise_compiler_error("Provided query is not compilable") }}
	  {% endif %}
{% endmacro %}

```





