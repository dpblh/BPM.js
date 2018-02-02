export class TehError {
  constructor(message, process) {
    this.process = process;
    this.message = message;
  }
}
export class Error {
  constructor(message) {
    this.message = message;
  }
}
export class ParseConditionError extends Error {
  type = 'ParseConditionError';
}
export class ParseRolesError extends Error {
  type = 'ParseRolesError';
}

export class HandlerError extends Error {
  type = 'HandlerError';
}
export class BehaviorError extends Error {
  type = 'BehaviorError';
}

export default TehError;
