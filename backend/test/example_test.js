const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
// const Item = require("../models/Item");
const Factory = require("../models/Factory");
const Item = Factory.create('Item');
const {updateItem,getItems,addItem,deleteItem,} = require("../controllers/alertController");
const { expect } = chai;

const MOCK_USER_ID = new mongoose.Types.ObjectId();
const MOCK_ITEM_ID = new mongoose.Types.ObjectId();

describe("addItem Test", () => {
  let createStub; 
  afterEach(() => {
    if (createStub && createStub.restore) {
      createStub.restore();
    }
  });

  it("should create a new Item", async () => {
    const req = {
      user: { id: MOCK_USER_ID },
      body: {
        name: "New Item",
        quantity: 50,
        reorderLevel: 10,
        unit: "units",
        supplier: "Supplier ABC",
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

  it('should return 400 if item name is missing', async () => {
    const req = {
      user: { id: MOCK_USER_ID },
      body: {
        quantity: 50,
        reorderLevel: 10,
        unit: "units",
        supplier: "Supplier ABC",
      },
    };

    const validationError = new Error(
      "`Name is required."
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

  it("should return 409 for duplicate item", async () => {
  
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


describe("updateItem Test", () => {
  let findByIdStub; 

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
      save: sinon.stub().resolvesThis(),
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

  it("should return 400 if invalid input", async () => {
    const existingItem = {
      _id: MOCK_ITEM_ID,
      quantity: 30,
      user: MOCK_USER_ID,
      save: sinon
        .stub()
        .throws(Object.assign(new Error('failed for value not-a-number'), { name: 'CastError' })),
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
    expect(res.status.calledWith(400)).to.be.true; 
    expect(res.json.calledOnce).to.be.true;
  });
});


describe("deleteItem Test", () => {
  let findByIdStub;

  afterEach(() => {
    if (findByIdStub && findByIdStub.restore) {
      findByIdStub.restore();
    }
  });

  it("should delete an item", async () => {
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

  
  it("should return 404 if non-existent", async () => {
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


describe("getItems Test", () => {
  let findStub;

  afterEach(() => {
    if (findStub && findStub.restore) {
      findStub.restore();
    }
  });

  it("should return a list of all item", async () => {
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

    findStub = sinon.stub(Item, "find").resolves(mockItems);

    const req = {}; 

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getItems(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(findStub.calledWith({})).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockItems)).to.be.true;
  });

  it("should return 500 if an error occurs while fetching items", async () => {
    findStub = sinon.stub(Item, "find").throws(new Error("DB Fetch Error"));

    const req = {}; 

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getItems(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Fetch Error" })).to.be.true;
  });
});