const { expect } = require('chai');

const createHandler = require('../../../../app/routes/pages/edit-mode.js');

describe('Routes: edit-mode extraction', () => {
  describe('Initialisation', () => {
    it('should return a function', () => {
      expect(createHandler()).to.be.an.instanceof(Function);
    });
  });

  describe('Edit mode setting', () => {
    it('should be false when not in GET query', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'GET',
        query: {},
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(false);
    });

    it('should be false when not in POST body', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'POST',
        body: {},
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(false);
    });

    it('should be false when in GET query, but global setting is disabled', () => {
      const handler = createHandler('/', false);
      const stubReq = {
        method: 'GET',
        query: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(false);
    });

    it('should be false when in POST body, but global setting is disabled', () => {
      const handler = createHandler('/', false);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(false);
    });

    it('should be true when in GET query, and global setting is enabled', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'GET',
        query: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(true);
    });

    it('should be true when in POST body, and global setting is enabled', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('inEditMode').that.equals(true);
    });

    it('should remove the edit parameter from request query and body', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
        },
        query: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq.body).to.not.have.property('edit');
      expect(stubReq.query).to.not.have.property('edit');
    });
  });

  describe('Edit origin url', () => {
    it('should default to /review when not defined in GET query', () => {
      const handler = createHandler('/test/', true);
      const stubReq = {
        method: 'GET',
        query: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('editOriginUrl').that.equals('/test/review');
    });

    it('should default to /review when not defined in POST body', () => {
      const handler = createHandler('/test/', true);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('editOriginUrl').that.equals('/test/review');
    });

    it('should default to empty string when defined in GET query, but global setting disabled', () => {
      const handler = createHandler('/test/', false);
      const stubReq = {
        method: 'GET',
        query: {
          edit: true,
          editorigin: 'ignored',
        },
      };
      handler(stubReq, null, () => {});
      return expect(stubReq).to.have.property('editOriginUrl').that.is.empty;
    });

    it('should default to empty string when defined in POST body, but global setting disabled', () => {
      const handler = createHandler('/test/', false);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
          editorigin: 'ignored',
        },
      };
      handler(stubReq, null, () => {});
      return expect(stubReq).to.have.property('editOriginUrl').that.is.empty;
    });

    it('should escape all non-valid characters when defined in GET query', () => {
      const handler = createHandler('/test/', true);
      const stubReq = {
        method: 'GET',
        query: {
          edit: true,
          editorigin: '!@£$%^&*()_+€#=\\\u0100\xFF ////this/is-a/valid/p4rt   ',
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('editOriginUrl').that.equals('/this/is-a/valid/p4rt');
    });

    it('should escape all non-valid characters when defined in POST body', () => {
      const handler = createHandler('/test/', true);
      const stubReq = {
        method: 'POST',
        body: {
          edit: true,
          editorigin: '!@£$%^&*()_+€#=\\\u0100\xFF ////this/is-a/valid/p4rt   ',
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq).to.have.property('editOriginUrl').that.equals('/this/is-a/valid/p4rt');
    });

    it('should remove the editorigin parameter from request query and body', () => {
      const handler = createHandler('/', true);
      const stubReq = {
        method: 'POST',
        body: {
          editorigin: '',
        },
        query: {
          editorigin: '',
        },
      };
      handler(stubReq, null, () => {});
      expect(stubReq.body).to.not.have.property('editorigin');
      expect(stubReq.query).to.not.have.property('editorigin');
    });
  });
});
