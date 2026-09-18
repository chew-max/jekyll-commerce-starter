# Jekyll Commerce Starter

A reusable Jekyll ecommerce storefront designed to work with the Jekyll Commerce API.

The starter provides a configurable storefront, product catalog, collections, cart, checkout, order status, policy pages, SEO metadata, and GitHub Pages deployment.

## Store Configuration

Store-specific frontend configuration is intentionally centralized.

### `_config.yml`

Update these values when cloning the storefront:

- `title`
- `description`
- `url`
- `baseurl`
- `logo`

For a repository-based GitHub Pages site, `baseurl` will normally contain the repository path.

For a storefront hosted at the root of a custom domain, it will normally be:

```yaml
baseurl: ""