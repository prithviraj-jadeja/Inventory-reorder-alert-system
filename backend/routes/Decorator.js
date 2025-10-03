class ControllerDecorator {
  constructor(handler, preHandlers = []) {
    this.handler = handler;          
    this.preHandlers = preHandlers;  
  }

  async handle(req, res, next) {
    try {
      for (const fn of this.preHandlers) {
        await new Promise((resolve, reject) =>
          fn(req, res, (err) => (err ? reject(err) : resolve()))
        );
      }
      return this.handler(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  static wrap(handler, ...pre) {
    const d = new ControllerDecorator(handler, pre);
    return (req, res, next) => d.handle(req, res, next);
  }
}

module.exports = ControllerDecorator;
