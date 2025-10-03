import React from "react";

export class ModalPrototype {
  constructor({ title = "", message = "", type = "info", onClose = null }) {
    this.title = title;
    this.message = message;
    this.type = type; // success, error, info, warning
    this.onClose = onClose;
  }

  clone(overrides) {
    return new ModalPrototype({ ...this, ...overrides });
  }

  render(onClose) {
    const bgColor =
      this.type === "success"
        ? "bg-green-600"
        : this.type === "error"
        ? "bg-red-400"
        : "bg-blue-400";

    return (
      <div className="fixed inset-0 flex items-center text- center justify-center bg-black bg-opacity-40">
        <div className="bg-cyan-500 rounded shadow-lg p-6 w-96">
          <h2 className={`text-xl font-bold mb-4 ${bgColor} text-white p-2 rounded`}>
            {this.title}
          </h2>
          <p className="mb-6">{this.message}</p>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded"
            onClick={this.onClose || onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}