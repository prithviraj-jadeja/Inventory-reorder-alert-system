const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const {updateItem,getItems,addItem,deleteItem,} = require("../controllers/alertController");
const { expect } = chai;

const MOCK_USER_ID = new mongoose.Types.ObjectId();
const MOCK_ITEM_ID = new mongoose.Types.ObjectId();

describe("addItem Function Tests", () => {
  let createStub; 
  afterEach(() => {
    if (createStub && createStub.restore) {
      createStub.restore();
    }
  });

  it("should create a new Item successfully", async () => {
    const req = {
      user: { id: MOCK_USER_ID },
      body: {
        name: "New Inventory Part",
        quantity: 50,
        reorderLevel: 10,
        unit: "units",
        supplier: "Supplier A",
      },
    };
    const createdItem = { _id: MOCK_ITEM_ID, ...req.body, user: MOCK_USER_ID };

    createStub = sinon.stub(Item, "create").resolves(createdItem);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addItem(req, res);

    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdItem)).to.be.true;
  });

  it('should return 400 if item name is missing (Adapting "without task title")', async () => {
    const req = {
      user: { id: MOCK_USER_ID },
      body: {
        quantity: 50,
        reorderLevel: 10,
        unit: "units",
        supplier: "Supplier A",
      },
    };

    const validationError = new Error(
      "Item validation failed: name: Path `name` is required."
    );
    validationError.name = "ValidationError";

    createStub = sinon.stub(Item, "create").throws(validationError);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addItem(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should return 409 for duplicate item (assuming unique constraint on name/user)", async () => {
  
    const req = {
      user: { id: MOCK_USER_ID },
      body: { name: "Existing Item Name", quantity: 50, reorderLevel: 10 },
    };

    const duplicateKeyError = new Error("duplicate key error collection");
    duplicateKeyError.code = 11000;

    createStub = sinon.stub(Item, "create").throws(duplicateKeyError);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addItem(req, res);

    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Item already exists"})).to.be
      .true;
  });
});


describe("updateItem Function Tests", () => {
  let findByIdStub; // Variable to hold the stub

  // FIX for T004/T005 failure
  afterEach(() => {
    if (findByIdStub && findByIdStub.restore) {
      findByIdStub.restore();
    }
  });

  it("should update item successfully", async () => {
    const existingItem = {
      _id: MOCK_ITEM_ID,
      name: "Old Part Name",
      quantity: 30,
      user: MOCK_USER_ID,
      save: sinon.stub().resolvesThis(), // Mock save method
    };

    findByIdStub = sinon.stub(Item, "findById").resolves(existingItem);

    const req = {
      params: { id: MOCK_ITEM_ID },
      body: { name: "Updated Part Name", quantity: 45 },
      user: { id: MOCK_USER_ID },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateItem(req, res);

    expect(existingItem.name).to.equal("Updated Part Name");
    expect(existingItem.quantity).to.equal(45);
    expect(existingItem.save.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should return 400 if invalid input (e.g., non-number for quantity) is provided", async () => {
    // FIX for T005: Assuming controller catches the error from .save() and returns 400
    const existingItem = {
      _id: MOCK_ITEM_ID,
      quantity: 30,
      user: MOCK_USER_ID,
      // Simulate save throwing a validation/cast error
      save: sinon
        .stub()
        .throws(Object.assign(new Error('Cast to number failed for value "not-a-number"'), { name: 'CastError' })),
    };
    findByIdStub = sinon.stub(Item, "findById").resolves(existingItem);

    const req = {
      params: { id: MOCK_ITEM_ID },
      body: { quantity: "not-a-number" },
      user: { id: MOCK_USER_ID },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateItem(req, res);

    expect(existingItem.save.calledOnce).to.be.true;
    expect(res.status.calledWith(400)).to.be.true; // 400 Bad Request
    expect(res.json.calledOnce).to.be.true;
  });
});


describe("deleteItem Function Tests", () => {
  let findByIdStub; // Variable to hold the stub

  afterEach(() => {
    if (findByIdStub && findByIdStub.restore) {
      findByIdStub.restore();
    }
  });

  it("should delete an item successfully", async () => {
    const item = {
        user: MOCK_USER_ID,
        remove: sinon.stub().resolves()
    };

    findByIdStub = sinon.stub(Item, "findById").resolves(item);

    const req = { 
        params: { id: MOCK_ITEM_ID.toString() },
        user: { id: MOCK_USER_ID },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteItem(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(item.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: "Item deleted" })).to.be.true;
  });

  
  it("should return 404 if non-existent item deletion is attempted", async () => {
    findByIdStub = sinon.stub(Item, "findById").resolves(null);

    const req = { params: { id: MOCK_ITEM_ID.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteItem(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Item not found" })).to.be.true;
  });
});


describe("getItems Function Test", () => {
  let findStub;

  afterEach(() => {
    if (findStub && findStub.restore) {
      findStub.restore();
    }
  });

  it("should return a list of all items displayed correctly", async () => {
    // Mock data for the successful response
    const mockItems = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Screw Driver",
        quantity: 10,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Wrench Set",
        quantity: 5,
      },
    ];

    // Stub the find method to return the mock data
    findStub = sinon.stub(Item, "find").resolves(mockItems);

    // Mock an empty request object since no user ID is needed
    const req = {}; 

    // Mock the response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getItems(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.calledWith({})).to.be.true; // Check that it was called with an empty object as a filter.
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockItems)).to.be.true;
  });

  // it("should return 500 if an error occurs while fetching items", async () => {
  //   findStub = sinon.stub(Item, "find").throws(new Error("DB Fetch Error"));

  //   const req = {}; 

  //   const res = {
  //     status: sinon.stub().returnsThis(),
  //     json: sinon.spy(),
  //   };

  //   await getItems(req, res);

  //   expect(res.status.calledWith(500)).to.be.true;
  //   expect(res.json.calledWithMatch({ message: "DB Fetch Error" })).to.be.true;
  // });
});