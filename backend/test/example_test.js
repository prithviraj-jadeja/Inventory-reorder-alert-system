
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Item = require('../models/Item');
const { updateItem,getItems,addItem,deleteItem } = require('../controllers/alertController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddItem Function Test', () => {

  it('should create a new Item successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: "New Item", quantity: 30, reorderLevel: 20, unit:"pcs",supplier:"XYZ company" }
    };

    // Mock item that would be created
    const createdItem = { _id: new mongoose.Types.ObjectId(), ...req.body};

    // Stub Item.create to return the createdItem
    const createStub = sinon.stub(Item, 'create').resolves(createdItem);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addItem(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdItem)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Item.create to throw an error
    const createStub = sinon.stub(Item, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: "New Item", quantity: 30, reorderLevel: 20, unit:"pcs",supplier:"XYZ company"}
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addItem(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update item successfully', async () => {
    // Mock item data
    const itemId = new mongoose.Types.ObjectId();
    const existingItem = {
      _id: itemId,
      name: "Old Item", 
      quantity: 30, 
      reorderLevel: 20, 
      unit:"pcs",
      supplier:"XYZ company",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Item.findById to return mock item
    const findByIdStub = sinon.stub(Item, 'findById').resolves(existingItem);

    // Mock request & response
    const req = {
      params: { id: itemId },
      body: { name: "New Item", quantity: 40 }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateItem(req, res);

    // Assertions
    expect(existingItem.name).to.equal("New Item");
    expect(existingItem.quantity).to.equal(40);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if item is not found', async () => {
    const findByIdStub = sinon.stub(Item, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateItem(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Item, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateItem(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});

describe('DeleteItem Function Test', () => {

  it('should delete a item successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock item found in the database
    const item = { remove: sinon.stub().resolves() };

    // Stub Item.findById to return the mock item
    const findByIdStub = sinon.stub(Item, 'findById').resolves(item);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(item.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Item deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if item is not found', async () => {
    // Stub Item.findById to return null
    const findByIdStub = sinon.stub(Item, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Item.findById to throw an error
    const findByIdStub = sinon.stub(Item, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteItem(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});