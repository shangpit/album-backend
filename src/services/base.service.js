export class BaseService {
  constructor(model) {
    this.model = model;
  }

  getAll = async () => {};

  getOneById = async (id) => {};

  createOne = async (doc) => {};

  createMany = async (docs) => {};

  deleteOne = async (id) => {};

  deleteMany = async (ids) => {};
}