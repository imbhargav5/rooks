const doesIdentifierMatchKeyboardEvent = (
  error: KeyboardEvent,
  identifier: number | string
): boolean => {
  if (
    error.key === identifier ||
    error.code === identifier ||
    error.keyCode === identifier ||
    error.which === identifier ||
    error.charCode === identifier
  ) {
    return true;
  }

  return false;
};

export { doesIdentifierMatchKeyboardEvent };
