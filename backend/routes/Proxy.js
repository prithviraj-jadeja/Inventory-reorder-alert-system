class HandlerProxy {
  constructor(realHandler, preHandlers = []) {
    this.realHandler = realHandler;      
    this.preHandlers = preHandlers;      
  }

  async handle(req, res, next) {
    try {
      for (const fn of this.preHandlers) {
        await new Promise((resolve, reject) =>
          fn(req, res, (err) => (err ? reject(err) : resolve()))
        );
      }
      return this.realHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = HandlerProxy;
