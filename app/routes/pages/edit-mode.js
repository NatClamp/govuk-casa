/**
 * Set `req.inEditMode` and `req.editOriginUrl` attributes.
 *
 * Note `req.query.*` are all uri-decoded prior to this point.
 */

module.exports = (mountUrl, allowPageEdit) => (req, res, next) => {
  let inEditMode = false;
  let editOriginUrl = '';
  let urlPrefix = mountUrl;
  if (req.journeyActive && req.journeyActive.guid) {
    urlPrefix = `${urlPrefix}${req.journeyActive.guid}`
  }
  const DEFAULT_REVIEW_URL = `${urlPrefix}/review`.replace(/\/+/g, '/');

  if (allowPageEdit) {
    if (req.method === 'GET') {
      inEditMode = req.query && 'edit' in req.query;
      editOriginUrl = req.query && 'editorigin' in req.query ? req.query.editorigin : DEFAULT_REVIEW_URL;
    } else if (req.method === 'POST') {
      inEditMode = req.body && 'edit' in req.body;
      editOriginUrl = req.body && 'editorigin' in req.body ? req.body.editorigin : DEFAULT_REVIEW_URL;
    }
  }

  // Clean up
  if (req.query && 'edit' in req.query) {
    delete req.query.edit;
  }
  if (req.body && 'edit' in req.body) {
    delete req.body.edit;
  }
  if (req.query && 'editorigin' in req.query) {
    delete req.query.editorigin;
  }
  if (req.body && 'editorigin' in req.body) {
    delete req.body.editorigin;
  }

  req.inEditMode = inEditMode;
  req.editOriginUrl = editOriginUrl.replace(/[^a-z0-9\-/]/ig, '').replace(/\/+/g, '/');
  next();
};
