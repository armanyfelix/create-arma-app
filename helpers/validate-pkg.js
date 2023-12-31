// eslint-disable-next-line import/no-extraneous-dependencies
import validateProjectName from 'validate-npm-package-name'

export default function validateNpmName(name) {
  const nameValidation = validateProjectName(name)
  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  }
}
