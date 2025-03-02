---
stage: Verify
group: Pipeline Authoring
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Define inputs for configuration added with `include` **(FREE ALL)**

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/391331) in GitLab 15.11 as a Beta feature.
> - Made generally available in GitLab 16.6.

Use inputs to increase the flexibility of CI/CD configuration files that are designed
to be reused.

Inputs can use CI/CD variables, but have the same [variable limitations as the `include` keyword](includes.md#use-variables-with-include).

## Define input parameters with `spec:inputs`

Use `spec:inputs` to define input parameters for CI/CD configuration intended to be added
to a pipeline with `include`. Use [`include:inputs`](#set-input-values-when-using-include)
to pass input values when building the configuration for a pipeline.

The specs must be declared at the top of the configuration file, in a header section.
Separate the header from the rest of the configuration with `---`.

Use the interpolation format `$[[ inputs.input-id ]]` outside the header section to replace the values.
The inputs are evaluated and interpolated when the configuration is fetched during pipeline creation, but before the
configuration is merged with the contents of the `.gitlab-ci.yml` file.

For example, in a file named `custom_website_scan.yml`:

```yaml
spec:
  inputs:
    job-stage:
    environment:
---

scan-website:
  stage: $[[ inputs.job-stage ]]
  script: ./scan-website $[[ inputs.environment ]]
```

When using `spec:inputs`:

- Inputs are mandatory by default.
- Validation errors are returned if:
  - A string containing an interpolation block exceeds 1 MB.
  - The string inside an interpolation block exceeds 1 KB.

Additionally, use:

- [`spec:inputs:default`](index.md#specinputsdefault) to define default values for inputs
  when not specified. When you specify a default, the inputs are no longer mandatory.
- [`spec:inputs:description`](index.md#specinputsdescription) to give a description to
  a specific input. The description does not affect the input, but can help people
  understand the input details or expected values.
- [`spec:inputs:options`](index.md#specinputsoptions) to specify a list of allowed values
  for an input.
- [`spec:inputs:regex`](index.md#specinputsoptions) to specify a regular expression
  that the input must match.
- [`spec:inputs:type`](index.md#specinputstype) to force a specific input type, which
  can be `string` (default when not specified), `number`, or `boolean`.

### Define inputs with multiple parameters

You can define multiple inputs per CI/CD configuration file, and each input can have
multiple configuration parameters.

For example, in a file named `scan-website-job.yml`:

```yaml
spec:
  inputs:
    job-prefix:     # Mandatory string input
      description: "Define a prefix for the job name"
    job-stage:      # Optional string input with a default value when not provided
      default: test
    environment:    # Mandatory input that must match one of the options
      options: ['test', 'staging', 'production']
    concurrency:
      type: number  # Optional numeric input with a default value when not provided
      default: 1
    version:        # Mandatory string input that must match the regular expression
      type: string
      regex: /^v\d\.\d+(\.\d+)$/
    export_results: # Optional boolean input with a default value when not provided
      type: boolean
      default: true
---

"$[[ job-prefix ]]-scan-website":
  stage: $[[ inputs.job-stage ]]
  script:
    - echo "scanning website -e $[[ inputs.environment ]] -c $[[ inputs.concurrency ]] -v $[[ inputs.version ]]"
    - if [ $[[ inputs.export_results ]] ]; then echo "export results"; fi
```

In this example:

- `job-prefix` is a mandatory string input and must be defined.
- `job-stage` is optional. If not defined, the value is `test`.
- `environment` is a mandatory string input that must match one of the defined options.
- `concurrency` is an optional numeric input. When not specified, it defaults to `1`.
- `version` is a mandatory string input that must match the specified regular expression.
- `export_results` is an optional boolean input. When not specified, it defaults to `true`.

## Set input values when using `include`

> `include:with` [renamed to `include:inputs`](https://gitlab.com/gitlab-org/gitlab/-/issues/406780) in GitLab 16.0.

Use [`include:inputs`](index.md#includeinputs) to set the values for the parameters
when the included configuration is added to the pipeline.

For example, to include the `scan-website-job.yml` in the [example above](#define-inputs-with-multiple-parameters):

```yaml
include:
  - local: 'scan-website-job.yml'
    inputs:
      job-prefix: 'some-service-'
      environment: 'staging'
      concurrency: 2
      version: 'v1.3.2'
      export_results: false
```

In this example, the inputs for the included configuration are:

| Input            | Value           | Details |
|------------------|-----------------|---------|
| `job-prefix`     | `some-service-` | Must be explicitly defined. |
| `job-stage`      | `test`          | Not defined in `include:inputs`, so the value comes from `spec:inputs:default` in the included configuration. |
| `environment`    | `staging`       | Must be explicitly defined, and must match one of the values in `spec:inputs:options` in the included configuration. |
| `concurrency`    | `2`             | Must be a numeric value to match the `spec:inputs:type` set to `number` in the included configuration. Overrides the default value. |
| `version`        | `v1.3.2`        | Must be explicitly defined, and must match the regular expression in the `spec:inputs:regex` in the included configuration. |
| `export_results` | `false`         | Must be either `true` or `false` to match the `spec:inputs:type` set to `boolean` in the included configuration. Overrides the default value. |

### Use `include:inputs` with multiple files

[`inputs`](index.md#includeinputs) must be specified separately for each included file.
For example:

```yaml
include:
  - component: gitlab.com/the-namespace/the-project/the-component@1.0
    inputs:
      stage: my-stage
  - local: path/to/file.yml
    inputs:
      stage: my-stage
```

### Include the same file multiple times

You can include the same file multiple times, with different inputs. However, if multiple jobs
with the same name are added to one pipeline, each additional job overwrites the previous job
with the same name. You must ensure the configuration prevents duplicate job names.

For example, including the same configuration multiple times with different inputs:

```yaml
include:
  - local: path/to/my-super-linter.yml
    inputs:
      type: docs
      lint-path: "doc/"
  - local: path/to/my-super-linter.yml
    inputs:
      type: yaml
      lint-path: "data/yaml/"
```

The configuration in `path/to/my-super-linter.yml` ensures the job has a unique name
each time it is included:

```yaml
spec:
  inputs:
    type:
    lint-path:
---
"run-$[[ inputs.type ]]-lint":
  script: ./lint --$[[ inputs.type ]] --path=$[[ inputs.lint-path ]]
```

## Specify functions to manipulate input values

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/409462) in GitLab 16.3.

You can specify predefined functions in the interpolation block to manipulate the input value.
The format supported is the following:

```yaml
$[[ input.input-id | <function1> | <function2> | ... <functionN> ]]
```

Details:

- Only [predefined interpolation functions](#predefined-interpolation-functions) are permitted.
- A maximum of 3 functions may be specified in a single interpolation block.
- The functions are executed in the sequence they are specified.

```yaml
spec:
  inputs:
    test:
      default: 'test $MY_VAR'
---

test-job:
  script: echo $[[ inputs.test | expand_vars | truncate(5,8) ]]
```

In this example, assuming the input uses the default value and `$MY_VAR` is an unmasked project variable with value `my value`:

1. First, the function [`expand_vars`](#expand_vars) expands the value to `test my value`.
1. Then [`truncate`](#truncate) applies to `test my value` with a character offset of `5` and length `8`.
1. The output of `script` would be `echo my value`.

### Predefined interpolation functions

#### `expand_vars`

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/387632) in GitLab 16.5.

Use `expand_vars` to expand [CI/CD variables](../variables/index.md) in the input value.

Only variables you can [use with the `include` keyword](includes.md#use-variables-with-include) and which are
**not** [masked](../variables/index.md#mask-a-cicd-variable) can be expanded.
[Nested variable expansion](../variables/where_variables_can_be_used.md#nested-variable-expansion) is not supported.

Example:

```yaml
$[[ inputs.test | expand_vars ]]
```

Assuming the value of `inputs.test` is `test $MY_VAR`, and the variable `$MY_VAR` is unmasked
with a value of `my value`, then the output would be `test my value`.

#### `truncate`

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/409462) in GitLab 16.3.

Use `truncate` to shorten the interpolated value. For example:

- `truncate(<offset>,<length>)`

| Name | Type | Description |
| ---- | ---- | ----------- |
| `offset` | Integer | Number of characters to offset by. |
| `length` | Integer | Number of characters to return after the offset. |

Example:

```yaml
$[[ inputs.test | truncate(3,5) ]]
```

Assuming the value of `inputs.test` is `0123456789`, then the output would be `34567`.
