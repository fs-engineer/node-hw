export const ExitCode = {
  success: 0,
  error: 1,
};

export const handleError = err => {
  if (err) {
    console.error(err.message + ' unique');
    process.exit(ExitCode.error);
  }
};
