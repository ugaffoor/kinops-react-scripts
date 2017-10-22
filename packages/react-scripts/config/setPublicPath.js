// In the production build we need to set the public path based on the bundle's
// deployed location. The 'bundle' global variable has a helper (set in the
// webpack jsp) that tells us where it is deployed.
__webpack_public_path__ = window.bundle.config.staticLocation + '/';
